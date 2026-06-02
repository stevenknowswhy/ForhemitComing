import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

// Reusable union validators
const entryTypeV = v.union(
	v.literal("work"),
	v.literal("call"),
	v.literal("meeting"),
	v.literal("email"),
	v.literal("document"),
	v.literal("signature"),
	v.literal("notification"),
	v.literal("due_item"),
	v.literal("milestone"),
	v.literal("issue"),
	v.literal("decision"),
	v.literal("note"),
);

const themeV = v.union(
	v.literal("legal"),
	v.literal("finance"),
	v.literal("trustee_bank"),
	v.literal("hr_comms"),
	v.literal("governance"),
	v.literal("tax"),
	v.literal("signing"),
	v.literal("admin"),
);

const statusV = v.union(
	v.literal("completed"),
	v.literal("in_progress"),
	v.literal("upcoming"),
	v.literal("blocked"),
	v.literal("waiting_on_others"),
	v.literal("canceled"),
);

const effortBandV = v.union(
	v.literal("low"),
	v.literal("medium"),
	v.literal("high"),
	v.literal("spike"),
);

const touchpointTypeV = v.union(
	v.literal("call"),
	v.literal("email"),
	v.literal("document"),
	v.literal("meeting"),
);

const sensitivityV = v.union(
	v.literal("low"),
	v.literal("medium"),
	v.literal("high"),
);

const participantV = v.object({
	name: v.string(),
	role: v.string(),
	organization: v.optional(v.string()),
});

// ============================================
// Queries
// ============================================

export const get = query({
	args: { id: v.id("journalEntries") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

export const listByJournal = query({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byJournal", (q) => q.eq("journalId", args.journalId))
			.order("desc")
			.collect();
	},
});

export const listByClient = query({
	args: { clientId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byClient", (q) => q.eq("clientId", args.clientId))
			.order("desc")
			.collect();
	},
});

export const listMilestones = query({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byJournal", (q) => q.eq("journalId", args.journalId))
			.filter((q) => q.eq(q.field("entryType"), "milestone"))
			.order("asc")
			.collect();
	},
});

export const listByChapter = query({
	args: {
		journalId: v.id("clientJournals"),
		chapterNumber: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byChapter", (q) =>
				q
					.eq("journalId", args.journalId)
					.eq("chapterNumber", args.chapterNumber),
			)
			.order("desc")
			.collect();
	},
});

export const listByTheme = query({
	args: {
		journalId: v.id("clientJournals"),
		theme: themeV,
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byTheme", (q) =>
				q.eq("journalId", args.journalId).eq("theme", args.theme),
			)
			.order("desc")
			.collect();
	},
});

export const listByStatus = query({
	args: {
		journalId: v.id("clientJournals"),
		status: statusV,
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("journalEntries")
			.withIndex("byStatus", (q) =>
				q.eq("journalId", args.journalId).eq("status", args.status),
			)
			.collect();
	},
});

export const listClientVisible = query({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const all = await ctx.db
			.query("journalEntries")
			.withIndex("byJournal", (q) => q.eq("journalId", args.journalId))
			.collect();
		return all
			.filter((e) => e.visibleToClient)
			.sort((a, b) => b.occurredAt - a.occurredAt);
	},
});

export const listDueSoon = query({
	args: {
		journalId: v.id("clientJournals"),
		before: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const all = await ctx.db
			.query("journalEntries")
			.withIndex("byJournal", (q) => q.eq("journalId", args.journalId))
			.collect();
		return all
			.filter(
				(e) =>
					e.dueDate !== undefined &&
					e.dueDate <= args.before &&
					e.status !== "completed" &&
					e.status !== "canceled",
			)
			.sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));
	},
});

// ============================================
// Mutations
// ============================================

