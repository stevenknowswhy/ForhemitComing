import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

// ============================================
// Email Event Logging
// ============================================

/**
 * Log an outbound email event
 */
export const logOutbound = mutation({
	args: {
		from: v.string(),
		to: v.string(),
		subject: v.string(),
		templateId: v.optional(v.string()),
		resendId: v.optional(v.string()),
		relatedCompanyId: v.optional(v.id("crmCompanies")),
		relatedContactId: v.optional(v.id("crmContacts")),
		metadata: v.optional(v.any()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const id = await ctx.db.insert("emailEvents", {
			direction: "outbound",
			from: args.from,
			to: args.to,
			subject: args.subject,
			templateId: args.templateId,
			resendId: args.resendId,
			status: "sent",
			relatedCompanyId: args.relatedCompanyId,
			relatedContactId: args.relatedContactId,
			metadata: args.metadata,
			createdAt: Date.now(),
		});

		if (args.relatedCompanyId) {
			const actor = await resolveActor(ctx);
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.EMAIL_SENT,
				category: "email",
				summary: `Email sent: ${args.subject}`,
				clientSummary: `Email sent: ${args.subject}`,
				source: "admin_ui",
				visibility: "external",
				companyId: args.relatedCompanyId,
				scopeType: "company",
				scopeId: args.relatedCompanyId,
				idempotencyKey: args.resendId, // Resend message ID for dedup
				metadata: {
					to: args.to,
					subject: args.subject,
					resendId: args.resendId,
				},
			});
		}

		return id;
	},
});

/**
 * Log an inbound email event
 */
export const logInbound = mutation({
	args: {
		from: v.string(),
		to: v.string(),
		subject: v.string(),
		resendId: v.optional(v.string()),
		relatedCompanyId: v.optional(v.id("crmCompanies")),
		relatedContactId: v.optional(v.id("crmContacts")),
		metadata: v.optional(v.any()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.insert("emailEvents", {
			direction: "inbound",
			from: args.from,
			to: args.to,
			subject: args.subject,
			resendId: args.resendId,
			status: "received",
			relatedCompanyId: args.relatedCompanyId,
			relatedContactId: args.relatedContactId,
			metadata: args.metadata,
			createdAt: Date.now(),
		});
	},
});

/**
 * Update email status (e.g., delivered, bounced)
 */
export const updateStatus = mutation({
	args: {
		id: v.id("emailEvents"),
		status: v.union(
			v.literal("sent"),
			v.literal("delivered"),
			v.literal("bounced"),
			v.literal("received"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const emailEvent = await ctx.db.get(args.id);
		await ctx.db.patch(args.id, { status: args.status });

		// Log delivery/bounce to business log
		if (emailEvent?.relatedCompanyId) {
			const statusMap: Record<string, string> = {
				delivered: LOG_ACTIONS.EMAIL_DELIVERED,
				bounced: LOG_ACTIONS.EMAIL_BOUNCED,
			};
			const eventType = statusMap[args.status];
			if (eventType) {
				const actor = await resolveActor(ctx);
				if (args.status === "delivered") {
					await logEvent(ctx, {
						...actor,
						eventType,
						category: "email",
						summary: `Email ${args.status}: ${emailEvent.subject}`,
						clientSummary: `Email delivered: ${emailEvent.subject}`,
						source: "webhook",
						visibility: "external",
						companyId: emailEvent.relatedCompanyId,
						scopeType: "company",
						scopeId: emailEvent.relatedCompanyId,
						idempotencyKey: emailEvent.resendId,
						metadata: { status: args.status, subject: emailEvent.subject },
					});
				} else {
					await logEvent(ctx, {
						...actor,
						eventType,
						category: "email",
						summary: `Email ${args.status}: ${emailEvent.subject}`,
						source: "webhook",
						visibility: "internal",
						companyId: emailEvent.relatedCompanyId,
						scopeType: "company",
						scopeId: emailEvent.relatedCompanyId,
						idempotencyKey: emailEvent.resendId,
						severity: "warning",
						metadata: { status: args.status, subject: emailEvent.subject },
					});
				}
			}
		}
	},
});

// ============================================
// Email Event Queries
// ============================================

/**
 * Get recent email events (paginated)
 */
export const listRecent = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("emailEvents")
			.withIndex("by_createdAt")
			.order("desc")
			.take(args.limit ?? 50);
	},
});

/**
 * Get emails for a specific company
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("emailEvents")
			.withIndex("by_company", (q) => q.eq("relatedCompanyId", args.companyId))
			.order("desc")
			.take(args.limit ?? 50);
	},
});

/**
 * Get emails by template type
 */
export const listByTemplate = query({
	args: {
		templateId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("emailEvents")
			.withIndex("by_template", (q) => q.eq("templateId", args.templateId))
			.order("desc")
			.take(args.limit ?? 50);
	},
});

/**
 * Get emails from a specific address
 */
export const listByFrom = query({
	args: {
		from: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("emailEvents")
			.withIndex("by_from", (q) => q.eq("from", args.from))
			.order("desc")
			.take(args.limit ?? 50);
	},
});

/**
 * Get emails to a specific address
 */
export const listByTo = query({
	args: {
		to: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("emailEvents")
			.withIndex("by_to", (q) => q.eq("to", args.to))
			.order("desc")
			.take(args.limit ?? 50);
	},
});

/**
 * Get email event by Resend ID
 */
export const getByResendId = query({
	args: {
		resendId: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const results = await ctx.db
			.query("emailEvents")
			.filter((q) => q.eq(q.field("resendId"), args.resendId))
			.first();
		return results;
	},
});
