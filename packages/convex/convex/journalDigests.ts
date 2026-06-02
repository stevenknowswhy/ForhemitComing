import { v } from "convex/values";
import {
	internalMutation,
	internalQuery,
	mutation,
	query,
} from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// Queries
// ============================================

export const get = query({
	args: { id: v.id("journalDigests") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

export const getByJournalAndWeek = query({
	args: {
		journalId: v.id("clientJournals"),
		weekStarting: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalDigests")
			.withIndex("byWeek", (q) =>
				q.eq("journalId", args.journalId).eq("weekStarting", args.weekStarting),
			)
			.first();
	},
});

export const listByJournal = query({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const all = await ctx.db.query("journalDigests").collect();
		return all
			.filter((d) => d.journalId === args.journalId)
			.sort((a, b) => b.weekStarting - a.weekStarting);
	},
});

// ============================================
// Mutations
// ============================================

export const create = mutation({
	args: {
		journalId: v.id("clientJournals"),
		narrativeId: v.optional(v.id("journalNarratives")),
		weekStarting: v.number(),
		weekEnding: v.number(),
		boxFileId: v.string(),
		boxFileUrl: v.string(),
		metrics: v.object({
			totalEntries: v.number(),
			entriesByTheme: v.any(),
			entriesByEffort: v.any(),
			touchpoints: v.object({
				calls: v.number(),
				emails: v.number(),
				documents: v.number(),
				meetings: v.number(),
				total: v.number(),
			}),
			actionItemsDue: v.number(),
			milestones: v.number(),
		}),
		deliveredAt: v.number(),
		deliveredTo: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.insert("journalDigests", {
			...args,
			createdAt: Date.now(),
		});
	},
});

// markDelivered — update digest with delivery info
export const markDelivered = mutation({
	args: {
		id: v.id("journalDigests"),
		to: v.array(v.string()),
		resendId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const patch: Record<string, unknown> = {
			deliveredAt: Date.now(),
			deliveredTo: args.to,
		};
		if (args.resendId) {
			patch.resendId = args.resendId;
		}
		await ctx.db.patch(args.id, patch);
		return await ctx.db.get(args.id);
	},
});

// getByResendId — find digest by Resend email ID
export const getByResendId = query({
	args: { resendId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("journalDigests")
			.withIndex("byResendId", (q) => q.eq("resendId", args.resendId))
			.first();
	},
});

// ============================================
// Internal versions (no auth, for internal actions/crons)
// ============================================

export const internalGetByJournalAndWeek = internalQuery({
	args: {
		journalId: v.id("clientJournals"),
		weekStarting: v.number(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("journalDigests")
			.withIndex("byWeek", (q) =>
				q.eq("journalId", args.journalId).eq("weekStarting", args.weekStarting),
			)
			.first();
	},
});

export const internalCreate = internalMutation({
	args: {
		journalId: v.id("clientJournals"),
		narrativeId: v.optional(v.id("journalNarratives")),
		weekStarting: v.number(),
		weekEnding: v.number(),
		boxFileId: v.string(),
		boxFileUrl: v.string(),
		metrics: v.object({
			totalEntries: v.number(),
			entriesByTheme: v.any(),
			entriesByEffort: v.any(),
			touchpoints: v.object({
				calls: v.number(),
				emails: v.number(),
				documents: v.number(),
				meetings: v.number(),
				total: v.number(),
			}),
			actionItemsDue: v.number(),
			milestones: v.number(),
		}),
		deliveredAt: v.number(),
		deliveredTo: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("journalDigests", {
			...args,
			createdAt: Date.now(),
		});
	},
});

export const internalMarkDelivered = internalMutation({
	args: {
		id: v.id("journalDigests"),
		to: v.array(v.string()),
		resendId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const patch: Record<string, unknown> = {
			deliveredAt: Date.now(),
			deliveredTo: args.to,
		};
		if (args.resendId) {
			patch.resendId = args.resendId;
		}
		await ctx.db.patch(args.id, patch);
		return await ctx.db.get(args.id);
	},
});