// create — manual entry by account lead
export const create = mutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		title: v.string(),
		description: v.string(),
		clientDescription: v.optional(v.string()),
		outcome: v.optional(v.string()),
		entryType: entryTypeV,
		theme: themeV,
		status: statusV,
		effortBand: v.optional(effortBandV),
		hoursEstimate: v.optional(v.number()),
		valueNote: v.optional(v.string()),
		touchpointType: v.optional(touchpointTypeV),
		performedBy: v.string(),
		performedByRole: v.optional(v.string()),
		participants: v.optional(v.array(participantV)),
		dueFrom: v.optional(v.array(v.string())),
		dueDate: v.optional(v.number()),
		relatedDocuments: v.optional(v.array(v.string())),
		relatedTaskId: v.optional(v.id("workflowTasks")),
		visibleToClient: v.boolean(),
		sensitivity: sensitivityV,
		internalNote: v.optional(v.string()),
		chapter: v.string(),
		chapterNumber: v.number(),
		occurredAt: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const now = Date.now();
		const entryId = await ctx.db.insert("journalEntries", {
			...args,
			isAutoGenerated: false,
			createdAt: now,
			updatedAt: now,
		});

		const actor = await resolveActor(ctx);
		if (args.visibleToClient) {
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.JOURNAL_ENTRY,
				category: "journal",
				summary: `Journal entry: ${args.title}`,
				clientSummary: `New journal entry: ${args.title}`,
				source: "admin_ui",
				visibility: "external",
				companyId: args.clientId,
				scopeType: "company",
				scopeId: args.clientId,
				entityType: "journalEntry",
				entityId: entryId,
				metadata: { entryType: args.entryType, theme: args.theme },
			});
		} else {
			await logEvent(ctx, {
				...actor,
				eventType: LOG_ACTIONS.JOURNAL_ENTRY,
				category: "journal",
				summary: `Journal entry: ${args.title}`,
				source: "admin_ui",
				visibility: "internal",
				companyId: args.clientId,
				scopeType: "company",
				scopeId: args.clientId,
				entityType: "journalEntry",
				entityId: entryId,
				metadata: { entryType: args.entryType, theme: args.theme },
			});
		}

		return entryId;
	},
});

// createAuto — system-generated entry (no auth — caller is responsible)
export const createAuto = mutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		title: v.string(),
		description: v.string(),
		clientDescription: v.optional(v.string()),
		outcome: v.optional(v.string()),
		entryType: entryTypeV,
		theme: themeV,
		status: statusV,
		touchpointType: v.optional(touchpointTypeV),
		performedBy: v.string(),
		performedByRole: v.optional(v.string()),
		participants: v.optional(v.array(participantV)),
		relatedDocuments: v.optional(v.array(v.string())),
		relatedTaskId: v.optional(v.id("workflowTasks")),
		chapter: v.string(),
		chapterNumber: v.number(),
		occurredAt: v.number(),
		autoGeneratedFrom: v.string(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("journalEntries", {
			...args,
			visibleToClient: true,
			sensitivity: "low",
			isAutoGenerated: true,
			createdAt: now,
			updatedAt: now,
		});
	},
});

