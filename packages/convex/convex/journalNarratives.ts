import { v } from "convex/values";
import {
	internalMutation,
	internalQuery,
	mutation,
	query,
} from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

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

		const narrative = await ctx.db.get(args.id);

		if (narrative) {
			const actor = await resolveActor(ctx);
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.JOURNAL_DIGEST,
				category: "journal",
				summary: `Journal digest delivered for week ${new Date(narrative.weekStarting).toISOString().slice(0, 10)}`,
				clientSummary: `Your weekly journal digest has been delivered`,
				source: "scheduler",
				visibility: "external",
				companyId: narrative.clientId,
				scopeType: "company",
				scopeId: narrative.clientId,
				entityType: "journalNarrative",
				entityId: args.id,
				metadata: {
					weekStarting: narrative.weekStarting,
					weekEnding: narrative.weekEnding,
				},
			});
		}

		return narrative;
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

// createFallback — internal use only (cron auto-narrative)
export const createFallback = mutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		weekStarting: v.number(),
		weekEnding: v.number(),
		narrativeText: v.string(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("journalNarratives", {
			...args,
			authorId: "system",
			authorName: "Auto-generated",
			status: "draft",
			usedFallback: true,
			createdAt: now,
			updatedAt: now,
		});
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
			.query("journalNarratives")
			.withIndex("byWeek", (q) =>
				q.eq("journalId", args.journalId).eq("weekStarting", args.weekStarting),
			)
			.first();
	},
});

export const internalUpdate = internalMutation({
	args: {
		id: v.id("journalNarratives"),
		narrativeText: v.optional(v.string()),
		authorId: v.optional(v.string()),
		authorName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
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

export const internalMarkFallback = internalMutation({
	args: {
		id: v.id("journalNarratives"),
		reason: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			usedFallback: true,
			fallbackReason: args.reason,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

export const internalCreateFallback = internalMutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		weekStarting: v.number(),
		weekEnding: v.number(),
		narrativeText: v.string(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("journalNarratives", {
			...args,
			authorId: "system",
			authorName: "Auto-generated",
			status: "draft",
			usedFallback: true,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const internalUpdateStatus = internalMutation({
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
