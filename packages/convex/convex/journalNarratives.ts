import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// Queries
// ============================================

export const get = query({
	args: { id: v.id("journalNarratives") },
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
			.query("journalNarratives")
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
		const all = await ctx.db.query("journalNarratives").collect();
		return all
			.filter((n) => n.journalId === args.journalId)
			.sort((a, b) => b.weekStarting - a.weekStarting);
	},
});

export const listByStatus = query({
	args: {
		status: v.union(
			v.literal("draft"),
			v.literal("ready"),
			v.literal("sent"),
			v.literal("skipped"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalNarratives")
			.withIndex("byStatus", (q) => q.eq("status", args.status))
			.collect();
	},
});

// listPending — narratives marked "ready" but not yet sent
export const listPending = query({
	handler: async (ctx) => {
		await requireAuth(ctx);
		const ready = await ctx.db
			.query("journalNarratives")
			.withIndex("byStatus", (q) => q.eq("status", "ready"))
			.collect();
		return ready.filter((n) => n.sentAt === undefined);
	},
});

// ============================================
// Mutations
// ============================================

export const create = mutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		weekStarting: v.number(),
		weekEnding: v.number(),
		narrativeText: v.string(),
		authorId: v.string(),
		authorName: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		return await ctx.db.insert("journalNarratives", {
			...args,
			status: "draft",
			usedFallback: false,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("journalNarratives"),
		narrativeText: v.optional(v.string()),
		authorId: v.optional(v.string()),
		authorName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const { id, ...patch } = args;
		const cleanPatch: Record<string, unknown> = { updatedAt: Date.now() };
		for (const [key, value] of Object.entries(patch)) {
			if (value !== undefined) {
				cleanPatch[key] = value;
			}
		}
		await ctx.db.patch(id, cleanPatch);
		return await ctx.db.get(id);
	},
});

// markReady — account lead says "ready to send"
export const markReady = mutation({
	args: { id: v.id("journalNarratives") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "ready",
			readyAt: Date.now(),
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// markSent — digest was delivered
export const markSent = mutation({
	args: { id: v.id("journalNarratives") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "sent",
			sentAt: Date.now(),
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// markSkipped — narrative was not needed
export const markSkipped = mutation({
	args: { id: v.id("journalNarratives") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "skipped",
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// markFallback — system used auto-summary instead of narrative
export const markFallback = mutation({
	args: {
		id: v.id("journalNarratives"),
		reason: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			usedFallback: true,
			fallbackReason: args.reason,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// updateStatus — used by digest engine to mark narratives as sent
export const updateStatus = mutation({
	args: {
		id: v.id("journalNarratives"),
		status: v.union(
			v.literal("draft"),
			v.literal("ready"),
			v.literal("sent"),
			v.literal("skipped"),
		),
	},
	handler: async (ctx, args) => {
		const patch: Record<string, unknown> = {
			status: args.status,
			updatedAt: Date.now(),
		};
		if (args.status === "sent") {
			patch.sentAt = Date.now();
		}
		await ctx.db.patch(args.id, patch);
		return await ctx.db.get(args.id);
	},
});
