import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
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
