import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new interaction entry.
 * Either companyId or contactId (or both) should be provided.
 */
export const create = mutation({
	args: {
		type: v.string(),
		summary: v.string(),
		sentiment: v.optional(v.string()),
		contactId: v.optional(v.id("crmContacts")),
		companyId: v.optional(v.id("crmCompanies")),
		withWhomName: v.optional(v.string()),
		performedBy: v.optional(v.string()),
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		date: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		const id = await ctx.db.insert("crmInteractions", {
			...args,
			createdAt: now,
		});

		// Auto-update lastContactDate on the linked contact
		if (args.contactId) {
			const contact = await ctx.db.get(args.contactId);
			if (
				contact &&
				(!contact.lastContactDate || args.date > contact.lastContactDate)
			) {
				await ctx.db.patch(args.contactId, {
					lastContactDate: args.date,
					updatedAt: now,
				});
			}
		}

		return id;
	},
});

/**
 * Update an existing interaction entry.
 */
export const update = mutation({
	args: {
		id: v.id("crmInteractions"),
		type: v.optional(v.string()),
		summary: v.optional(v.string()),
		sentiment: v.optional(v.string()),
		contactId: v.optional(v.id("crmContacts")),
		companyId: v.optional(v.id("crmCompanies")),
		withWhomName: v.optional(v.string()),
		performedBy: v.optional(v.string()),
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		nextActionCompleted: v.optional(v.boolean()),
		date: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const { id, ...fields } = args;
		const existing = await ctx.db.get(id);
		if (!existing) throw new Error("Interaction not found");

		// Only update defined fields
		const updates: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(fields)) {
			if (value !== undefined) {
				updates[key] = value;
			}
		}

		if (Object.keys(updates).length > 0) {
			await ctx.db.patch(id, updates);
		}

		return id;
	},
});

/**
 * Delete an interaction entry.
 */
export const remove = mutation({
	args: { id: v.id("crmInteractions") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.delete(args.id);
		return { success: true };
	},
});

// ── Queries ──────────────────────────────────────────────────────────────────

/**
 * List interactions for a company, most recent first.
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 50;
		return await ctx.db
			.query("crmInteractions")
			.withIndex("by_company_date", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.take(limit);
	},
});

/**
 * List interactions for a contact, most recent first.
 */
export const listByContact = query({
	args: {
		contactId: v.id("crmContacts"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 50;
		return await ctx.db
			.query("crmInteractions")
			.withIndex("by_contact_date", (q) => q.eq("contactId", args.contactId))
			.order("desc")
			.take(limit);
	},
});

/**
 * Get the most recent interaction for a company.
 * Used to derive lastContactDate for the company record.
 */
export const getLatestByCompany = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		const results = await ctx.db
			.query("crmInteractions")
			.withIndex("by_company_date", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.take(1);
		return results[0] ?? null;
	},
});

/**
 * Get the most recent interaction for a contact.
 * Used to derive lastContactDate for the contact record.
 */
export const getLatestByContact = query({
	args: { contactId: v.id("crmContacts") },
	handler: async (ctx, args) => {
		const results = await ctx.db
			.query("crmInteractions")
			.withIndex("by_contact_date", (q) => q.eq("contactId", args.contactId))
			.order("desc")
			.take(1);
		return results[0] ?? null;
	},
});

/**
 * Get upcoming actions (nextActionDate <= today).
 * Used by the dashboard for "today's action items".
 */
export const getUpcomingActions = query({
	args: {
		today: v.string(), // ISO date YYYY-MM-DD
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 20;
		return await ctx.db
			.query("crmInteractions")
			.withIndex("by_nextActionDate", (q) =>
				q.lte("nextActionDate", args.today),
			)
			.filter((q) => q.eq(q.field("nextActionCompleted"), undefined))
			.order("asc")
			.take(limit);
	},
});
