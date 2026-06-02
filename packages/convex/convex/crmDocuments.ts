import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new document entry.
 */
export const create = mutation({
	args: {
		companyId: v.optional(v.id("crmCompanies")),
		contactId: v.optional(v.id("crmContacts")),
		name: v.string(),
		type: v.string(),
		url: v.optional(v.string()),
		storageId: v.optional(v.string()),
		uploadedBy: v.optional(v.string()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.insert("crmDocuments", {
			...args,
			createdAt: Date.now(),
		});
	},
});

/**
 * Delete a document entry.
 */
export const remove = mutation({
	args: { id: v.id("crmDocuments") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.delete(args.id);
		return { success: true };
	},
});

// ── Queries ──────────────────────────────────────────────────────────────────

/**
 * List documents for a company.
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 50;
		return await ctx.db
			.query("crmDocuments")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.take(limit);
	},
});

/**
 * List documents for a contact.
 */
export const listByContact = query({
	args: {
		contactId: v.id("crmContacts"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 50;
		return await ctx.db
			.query("crmDocuments")
			.withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
			.order("desc")
			.take(limit);
	},
});
