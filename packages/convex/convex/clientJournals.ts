import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// get — fetch a single journal by ID
// ============================================

export const get = query({
	args: { id: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

// ============================================
// getByClient — get the active journal for a client
// ============================================

export const getByClient = query({
	args: { clientId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("clientJournals")
			.withIndex("byClient", (q) => q.eq("clientId", args.clientId))
			.first();
	},
});

// ============================================
// listByStatus — list journals by status
// ============================================

export const listByStatus = query({
	args: {
		status: v.union(v.literal("active"), v.literal("archived")),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("clientJournals")
			.withIndex("byStatus", (q) => q.eq("status", args.status))
			.collect();
	},
});

// ============================================
// listActive — all active journals
// ============================================

export const listActive = query({
	handler: async (ctx) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("clientJournals")
			.withIndex("byStatus", (q) => q.eq("status", "active"))
			.collect();
	},
});

// ============================================
// listActiveEnriched — active journals with company names
// ============================================

export const listActiveEnriched = query({
	handler: async (ctx) => {
		await requireAuth(ctx);
		const journals = await ctx.db
			.query("clientJournals")
			.withIndex("byStatus", (q) => q.eq("status", "active"))
			.collect();

		const enriched = await Promise.all(
			journals.map(async (journal) => {
				const company = await ctx.db.get(journal.clientId);
				return {
					...journal,
					companyName: company?.name || "Unknown",
				};
			}),
		);

		return enriched;
	},
});

// ============================================
// create — provision a new journal for a client
// ============================================

export const create = mutation({
	args: {
		clientId: v.id("crmCompanies"),
		journalType: v.union(v.literal("transition"), v.literal("stewardship")),
		currentChapter: v.string(),
		chapterNumber: v.number(),
		clientTimezone: v.string(),
		deliveryDay: v.optional(v.string()),
		deliveryHour: v.optional(v.number()),
		boxFolderId: v.optional(v.string()),
		boxPdfFileId: v.optional(v.string()),
		boxSharedLink: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		return await ctx.db.insert("clientJournals", {
			...args,
			status: "active",
			createdAt: now,
			updatedAt: now,
		});
	},
});

// ============================================
// update — partial metadata update
// ============================================

export const update = mutation({
	args: {
		id: v.id("clientJournals"),
		currentChapter: v.optional(v.string()),
		chapterNumber: v.optional(v.number()),
		clientTimezone: v.optional(v.string()),
		deliveryDay: v.optional(v.string()),
		deliveryHour: v.optional(v.number()),
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

// ============================================
// archive — mark journal as archived
// ============================================

export const archive = mutation({
	args: { id: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: "archived",
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// ============================================
// updateBox — update Box integration fields
// ============================================

export const updateBox = mutation({
	args: {
		id: v.id("clientJournals"),
		boxFolderId: v.optional(v.string()),
		boxPdfFileId: v.optional(v.string()),
		boxSharedLink: v.optional(v.string()),
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

// ============================================
// updateChapter — advance to a new chapter
// ============================================

export const updateChapter = mutation({
	args: {
		id: v.id("clientJournals"),
		currentChapter: v.string(),
		chapterNumber: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			currentChapter: args.currentChapter,
			chapterNumber: args.chapterNumber,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// ============================================
// recordEmailOpen — track when client opens digest email (no auth — webhook use)
// ============================================

export const recordEmailOpen = mutation({
	args: {
		journalId: v.id("clientJournals"),
	},
	handler: async (ctx, args) => {
		const journal = await ctx.db.get(args.journalId);
		if (!journal) return null;
		await ctx.db.patch(args.journalId, {
			lastEmailOpenedAt: Date.now(),
			emailOpenCount: (journal.emailOpenCount || 0) + 1,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.journalId);
	},
});

// ============================================
// recordFileView — track when client views Box file (no auth — webhook use)
// ============================================

export const recordFileView = mutation({
	args: {
		journalId: v.id("clientJournals"),
	},
	handler: async (ctx, args) => {
		const journal = await ctx.db.get(args.journalId);
		if (!journal) return null;
		await ctx.db.patch(args.journalId, {
			lastFileViewedAt: Date.now(),
			fileViewCount: (journal.fileViewCount || 0) + 1,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.journalId);
	},
});
