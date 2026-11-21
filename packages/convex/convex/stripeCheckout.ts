// Stripe Checkout for the Self Guided Transition Service ($3,000 one-time).
// Spec: STRIPE-CHECKOUT-SPEC-2026-11-18.md (Stefano ruled the integrated route
// over a Payment Link stopgap, 2026-11-18).
//
// Ruled flow honoured: payment comes ONLY after approval — prequalify →
// Company Fit → application → approval → payment → onboarding. Nothing public
// links here; the applicant reaches the session through the site route
// /pay/<recordId>, which the approval email / portal stage links to.
//
// One selfServicePayments record per approved application. The record is
// created at approval time by createPaymentRecord (internal — called by the
// admin/approval step; the merge-time proof creates a test record the same
// way). createOrReuseSession mints a Stripe Checkout Session bound to the
// record (metadata carries the record ID), or reuses the still-open one;
// expired sessions are re-minted on revisit; a paid record never mints again.
// The webhook (http.ts, POST /stripe-webhook, signature-verified there) calls
// markPaid / markSessionExpired.
//
// Env (Convex): STRIPE_SECRET_KEY, STRIPE_PRICE_SELF_SERVICE. While either is
// unset, session creation reports "not_configured" and nothing is charged —
// the PR is safe to deploy before the keys are placed at merge time.
//
// Guardrails: the amount comes from the Stripe price object, never from
// client-supplied data. markPaid is idempotent — a duplicate
// checkout.session.completed changes nothing and does not re-notify. Logs
// carry amounts, record IDs, and event types only — never card or payer
// details (Stripe holds those; this code never sees them).

import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { ADMIN_EMAIL, sendAndLogEmail } from "./emailCore";

// Success/cancel land on the production site (the pay flow is exercised on
// production; the merge-time proof runs there end-to-end).
const SITE_URL = "https://www.forhemit.com";
const SERVICE_NAME = "Self Guided Transition Service";

/** Create the payment record for an approved application. Internal only. */
export const createPaymentRecord = internalMutation({
  args: {
    companyName: v.string(),
    applicantEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("selfServicePayments", {
      companyName: args.companyName,
      applicantEmail: args.applicantEmail,
      status: "awaiting_payment",
      createdAt: now,
      updatedAt: now,
    });
    console.log("stripeCheckout: payment record created", id);
    return id;
  },
});

export const getPaymentRecord = internalQuery({
  args: { paymentId: v.id("selfServicePayments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.paymentId);
  },
});

export const getPaymentBySession = internalQuery({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("selfServicePayments")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId),
      )
      .unique();
  },
});

