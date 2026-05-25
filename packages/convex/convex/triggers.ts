import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { requireAuth } from "./lib/requireAuth";
import { calculateStageTriggerDueDate } from "./stages";
import { calculateGateTriggerDueDate } from "./gates";

/**
 * Stage requirements with trigger support
 */
export type TriggerType =
	| "ON_STAGE_ENTRY"
	| "ON_GATE_PASSED"
	| "DAYS_FROM_STAGE"
	| "DAYS_FROM_GATE";

/**
 * Create workflow tasks triggered by deal events (stage change, gate pass, or time check).
 * Deduplicates: skips if a non-cancelled task already exists for the same (company, template).
 */
export const createTriggeredTasks = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		event: v.union(
			v.literal("stage_change"),
			v.literal("gate_passed"),
			v.literal("time_check"),
		),
		gateName: v.optional(v.string()),
		newStage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		if (!company) throw new Error("Company not found");

		const allReqs = await ctx.db.query("stageRequirements").collect();
		const triggered = allReqs.filter((r) => r.trigger);
		const now = Date.now();

		const matches = triggered.filter((req) => {
			if (args.event === "stage_change") {
				return req.trigger === "ON_STAGE_ENTRY" && req.stage === args.newStage;
			}
			if (args.event === "gate_passed") {
				return (
					req.trigger === "ON_GATE_PASSED" && req.triggerGate === args.gateName
				);
			}
			if (args.event === "time_check") {
				if (req.trigger === "DAYS_FROM_STAGE" && company.stageEnteredAt) {
					const dueDate = calculateStageTriggerDueDate(
						company.stageEnteredAt,
						req.daysOffset ?? 0,
					);
					return dueDate !== undefined && dueDate <= now;
				}
				if (req.trigger === "DAYS_FROM_GATE" && req.triggerGate) {
					const gate =
						company.gates?.[req.triggerGate as keyof typeof company.gates];
					const dueDate = calculateGateTriggerDueDate(
						gate,
						req.daysOffset ?? 0,
					);
					return dueDate !== undefined && dueDate <= now;
				}
			}
			return false;
		});

		const createdTasks = [];
		for (const req of matches) {
			const existing = await ctx.db
				.query("queueTasks")
				.withIndex("by_company_template", (q) =>
					q.eq("companyId", args.companyId).eq("templateId", req.templateId),
				)
				.first();

			if (existing && existing.status !== "cancelled") continue;

			const task = await ctx.db.insert("queueTasks", {
				companyId: args.companyId,
				templateId: req.templateId,
				priority: "normal",
				status: "pending",
				metadata: {
					trigger: req.trigger,
					triggerGate: req.triggerGate,
					daysOffset: req.daysOffset,
					stage: req.stage,
					triggeredBy: args.event,
					triggeredAt: now,
				},
				createdAt: now,
				updatedAt: now,
			});

			createdTasks.push(task);
		}

		return { created: createdTasks.length, tasks: createdTasks };
	},
});

/**
 * Convenience wrapper — advance stage or set gate, then fire triggers
 */
export const wireTriggers = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		event: v.union(v.literal("stage_change"), v.literal("gate_passed")),
		gateName: v.optional(v.string()),
		newStage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		// 1. Update the appropriate state based on the event
		if (args.event === "stage_change") {
			if (!args.newStage) throw new Error("newStage required for stage_change");
			await ctx.db.patch(args.companyId, {
				stage: args.newStage as any,
				stageEnteredAt: Date.now(),
				updatedAt: Date.now(),
			});
		} else if (args.event === "gate_passed") {
			if (!args.gateName) throw new Error("gateName required for gate_passed");
			const company = await ctx.db.get(args.companyId);
			await ctx.db.patch(args.companyId, {
				gates: {
					...company?.gates,
					[args.gateName]: { passed: true, passedAt: Date.now() },
				},
				updatedAt: Date.now(),
			});
		}

		// 2. Fire createTriggeredTasks via api
		const result = await ctx.runMutation(api.triggers.createTriggeredTasks, {
			companyId: args.companyId,
			event: args.event,
			gateName: args.gateName,
			newStage: args.newStage,
		});

		return result;
	},
});

/**
 * Get active triggers for a company
 */
export const getActiveTriggers = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const allReqs = await ctx.db.query("stageRequirements").collect();
		// Filter by triggers that exist (no by_company index on stageRequirements)
		return allReqs.filter((t) => t.trigger);
	},
});

/**
 * Validate trigger configuration
 */
export const validateTriggerConfig = (
	trigger?: TriggerType,
	triggerGate?: string,
	daysOffset?: number,
): string[] => {
	const errors: string[] = [];

	if (trigger && trigger.startsWith("DAYS_FROM_") && !daysOffset) {
		errors.push(`${trigger} requires daysOffset`);
	}

	if (trigger === "ON_GATE_PASSED" && !triggerGate) {
		errors.push("ON_GATE_PASSED requires triggerGate");
	}

	if (trigger?.includes("_GATE") && !triggerGate) {
		errors.push(`${trigger} requires triggerGate`);
	}

	return errors;
};
