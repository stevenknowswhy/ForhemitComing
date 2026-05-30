import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

/**
 * Document Audit Log — SOC 2 ready.
 *
 * Every document lifecycle event is logged here:
 * generated, uploaded, shared, signed, viewed, downloaded, etc.
 */

export const logEvent = mutation({
	args: {
		companyId: v.optional(v.id("crmCompanies")),
		taskId: v.optional(v.id("workflowTasks")),
		documentType: v.string(),
		action: v.union(
			v.literal("generated"),
			v.literal("uploaded"),
			v.literal("shared"),
			v.literal("signed"),
			v.literal("declined"),
			v.literal("expired"),
			v.literal("viewed"),
			v.literal("downloaded"),
			v.literal("emailed"),
		),
		actor: v.string(),
		metadata: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("documentAudit", {
			companyId: args.companyId,
			taskId: args.taskId,
			documentType: args.documentType,
			action: args.action,
			actor: args.actor,
			metadata: args.metadata,
			createdAt: Date.now(),
		});
		return id;
	},
});

export const listByCompany = query({
	args: {
		companyId: v.id("crmCompanies"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("documentAudit")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.order("desc")
			.take(args.limit ?? 50);
	},
});

export const listByTask = query({
	args: {
		taskId: v.id("workflowTasks"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("documentAudit")
			.withIndex("by_task", (q) => q.eq("taskId", args.taskId))
			.order("desc")
			.take(args.limit ?? 20);
	},
});

export const listRecent = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("documentAudit")
			.order("desc")
			.take(args.limit ?? 100);
	},
});

export const getStats = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		const all = await ctx.db.query("documentAudit").collect();

		const byAction: Record<string, number> = {};
		const byType: Record<string, number> = {};

		for (const entry of all) {
			byAction[entry.action] = (byAction[entry.action] || 0) + 1;
			byType[entry.documentType] = (byType[entry.documentType] || 0) + 1;
		}

		return {
			total: all.length,
			byAction,
			byType,
			recent: all.slice(0, 10),
		};
	},
});
