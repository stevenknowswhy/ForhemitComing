import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { internalAction, mutation } from "./_generated/server";
import { NOTIFICATION_RECIPIENTS, sendAndLogEmail } from "./emailCore";

/**
 * Communication preferences behind the /opt-in page (A3 fix, 2026-11-21).
 * Until now the opt-in and opt-out forms were a simulation — nothing was
 * saved and no email was sent. These mutations are the real backend:
 * modeled on notifySignups.ts (public mutation -> scheduled internal
 * notify action -> sendAndLogEmail, fire-and-forget), except the notify
 * goes to NOTIFICATION_RECIPIENTS (Stefano + Muse, checklist A2) with
 * reply-to set to the visitor.
 */

const notifyArgs = {
	kind: v.union(v.literal("opt-in"), v.literal("opt-out")),
	email: v.optional(v.string()),
	phone: v.optional(v.string()),
	marketingEmail: v.boolean(),
	marketingSms: v.boolean(),
	educational: v.boolean(),
	opportunities: v.boolean(),
	withdrawnChannels: v.optional(v.array(v.string())),
	sourcePage: v.string(),
};

/**
 * Opt-in / preference update. Upserts on the normalized email: a repeat
 * submit patches the existing row's consent flags instead of inserting
 * a second row.
 */
export const submit = mutation({
	args: {
		email: v.string(),
		phone: v.optional(v.string()),
		marketingEmail: v.boolean(),
		marketingSms: v.boolean(),
		educational: v.boolean(),
		opportunities: v.boolean(),
		sourcePage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const normalizedEmail = args.email.toLowerCase().trim();
		if (!normalizedEmail) {
			throw new Error("Email is required");
		}
		const phone = args.phone?.trim() || undefined;
		const sourcePage = args.sourcePage ?? "/opt-in";
		const now = Date.now();

		const existing = await ctx.db
			.query("communicationPreferences")
			.withIndex("by_email", (q) => q.eq("email", normalizedEmail))
			.first();

		let id: Id<"communicationPreferences">;
		if (existing) {
			await ctx.db.patch(existing._id, {
				phone: phone ?? existing.phone,
				marketingEmail: args.marketingEmail,
				marketingSms: args.marketingSms,
				educational: args.educational,
				opportunities: args.opportunities,
				sourcePage,
				updatedAt: now,
			});
			id = existing._id;
		} else {
			id = await ctx.db.insert("communicationPreferences", {
				email: normalizedEmail,
				phone,
				marketingEmail: args.marketingEmail,
				marketingSms: args.marketingSms,
				educational: args.educational,
				opportunities: args.opportunities,
				sourcePage,
				createdAt: now,
				updatedAt: now,
			});
		}

		await ctx.db.insert("auditLogs", {
			action: existing ? "update" : "create",
			entityType: "communicationPreference",
			entityId: id,
			timestamp: now,
		});

		// Fire-and-forget: saving preferences must not fail because the
		// notify email did.
		await ctx.scheduler.runAfter(
			0,
			internal.communicationPreferences.notifyAdmin,
			{
				kind: "opt-in" as const,
				email: normalizedEmail,
				phone,
				marketingEmail: args.marketingEmail,
				marketingSms: args.marketingSms,
				educational: args.educational,
				opportunities: args.opportunities,
				sourcePage,
			},
		);

		return { success: true, id, isUpdate: !!existing };
	},
});

/**
 * Opt-out / withdraw consent. Matches an existing row by email first,
 * then by phone. The selected channels are switched off (email covers
 * every email-delivered category: marketing, educational, opportunities;
 * sms covers text messages; phone calls have no consent flag of their
 * own, so the channel is recorded in withdrawnChannels). If no row
 * matches, the request itself is recorded on a new all-false row so the
 * opt-out is never lost.
 */
