import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, mutation } from "./_generated/server";
import { sendAndLogEmail } from "./emailCore";

// The canonical public inbox surfaced on /contact (mailto:contact@forhemit.com).
// Per the P1-8 decision, notify emails for new signups land here.
const NOTIFY_INBOX = "contact@forhemit.com";

/**
 * Public mutation behind the coming-soon "Get notified" capture (P1-8).
 * Dedupes on the normalized email: a repeat submit returns the original
 * row as an idempotent success instead of inserting a second row.
 */
export const submit = mutation({
	args: {
		email: v.string(),
		sourcePage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const normalizedEmail = args.email.toLowerCase().trim();
		if (!normalizedEmail) {
			throw new Error("Email is required");
		}
		const sourcePage = args.sourcePage ?? "/coming-soon";

		const existing = await ctx.db
			.query("notifySignups")
			.withIndex("by_email", (q) => q.eq("email", normalizedEmail))
			.first();
		if (existing) {
			return { success: true, id: existing._id, isDuplicate: true };
		}

		const id = await ctx.db.insert("notifySignups", {
			email: normalizedEmail,
			sourcePage,
			createdAt: Date.now(),
		});

		await ctx.db.insert("auditLogs", {
			action: "create",
			entityType: "notifySignup",
			entityId: id,
			timestamp: Date.now(),
		});

		// Fire-and-forget: the signup must not fail because the notify email did.
		await ctx.scheduler.runAfter(0, internal.notifySignups.notifyAdmin, {
			email: normalizedEmail,
			sourcePage,
		});

		return { success: true, id, isDuplicate: false };
	},
});

/**
 * Internal action scheduled per new signup. Runs without user auth in
 * scheduler context (same shape as notifyContactSubmissionTelegram) and
 * sends one notification to the public contact inbox via the existing
 * Resend integration. A missing RESEND_API_KEY degrades to a logged
 * failure — it never throws the signup away.
 */
export const notifyAdmin = internalAction({
	args: {
		email: v.string(),
		sourcePage: v.string(),
	},
	handler: async (ctx, args) => {
		const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New &ldquo;Get Notified&rdquo; Signup
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Source page:</strong></td>
              <td style="padding: 8px 0;">${args.sourcePage}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toISOString()}</td>
            </tr>
          </table>
        </div>
        <p style="color: #999; font-size: 12px;">
          Sent from the Forhemit coming-soon page notify capture.
        </p>
      </div>
    `;
		const text = `
New "Get notified" signup

Email: ${args.email}
Source page: ${args.sourcePage}
Date: ${new Date().toISOString()}
    `.trim();

		return sendAndLogEmail(
			ctx,
			{
				to: NOTIFY_INBOX,
				subject: `New notify signup: ${args.email}`,
				html,
				text,
			},
			{ templateId: "notify-signup" },
		);
	},
});