// update — edit an existing entry
export const update = mutation({
	args: {
		id: v.id("journalEntries"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		clientDescription: v.optional(v.string()),
		outcome: v.optional(v.string()),
		entryType: v.optional(entryTypeV),
		theme: v.optional(themeV),
		effortBand: v.optional(effortBandV),
		hoursEstimate: v.optional(v.number()),
		valueNote: v.optional(v.string()),
		performedBy: v.optional(v.string()),
		performedByRole: v.optional(v.string()),
		participants: v.optional(v.array(participantV)),
		dueFrom: v.optional(v.array(v.string())),
		dueDate: v.optional(v.number()),
		relatedDocuments: v.optional(v.array(v.string())),
		internalNote: v.optional(v.string()),
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

// updateStatus — change entry status
export const updateStatus = mutation({
	args: {
		id: v.id("journalEntries"),
		status: statusV,
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			status: args.status,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// setVisibility — toggle client visibility
export const setVisibility = mutation({
	args: {
		id: v.id("journalEntries"),
		visibleToClient: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.id, {
			visibleToClient: args.visibleToClient,
			updatedAt: Date.now(),
		});
		return await ctx.db.get(args.id);
	},
});

// ============================================
// autoLog — system event → journal entry
// No auth — called from internal Convex functions.
// Resolves the active journal for the company automatically.
// Returns null if no active journal exists.
// ============================================

export const autoLog = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		entryType: entryTypeV,
		theme: v.optional(themeV), // defaults to "admin"
		title: v.string(),
		description: v.string(),
		clientDescription: v.optional(v.string()),
		outcome: v.optional(v.string()),
		touchpointType: v.optional(touchpointTypeV),
		performedBy: v.string(),
		performedByRole: v.optional(v.string()),
		participants: v.optional(v.array(participantV)),
		relatedDocuments: v.optional(v.array(v.string())),
		relatedTaskId: v.optional(v.id("workflowTasks")),
		visibleToClient: v.optional(v.boolean()),
		sensitivity: v.optional(sensitivityV),
		internalNote: v.optional(v.string()),
		autoGeneratedFrom: v.string(),
	},
	handler: async (ctx, args) => {
		// Find active journal for this company
		const journal = await ctx.db
			.query("clientJournals")
			.withIndex("byClient", (q) => q.eq("clientId", args.companyId))
			.first();

		if (!journal || journal.status !== "active") {
			return null; // No active journal = no logging
		}

		const now = Date.now();
		return await ctx.db.insert("journalEntries", {
			journalId: journal._id,
			clientId: args.companyId,
			title: args.title,
			description: args.description,
			clientDescription: args.clientDescription,
			outcome: args.outcome,
			entryType: args.entryType,
			theme: args.theme ?? "admin",
			status: "completed",
			touchpointType: args.touchpointType,
			performedBy: args.performedBy,
			performedByRole: args.performedByRole,
			participants: args.participants,
			relatedDocuments: args.relatedDocuments,
			relatedTaskId: args.relatedTaskId,
			visibleToClient: args.visibleToClient ?? true,
			sensitivity: args.sensitivity ?? "low",
			internalNote: args.internalNote,
			isAutoGenerated: true,
			autoGeneratedFrom: args.autoGeneratedFrom,
			chapter: journal.currentChapter,
			chapterNumber: journal.chapterNumber,
			occurredAt: now,
			createdAt: now,
			updatedAt: now,
		});
	},
});

// ============================================
// bulkCreate — import multiple entries at once (auth required)
// ============================================

export const bulkCreate = mutation({
	args: {
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),
		entries: v.array(
			v.object({
				title: v.string(),
				description: v.string(),
				clientDescription: v.optional(v.string()),
				outcome: v.optional(v.string()),
				entryType: entryTypeV,
				theme: themeV,
				effortBand: v.optional(effortBandV),
				visibleToClient: v.boolean(),
				sensitivity: v.optional(
					v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
				),
				occurredAt: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const journal = await ctx.db.get(args.journalId);
		if (!journal) throw new Error("Journal not found");
		const now = Date.now();
		const ids = [];
		for (const entry of args.entries) {
			const id = await ctx.db.insert("journalEntries", {
				journalId: args.journalId,
				clientId: args.clientId,
				...entry,
				status: "completed",
				performedBy: "account-lead",
				sensitivity: entry.sensitivity ?? "low",
				isAutoGenerated: false,
				chapter: journal.currentChapter,
				chapterNumber: journal.chapterNumber,
				createdAt: now,
				updatedAt: now,
			});
			ids.push(id);
		}
		return { created: ids.length, ids };
	},
});

// ============================================
// Internal versions (no auth, for internal actions/crons)
// ============================================

export const internalListByJournal = internalQuery({
	args: { journalId: v.id("clientJournals") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("journalEntries")
			.withIndex("byJournal", (q) => q.eq("journalId", args.journalId))
			.collect();
	},
});
