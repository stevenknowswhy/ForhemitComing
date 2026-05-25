import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// Create a note
// ============================================

export const createNote = mutation({
	args: {
		companyId: v.optional(v.id("crmCompanies")),
		contactId: v.optional(v.id("crmContacts")),
		authorId: v.id("users"),
		content: v.string(),
		type: v.union(
			v.literal("meeting-agenda"),
			v.literal("client-note"),
			v.literal("internal"),
			v.literal("call-notes"),
			v.literal("general"),
		),
		isPrivate: v.boolean(),
		workflowTaskId: v.optional(v.id("workflowTasks")),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const noteId = await ctx.db.insert("notes", {
			...args,
			companyId: args.companyId!, // required by usage
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		// If linked to a task, also store on the task
		if (args.workflowTaskId) {
			const task = await ctx.db.get(args.workflowTaskId);
			if (task) {
				await ctx.db.patch(args.workflowTaskId, {
					privateNotes: args.content,
					updatedAt: Date.now(),
				});
			}
		}

		return noteId;
	},
});

// ============================================
// Update a note
// ============================================

export const updateNote = mutation({
	args: {
		noteId: v.id("notes"),
		content: v.optional(v.string()),
		isPrivate: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const note = await ctx.db.get(args.noteId);
		if (!note) throw new Error("Note not found");

		await ctx.db.patch(args.noteId, {
			content: args.content ?? note.content,
			isPrivate: args.isPrivate ?? note.isPrivate,
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});

// ============================================
// Delete a note
// ============================================

export const deleteNote = mutation({
	args: { noteId: v.id("notes") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.delete(args.noteId);
		return { success: true };
	},
});

// ============================================
// Get notes by company
// ============================================

export const getNotesByCompany = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.collect();

		// Enrich with author name
		const enriched = await Promise.all(
			notes.map(async (note) => {
				const author = note.authorId ? await ctx.db.get(note.authorId) : null;
				const contact = note.contactId
					? await ctx.db.get(note.contactId)
					: null;
				const authorData = author as any;
				const contactData = contact as any;
				return {
					...note,
					authorName: authorData
						? `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim() ||
							authorData.email
						: "Unknown",
					contactName: contactData
						? `${contactData.firstName} ${contactData.lastName}`
						: null,
				};
			}),
		);

		return enriched;
	},
});

// ============================================
// Get notes by contact
// ============================================

export const getNotesByContact = query({
	args: { contactId: v.id("crmContacts") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
			.order("desc")
			.collect();

		const enriched = await Promise.all(
			notes.map(async (note) => {
				const author = note.authorId ? await ctx.db.get(note.authorId) : null;
				const authorData = author as any;
				return {
					...note,
					authorName: authorData
						? `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim() ||
							authorData.email
						: "Unknown",
				};
			}),
		);

		return enriched;
	},
});

// ============================================
// Get notes by task
// ============================================

export const getNotesByTask = query({
	args: { workflowTaskId: v.id("workflowTasks") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_task", (q) => q.eq("workflowTaskId", args.workflowTaskId))
			.order("desc")
			.collect();

		const enriched = await Promise.all(
			notes.map(async (note) => {
				const author = note.authorId ? await ctx.db.get(note.authorId) : null;
				const authorData = author as any;
				return {
					...note,
					authorName: authorData
						? `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim() ||
							authorData.email
						: "Unknown",
				};
			}),
		);

		return enriched;
	},
});

// ============================================
// Get all notes (with optional type filter)
// ============================================

export const getAllNotes = query({
	args: {
		type: v.optional(
			v.union(
				v.literal("meeting-agenda"),
				v.literal("client-note"),
				v.literal("internal"),
				v.literal("call-notes"),
				v.literal("general"),
			),
		),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		let notes;

		if (args.type) {
			notes = await ctx.db
				.query("notes")
				.withIndex("by_type", (q) => q.eq("type", args.type!))
				.order("desc")
				.take(args.limit || 50);
		} else {
			notes = await ctx.db
				.query("notes")
				.order("desc")
				.take(args.limit || 50);
		}

		const enriched = await Promise.all(
			notes.map(async (note) => {
				const author = note.authorId ? await ctx.db.get(note.authorId) : null;
				const company = note.companyId
					? await ctx.db.get(note.companyId)
					: null;
				const authorData = author as any;
				return {
					...note,
					authorName: authorData
						? `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim() ||
							authorData.email
						: "Unknown",
					companyName: (company as any)?.name || null,
				};
			}),
		);

		return enriched;
	},
});
