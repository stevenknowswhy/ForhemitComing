import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { requireAuth } from "./lib/requireAuth";
import { storeTemplateContent } from "./lib/templateContent";

/**
 * Get a template by ID
 */
export const get = query({
	args: { id: v.id("templates") },
	handler: async (ctx: any, args: any) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.id);
	},
});

/**
 * Get a template by its title
 */
export const getByTitle = query({
	args: { title: v.string() },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const results = await ctx.db
			.query("templates")
			.filter((q) => q.eq(q.field("title"), args.title))
			.first();
		return results;
	},
});

/**
 * Get a template by its lifecycle stage and a search term in the title
 */
export const getByStageAndTitle = query({
	args: {
		lifecycleStage: v.string(),
		titleContains: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const results = await ctx.db
			.query("templates")
			.filter((q) =>
				q.and(
					q.eq(q.field("lifecycleStage"), args.lifecycleStage),
					q.eq(q.field("status"), "exists"),
				),
			)
			.collect();

		return results.filter((t) =>
			t.title.toLowerCase().includes(args.titleContains.toLowerCase()),
		);
	},
});

/**
 * Get all templates for a given lifecycle stage
 */
export const getByStage = query({
	args: { lifecycleStage: v.string() },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("templates")
			.filter((q) => q.eq(q.field("lifecycleStage"), args.lifecycleStage))
			.collect();
	},
});

/**
 * Get all templates with status "exists" (built and ready)
 */
export const getExisting = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("templates")
			.filter((q) => q.eq(q.field("status"), "exists"))
			.collect();
	},
});

/**
 * Get all templates
 */
export const getAll = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		return await ctx.db.query("templates").collect();
	},
});

export const patchTemplate = mutation({
	args: {
		templateId: v.id("templates"),
		contentFileId: v.optional(v.id("_storage")),
		status: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const patch: Record<string, unknown> = {
			updatedAt: Date.now(),
		};
		if (args.contentFileId !== undefined) {
			patch.contentFileId = args.contentFileId;
			patch.content = undefined; // clear inline content
		}
		if (args.status) {
			patch.status = args.status;
		}
		await ctx.db.patch(args.templateId, patch);
	},
});

/**
 * Update the content field of a template by title.
 * Writes to File Storage and sets contentFileId.
 * Also sets status to "exists" if it was "gap" or "urgent".
 *
 * Run: npx convex run templates:updateContentByTitle '{"title": "...", "content": "<html>..."}'
 */
export const updateContentByTitle: any = action({
	args: {
		title: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const template = await ctx.runQuery(api.templates.getByTitle, {
			title: args.title,
		});
		if (!template) {
			return { success: false, error: `Template not found: ${args.title}` };
		}

		// Store content in File Storage
		const fileId = await storeTemplateContent(ctx, args.content);

		// Patch the doc: set contentFileId, clear inline content, auto-promote status
		const newStatus =
			template.status === "gap" || template.status === "urgent"
				? "exists"
				: undefined;

		await ctx.runMutation(api.templates.patchTemplate, {
			templateId: template._id,
			contentFileId: fileId,
			...(newStatus ? { status: newStatus } : {}),
		});

		return {
			success: true,
			title: args.title,
			previousStatus: template.status,
			contentFileId: fileId,
		};
	},
});
