/**
 * Export all templates with their HTML content.
 * Used to sync templates to Ghost database.
 */
import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getTemplateContent } from "./lib/templateContent";

/**
 * Query to get all templates (called by the action)
 */
export const listAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("templates").collect();
	},
});

/**
 * Action to export all templates with their HTML content
 */
export const exportAllWithContent = action({
	args: {},
	handler: async (
		ctx,
	): Promise<
		Array<{
			convexId: string;
			title: string;
			category: string;
			lifecycleStage: string;
			audience: string[];
			status: string;
			isRequired: boolean;
			requiresSignature: boolean;
			isRecurring: boolean;
			recurrenceRule: string | null;
			description: string;
			source: string;
			version: number;
			htmlContent: string | null;
		}>
	> => {
		// Get all templates via query
		const templates = await ctx.runQuery(api.exportTemplates.listAll, {});

		const results = [];

		for (const template of templates) {
			const htmlContent = await getTemplateContent(ctx, template);

			results.push({
				convexId: template._id,
				title: template.title,
				category: template.category,
				lifecycleStage: template.lifecycleStage,
				audience: template.audience,
				status: template.status,
				isRequired: template.isRequired,
				requiresSignature: template.requiresSignature,
				isRecurring: template.isRecurring ?? false,
				recurrenceRule: template.recurrenceRule ?? null,
				description: template.description,
				source: template.source ?? "unknown",
				version: template.version ?? 1,
				htmlContent: htmlContent,
			});
		}

		return results;
	},
});