/** Store the minted session on the record. Never touches a paid record. */
export const attachSession = internalMutation({
  args: {
    paymentId: v.id("selfServicePayments"),
    sessionId: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.paymentId);
    if (!record || record.status === "paid") return;
    await ctx.db.patch(args.paymentId, {
      stripeSessionId: args.sessionId,
      stripeSessionExpiresAt: args.expiresAt,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Mark a record paid from a signature-verified checkout.session.completed.
 * Idempotent: a duplicate event for an already-paid record changes nothing
 * and reports alreadyPaid so the caller does not notify twice.
 */
export const markPaid = internalMutation({
  args: {
    paymentId: v.id("selfServicePayments"),
    sessionId: v.string(),
    paymentIntent: v.optional(v.string()),
    amountTotal: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.paymentId);
    if (!record) return { ok: false, alreadyPaid: false };
    if (record.status === "paid") {
      console.log(
        "stripeCheckout: duplicate completed event ignored",
        args.paymentId,
        args.sessionId,
      );
      return { ok: true, alreadyPaid: true };
    }
    await ctx.db.patch(args.paymentId, {
      status: "paid",
      stripeSessionId: args.sessionId,
      stripePaymentIntent: args.paymentIntent,
      amountTotal: args.amountTotal,
      currency: args.currency,
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(
      "stripeCheckout: record marked paid",
      args.paymentId,
      args.amountTotal,
      args.currency,
    );
    return { ok: true, alreadyPaid: false };
  },
});

/** State hygiene for checkout.session.expired: the stored session is dead. */
export const markSessionExpired = internalMutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("selfServicePayments")
      .withIndex("by_stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId),
      )
      .unique();
    if (!record || record.status === "paid") return;
    await ctx.db.patch(record._id, {
      stripeSessionExpiresAt: 0,
      updatedAt: Date.now(),
    });
    console.log("stripeCheckout: session expired", record._id, args.sessionId);
  },
});

/**
 * Admin notification for a received payment, through the existing email path
 * (sendAndLogEmail sends via Resend and logs to emailEvents — reused, not
 * duplicated). Called by the webhook only for a newly-paid record.
 */
export const notifyPaymentReceived = internalAction({
  args: { paymentId: v.id("selfServicePayments") },
  handler: async (ctx, args) => {
    const record = await ctx.runQuery(
      internal.stripeCheckout.getPaymentRecord,
      { paymentId: args.paymentId },
    );
    if (!record || record.status !== "paid") return { sent: false };
    const amount =
      record.amountTotal !== undefined
        ? `$${(record.amountTotal / 100).toFixed(2)} ${(record.currency ?? "usd").toUpperCase()}`
        : "$3,000.00 USD";
    const subject = `${SERVICE_NAME} paid — ${record.companyName}`;
    const lines = [
      `Company: ${record.companyName}`,
      `Applicant: ${record.applicantEmail}`,
      `Amount: ${amount}`,
      `Payment record: ${record._id}`,
      `Stripe session: ${record.stripeSessionId ?? "—"}`,
      `Payment intent: ${record.stripePaymentIntent ?? "—"}`,
      "",
      "The record is marked paid and the onboarding stage can advance.",
    ];
    const result = await sendAndLogEmail(
      ctx,
      {
        to: ADMIN_EMAIL,
        subject,
        html: `<p>${lines.slice(0, 6).join("<br/>")}</p><p>The record is marked paid and the onboarding stage can advance.</p>`,
        text: lines.join("\n"),
      },
      { templateId: "self-service-payment" },
    );
    return { sent: result.success };
  },
});

type SessionResult =
  | { status: "open"; url: string }
  | { status: "paid" }
  | { status: "not_configured" }
  | { status: "not_found" }
  | { status: "error" };

/**
 * Mint or reuse the Checkout Session for an approved, unpaid record.
 * Called server-side by the site's /pay/<recordId> route. The amount always
 * comes from the Stripe price object (STRIPE_PRICE_SELF_SERVICE) — nothing
 * client-supplied influences it.
 */
export const createOrReuseSession = action({
  args: { paymentId: v.id("selfServicePayments") },
  handler: async (ctx, args): Promise<SessionResult> => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_SELF_SERVICE;
    if (!secretKey || !priceId) return { status: "not_configured" };

    const record = await ctx.runQuery(
      internal.stripeCheckout.getPaymentRecord,
      { paymentId: args.paymentId },
    );
    if (!record) return { status: "not_found" };
    if (record.status === "paid") return { status: "paid" };

    const authHeaders = { Authorization: "Bearer " + secretKey };

    // Reuse the stored session while Stripe says it is still open.
    if (record.stripeSessionId) {
      try {
        const resp = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${record.stripeSessionId}`,
          { headers: authHeaders },
        );
        if (resp.ok) {
          const session = await resp.json();
          if (session.payment_status === "paid" || session.status === "complete") {
            return { status: "paid" };
          }
          if (session.status === "open" && session.url) {
            return { status: "open", url: session.url };
          }
          // expired — fall through and mint a fresh session.
        }
      } catch {
        // Retrieval failed; minting a fresh session is safe (the old one,
        // if still open, simply goes unused and expires on its own).
      }
    }

    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("line_items[0][price]", priceId);
    form.set("line_items[0][quantity]", "1");
    form.set(
      "success_url",
      `${SITE_URL}/payment/success?payment=${args.paymentId}`,
    );
    form.set(
      "cancel_url",
      `${SITE_URL}/payment/cancel?payment=${args.paymentId}`,
    );
    form.set("client_reference_id", args.paymentId);
    form.set("metadata[convex_payment_id]", args.paymentId);
    form.set("payment_intent_data[metadata][convex_payment_id]", args.paymentId);

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    if (!resp.ok) {
      console.error(
        "stripeCheckout: session creation failed",
        resp.status,
        args.paymentId,
      );
      return { status: "error" };
    }
    const session = await resp.json();
    await ctx.runMutation(internal.stripeCheckout.attachSession, {
      paymentId: args.paymentId,
      sessionId: session.id,
      expiresAt: session.expires_at ?? 0,
    });
    console.log("stripeCheckout: session minted", args.paymentId, session.id);
    return { status: "open", url: session.url };
  },
});
