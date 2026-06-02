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
	args: { id: v.id("journalChapters") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

export const listByJournal = query({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const all = await ctx.db.query("journalChapters").collect();
		return all
			.filter((c) => c.journalId === args.journalId)
			.sort((a, b) => a.chapterNumber - b.chapterNumber);
	},
});

export const listByStatus = query({
	args: {
		journalId: v.id("clientJournals"),
		status: v.union(
			v.literal("upcoming"),
			v.literal("active"),
			v.literal("completed"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalChapters")
			.withIndex("byStatus", (q) =>
				q.eq("journalId", args.journalId).eq("status", args.status),
			)
			.collect();
	},
});

// ============================================
// Mutations
// ============================================

export const create = mutation({
	args: {
		journalId: v.id("clientJournals"),
		chapterNumber: v.number(),
		title: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		return await ctx.db.insert("journalChapters", {
			...args,
			status: "upcoming",
			closeSummaryGenerated: false,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("journalChapters"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
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

// activate — mark chapter as active
export const activate = mutation({
	args: { id: v.id("journalChapters") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "active",
			startedAt: Date.now(),
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// complete — mark chapter as completed
export const complete = mutation({
	args: {
		id: v.id("journalChapters"),
		closeSummaryBoxFileId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "completed",
			completedAt: Date.now(),
			closeSummaryGenerated: args.closeSummaryBoxFileId !== undefined,
			closeSummaryBoxFileId: args.closeSummaryBoxFileId,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// closeAndAdvance — close current chapter and create next one (no auth — internal use)
export const closeAndAdvance = mutation({
	args: {
		journalId: v.id("clientJournals"),
		oldStage: v.string(),
		newStage: v.string(),
		chapterNumber: v.number(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();

		// Close current active chapter
		const activeChapter = await ctx.db
			.query("journalChapters")
			.withIndex("byStatus", (q) =>
				q.eq("journalId", args.journalId).eq("status", "active"),
			)
			.first();

		if (activeChapter) {
			await ctx.db.patch(activeChapter._id, {
				status: "completed",
				completedAt: now,
				updatedAt: now,
			});
		}

		// Create new chapter for the new stage
		const newChapterId = await ctx.db.insert("journalChapters", {
			journalId: args.journalId,
			chapterNumber: args.chapterNumber + 1,
			title: args.newStage,
			description: `Phase ${args.chapterNumber + 1}: ${args.newStage}`,
			status: "active",
			startedAt: now,
			closeSummaryGenerated: false,
			createdAt: now,
			updatedAt: now,
		});

		// Update journal's current chapter
		await ctx.db.patch(args.journalId, {
			currentChapter: args.newStage,
			chapterNumber: args.chapterNumber + 1,
			updatedAt: now,
		});

		return {
			closedChapterId: activeChapter?._id,
			newChapterId,
		};
	},
});

// ============================================
// Internal versions (no auth, for internal actions/crons)
// ============================================

export const internalGet = internalQuery({
	args: { id: v.id("journalChapters") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const internalComplete = internalMutation({
	args: {
		id: v.id("journalChapters"),
		closeSummaryBoxFileId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const patch: Record<string, unknown> = {
			status: "completed",
			completedAt: Date.now(),
		};
		if (args.closeSummaryBoxFileId) {
			patch.closeSummaryBoxFileId = args.closeSummaryBoxFileId;
		}
		await ctx.db.patch(args.id, patch);
		return await ctx.db.get(args.id);
	},
});