export const withdraw = mutation({
	args: {
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		optOutEmail: v.boolean(),
		optOutSms: v.boolean(),
		optOutPhone: v.boolean(),
		sourcePage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const normalizedEmail = args.email?.toLowerCase().trim() || undefined;
		const phone = args.phone?.trim() || undefined;
		if (!normalizedEmail && !phone) {
			throw new Error("Email or phone number is required to opt out");
		}
		const sourcePage = args.sourcePage ?? "/opt-in";
		const now = Date.now();

		const channels: string[] = [];
		if (args.optOutEmail) channels.push("email");
		if (args.optOutSms) channels.push("sms");
		if (args.optOutPhone) channels.push("phone");

		let existing = normalizedEmail
			? await ctx.db
					.query("communicationPreferences")
					.withIndex("by_email", (q) => q.eq("email", normalizedEmail))
					.first()
			: null;
		if (!existing && phone) {
			existing = await ctx.db
				.query("communicationPreferences")
				.withIndex("by_phone", (q) => q.eq("phone", phone))
				.first();
		}

		let id: Id<"communicationPreferences">;
		if (existing) {
			await ctx.db.patch(existing._id, {
				...(args.optOutEmail
					? { marketingEmail: false, educational: false, opportunities: false }
					: {}),
				...(args.optOutSms ? { marketingSms: false } : {}),
				withdrawnChannels: Array.from(
					new Set([...(existing.withdrawnChannels ?? []), ...channels]),
				),
				withdrawnAt: now,
				updatedAt: now,
			});
			id = existing._id;
		} else {
			id = await ctx.db.insert("communicationPreferences", {
				email: normalizedEmail,
				phone,
				marketingEmail: false,
				marketingSms: false,
				educational: false,
				opportunities: false,
				sourcePage,
				withdrawnChannels: channels,
				withdrawnAt: now,
				createdAt: now,
				updatedAt: now,
			});
		}

		await ctx.db.insert("auditLogs", {
			action: "update",
			entityType: "communicationPreference",
			entityId: id,
			timestamp: now,
		});

		await ctx.scheduler.runAfter(
			0,
			internal.communicationPreferences.notifyAdmin,
			{
				kind: "opt-out" as const,
				email: normalizedEmail ?? existing?.email,
				phone: phone ?? existing?.phone,
				marketingEmail: false,
				marketingSms: false,
				educational: false,
				opportunities: false,
				withdrawnChannels: channels,
				sourcePage,
			},
		);

		return { success: true, id, matchedExisting: !!existing };
	},
});

/**
 * Internal action scheduled per opt-in / opt-out. Runs without user auth
 * in scheduler context (same shape as notifySignups.notifyAdmin) and
 * emails both notification inboxes via the existing Resend integration.
 * A missing RESEND_API_KEY degrades to a logged failure — it never
 * throws the saved preferences away.
 */
export const notifyAdmin = internalAction({
	args: notifyArgs,
	handler: async (ctx, args) => {
		const isOptIn = args.kind === "opt-in";
		const who = args.email || args.phone || "unknown";
		const yesNo = (b: boolean) => (b ? "Yes" : "No");
		const detailRows = isOptIn
			? `
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Email marketing:</strong></td>
              <td style="padding: 8px 0;">${yesNo(args.marketingEmail)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>SMS/text:</strong></td>
              <td style="padding: 8px 0;">${yesNo(args.marketingSms)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Educational:</strong></td>
              <td style="padding: 8px 0;">${yesNo(args.educational)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Opportunities:</strong></td>
              <td style="padding: 8px 0;">${yesNo(args.opportunities)}</td>
            </tr>`
			: `
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Opted out of:</strong></td>
              <td style="padding: 8px 0;">${(args.withdrawnChannels ?? []).join(", ") || "—"}</td>
            </tr>`;

		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          ${isOptIn ? "New Communication Preferences" : "Opt-Out Request"}
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${args.email ? `<a href="mailto:${args.email}">${args.email}</a>` : "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone || "—"}</td>
            </tr>
            ${detailRows}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source page:</strong></td>
              <td style="padding: 8px 0;">${args.sourcePage}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toISOString()}</td>
            </tr>
          </table>
        </div>
        <p style="color: #999; font-size: 12px;">
          Sent from the Forhemit communication preferences page (/opt-in).
        </p>
      </div>
    `;
		const text = `
${isOptIn ? "New communication preferences" : "Opt-out request"}

Email: ${args.email || "—"}
Phone: ${args.phone || "—"}
${
	isOptIn
		? `Email marketing: ${yesNo(args.marketingEmail)}
SMS/text: ${yesNo(args.marketingSms)}
Educational: ${yesNo(args.educational)}
Opportunities: ${yesNo(args.opportunities)}`
		: `Opted out of: ${(args.withdrawnChannels ?? []).join(", ") || "—"}`
}
Source page: ${args.sourcePage}
Date: ${new Date().toISOString()}
    `.trim();

		return sendAndLogEmail(
			ctx,
			{
				to: NOTIFICATION_RECIPIENTS,
				subject: isOptIn
					? `New opt-in preferences: ${who}`
					: `Opt-out request: ${who}`,
				html,
				text,
				replyTo: args.email,
			},
			{ templateId: "communication-preferences" },
		);
	},
});
