import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { templateRules } from "../templateRules";
import { requireAuth } from "./lib/requireAuth";

/**
 * Seed trigger metadata onto the stageRequirements table.
 *
 * For each rule in templateRules:
 *  1. Fuzzy-match the rule.title to an existing templates row
 *  2. Find the matching stageRequirement by (templateId, stage)
 *  3. Patch the stageRequirement with trigger metadata
 *  4. If template or stageRequirement is missing, insert it
 *
 * Run with: npx convex run templateRules:seedTriggerMetadata
 */

// manifest stage prefix → CRM stage name
const STAGE_MAP: Record<string, string> = {
	"01-first-touch": "First contact",
	"02-qualification": "NDA sent",
	"03-engagement": "Feasibility",
	"04-diligence": "Term sheet",
	"05-closing": "LOI signed",
	"06-post-close": "Closed",
};

// manifest stage prefix → templates.lifecycleStage value
const LIFECYCLE_MAP: Record<string, string> = {
	"01-first-touch": "first-touch",
	"02-qualification": "qualification",
	"03-engagement": "engagement",
	"04-diligence": "diligence",
	"05-closing": "closing",
	"06-post-close": "post-close",
};

export const seedTriggerMetadata = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		// 1. Load all existing stageRequirements keyed by (templateId, stage)
		const existingReqs = await ctx.db.query("stageRequirements").collect();
		const reqMap = new Map<string, (typeof existingReqs)[number]>();
		for (const r of existingReqs) {
			reqMap.set(`${r.templateId}:${r.stage}`, r);
		}

		// 2. Load all existing templates keyed by title
		const existingTemplates = await ctx.db.query("templates").collect();
		const templateMap = new Map<string, (typeof existingTemplates)[number]>();
		for (const t of existingTemplates) {
			templateMap.set(t.title, t);
		}

		let updated = 0;
		let created = 0;
		let skipped = 0;

		for (const rule of templateRules) {
			// Derive stage from manifestId (e.g. "03-engagement/engagement-letter")
			const stagePrefix = rule.manifestId.split("/")[0];
			const stage = STAGE_MAP[stagePrefix];
			const lifecycleStage = LIFECYCLE_MAP[stagePrefix];

			if (!stage || !lifecycleStage) {
				console.warn(
					`Unknown stage prefix in manifestId: "${rule.manifestId}"`,
				);
				skipped++;
				continue;
			}

			// 3. Find or create the template
			let template = templateMap.get(rule.title);
			if (!template) {
				// Insert a new template row
				const now = Date.now();
				const newId = await ctx.db.insert("templates", {
					title: rule.title,
					source: "forms" as const,
					category: "document" as const,
					lifecycleStage,
					audience: [],
					status: "gap" as const,
					isRequired: true,
					isRecurring: !!rule.recurringRule,
					recurrenceRule: rule.recurringRule,
					requiresSignature: false,
					content: undefined,
					description: rule.notes ?? "",
					version: 1,
					createdAt: now,
					updatedAt: now,
				});
				template = (await ctx.db.get(newId)) ?? undefined;
				if (!template) {
					skipped++;
					continue;
				}
				templateMap.set(rule.title, template);
			}

			// 4. Find or create the stageRequirement
			const reqKey = `${template._id}:${stage}`;
			const existing = reqMap.get(reqKey);

			if (existing) {
				// Patch existing row with trigger metadata
				await ctx.db.patch(existing._id, {
					trigger: rule.trigger,
					triggerGate: rule.triggerGate,
					daysOffset: rule.daysOffset,
					recurrenceRule: rule.recurringRule,
					feeMilestone: rule.feeMilestone,
					autoSend: rule.autoSend,
					blockingGate: rule.feeMilestone, // fee milestone doubles as blocking gate
				});
				updated++;
			} else {
				// Insert new stageRequirement
				await ctx.db.insert("stageRequirements", {
					stage,
					templateId: template._id,
					requiredForAudience: template.audience ?? [],
					order: 99, // append at end; can be reordered later
					autoCreate: true,
					recurrenceRule: rule.recurringRule,
					trigger: rule.trigger,
					triggerGate: rule.triggerGate,
					daysOffset: rule.daysOffset,
					feeMilestone: rule.feeMilestone,
					autoSend: rule.autoSend,
					blockingGate: rule.feeMilestone,
				});
				created++;
			}
		}

		return { updated, created, skipped };
	},
});

/**
 * Query stageRequirements filtered by trigger type.
 */
export const getRulesByTrigger = query({
	args: {
		trigger: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return ctx.db
			.query("stageRequirements")
			.withIndex("by_trigger", (q) => q.eq("trigger", args.trigger))
			.collect();
	},
});
