import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import { logEvent as logBusinessEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import { resolveActor } from "./lib/resolveActor";

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

		// Map document audit action to business log event type
		const actionMap: Record<string, string> = {
			generated: LOG_ACTIONS.DOC_GENERATED,
			uploaded: LOG_ACTIONS.DOC_UPLOADED,
			shared: LOG_ACTIONS.DOC_SHARED,
			signed: LOG_ACTIONS.DOC_SIGNED,
			declined: LOG_ACTIONS.DOC_DECLINED,
			viewed: LOG_ACTIONS.DOC_VIEWED,
			downloaded: LOG_ACTIONS.DOC_DOWNLOADED,
			emailed: LOG_ACTIONS.DOC_EMAILED,
		};

		const eventType = actionMap[args.action];
		if (eventType && args.companyId) {
			const actorObj = await resolveActor(ctx);
			if (args.action === "signed") {
				await logBusinessEvent(ctx, {
					...actorObj,
					eventType,
					category: "document",
					summary: `Document ${args.action}: ${args.documentType}`,
					clientSummary: `Your document has been signed`,
					source: "webhook",
					visibility: "external",
					companyId: args.companyId,
					scopeType: "company",
					scopeId: args.companyId,
					entityType: "documentAudit",
					entityId: id,
					metadata: { documentType: args.documentType, action: args.action },
				});
			} else if (args.action === "declined") {
				await logBusinessEvent(ctx, {
					...actorObj,
					eventType,
					category: "document",
					summary: `Document ${args.action}: ${args.documentType}`,
					clientSummary: `A document requires attention`,
					source: "webhook",
					visibility: "external",
					companyId: args.companyId,
					scopeType: "company",
					scopeId: args.companyId,
					entityType: "documentAudit",
					entityId: id,
					severity: "warning",
					metadata: { documentType: args.documentType, action: args.action },
				});
			} else {
				await logBusinessEvent(ctx, {
					...actorObj,
					eventType,
					category: "document",
					summary: `Document ${args.action}: ${args.documentType}`,
					clientSummary: `Document ${args.action}: ${args.documentType}`,
					source: "admin_ui",
					visibility: "external",
					companyId: args.companyId,
					scopeType: "company",
					scopeId: args.companyId,
					entityType: "documentAudit",
					entityId: id,
					metadata: { documentType: args.documentType, action: args.action },
				});
			}
		}

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
