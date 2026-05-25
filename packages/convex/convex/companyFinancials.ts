import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

/**
 * Get all financial records for a company, ordered by year descending.
 */
export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("companyFinancials")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.collect();
	},
});

/**
 * Get financial record for a specific company and year.
 */
export const getByYear = query({
	args: {
		companyId: v.id("crmCompanies"),
		year: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("companyFinancials")
			.withIndex("by_company_year", (q) =>
				q.eq("companyId", args.companyId).eq("year", args.year),
			)
			.first();
	},
});

/**
 * Create a financial record.
 */
export const create = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		year: v.number(),
		revenue: v.number(),
		ebitda: v.number(),
		netIncome: v.optional(v.number()),
		freeCashFlow: v.optional(v.number()),
		ownerCompensation: v.optional(v.number()),
		ownerBenefits: v.optional(v.number()),
		totalDebt: v.optional(v.number()),
		tangibleAssets: v.optional(v.number()),
		currentAssets: v.optional(v.number()),
		currentLiabilities: v.optional(v.number()),
		notes: v.optional(v.string()),
		source: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.insert("companyFinancials", {
			...args,
			createdAt: Date.now(),
		});
	},
});

/**
 * Update a financial record.
 */
export const update = mutation({
	args: {
		id: v.id("companyFinancials"),
		revenue: v.optional(v.number()),
		ebitda: v.optional(v.number()),
		netIncome: v.optional(v.number()),
		freeCashFlow: v.optional(v.number()),
		ownerCompensation: v.optional(v.number()),
		ownerBenefits: v.optional(v.number()),
		totalDebt: v.optional(v.number()),
		tangibleAssets: v.optional(v.number()),
		currentAssets: v.optional(v.number()),
		currentLiabilities: v.optional(v.number()),
		notes: v.optional(v.string()),
		source: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const { id, ...updates } = args;
		const clean: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(updates)) {
			if (value !== undefined) clean[key] = value;
		}
		clean.updatedAt = Date.now();
		await ctx.db.patch(id, clean);
		return { success: true };
	},
});
