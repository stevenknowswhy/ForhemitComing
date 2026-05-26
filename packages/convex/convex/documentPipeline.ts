import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { sendEmail } from "./emailCore";
import { fillTemplate } from "./templateRenderer";
import { requireAuth } from "./lib/requireAuth";

// ============================================
// Helpers
// ============================================

/** Template placeholder replacement - uses shared templateRenderer utility */

// ============================================
// Queries
// ============================================

/** Get a template by ID from the templates table (includes content) */
export const getTemplate = query({
	args: { templateId: v.id("templates") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db.get(args.templateId);
	},
});

/** Find template by title */
export const getTemplateByTitle = query({
	args: { title: v.string() },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("templates")
			.filter((q) => q.eq(q.field("title"), args.title))
			.first();
	},
});

/** Get templates required at a given lifecycle stage */
export const getStageRequirements = query({
	args: { stage: v.string() },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		return await ctx.db
			.query("stageRequirements")
			.withIndex("by_stage", (q) => q.eq("stage", args.stage))
			.collect();
	},
});

// ============================================
// Mutations
// ============================================

/** Seed or update HTML content for a template */
export const seedTemplateContent = mutation({
	args: {
		templateId: v.id("templates"),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.templateId, {
			content: args.content,
			updatedAt: Date.now(),
		});
		return { success: true };
	},
});

/** Find a template by title, or create it, then set its HTML content */
export const findOrCreateAndSeed = mutation({
	args: {
		title: v.string(),
		content: v.string(),
		lifecycleStage: v.string(),
		audience: v.array(v.string()),
		category: v.union(
			v.literal("document"),
			v.literal("communication"),
			v.literal("meeting"),
			v.literal("internal"),
		),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const existing = await ctx.db
			.query("templates")
			.filter((q) => q.eq(q.field("title"), args.title))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				content: args.content,
				updatedAt: Date.now(),
			});
			return { id: existing._id, action: "updated" as const };
		}

		const id = await ctx.db.insert("templates", {
			title: args.title,
			source: "communications",
			category: args.category,
			lifecycleStage: args.lifecycleStage,
			audience: args.audience,
			status: "exists",
			isRequired: true,
			isRecurring: false,
			requiresSignature: false,
			content: args.content,
			description: args.description || "",
			version: 1,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
		return { id, action: "created" as const };
	},
});

/** Update a workflowTask after successful send */
export const markWorkflowTaskSent = mutation({
	args: {
		workflowTaskId: v.id("workflowTasks"),
		resendId: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.patch(args.workflowTaskId, {
			status: "sent" as const,
			sentAt: Date.now(),
			resendId: args.resendId,
		});
	},
});

/** Log a generated document */
export const logGeneratedDocument = mutation({
	args: {
		templateId: v.id("templates"),
		templateName: v.string(),
		templateVersion: v.number(),
		formData: v.string(),
		generatedBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		await ctx.db.insert("generatedDocuments", {
			templateId: args.templateId,
			templateName: args.templateName,
			formData: args.formData,
			action: "pdf-download-server" as const,
			generatedBy: args.generatedBy,
			createdAt: Date.now(),
		});
	},
});

// ============================================
// Actions
// ============================================

/**
 * Generate a PDF from a template + data, send via email, log everything.
 *
 * Flow:
 * 1. Read template HTML from templates.content
 * 2. Replace {{placeholders}} with deal data
 * 3. POST filled HTML → /api/pdf-generate → get PDF
 * 4. Send via Resend with PDF attachment
 * 5. Log to generatedDocuments (with templateVersion)
 * 6. Update workflowTask status → "sent" (if linked)
 */
export const generateAndSendDocument = action({
	args: {
		templateId: v.id("templates"),
		to: v.string(),
		subject: v.string(),
		data: v.record(v.string(), v.string()),
		workflowTaskId: v.optional(v.id("workflowTasks")),
		htmlBody: v.optional(v.string()),
		generatedBy: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<{ success: boolean; resendId?: string; templateVersion?: number }> => {
		const {
			templateId,
			to,
			subject,
			data,
			workflowTaskId,
			htmlBody,
			generatedBy,
		} = args;

		// 1. Read template from templates table (not documentTemplates)
		const template = await ctx.runQuery(api.documentPipeline.getTemplate, {
			templateId,
		});
		if (!template) throw new Error(`Template ${templateId} not found`);
		if (!template.content)
			throw new Error(`Template "${template.title}" has no HTML content`);

		// 2. Fill placeholders
		const filledHtml = fillTemplate(template.content, data);

		// 3. Generate PDF
		const pdfResult: any = await ctx.runAction(api.pdfGenerator.generatePdf, {
			formData: data,
			templateId: template._id,
			templateName: template.title,
			htmlContent: filledHtml,
			mode: "full",
		});
		const pdfBase64 = pdfResult.pdfBase64;

		// 4. Send email with PDF attachment
		const emailResult = await sendEmail({
			to,
			subject,
			html:
				htmlBody ||
				`<p>Please find the attached document: <strong>${template.title}</strong></p>`,
			attachments: [
				{
					filename: `${template.title.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-")}.pdf`,
					content: pdfBase64,
				},
			],
		});

		if (!emailResult.success) {
			throw new Error(`Email send failed: ${emailResult.error}`);
		}

		// 5. Log to generatedDocuments
		await ctx.runMutation(api.documentPipeline.logGeneratedDocument, {
			templateId,
			templateName: template.title,
			templateVersion: template.version ?? 1,
			formData: JSON.stringify(data),
			generatedBy,
		});

		// 6. Update workflowTask if linked
		if (workflowTaskId && emailResult.id) {
			await ctx.runMutation(api.documentPipeline.markWorkflowTaskSent, {
				workflowTaskId,
				resendId: emailResult.id,
			});
		}

		return {
			success: true,
			resendId: emailResult.id,
			...(template.version !== undefined ? { templateVersion: template.version } : {}),
		};
	},
});

/**
 * Generate all required documents for a deal stage.
 * Sequential calls — each is independently retryable.
 */
export const generateStageDocuments = action({
	args: {
		stage: v.string(),
		to: v.string(),
		data: v.record(v.string(), v.string()),
		generatedBy: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { stage, to, data, generatedBy } = args;

		const requirements = await ctx.runQuery(
			api.documentPipeline.getStageRequirements,
			{ stage },
		);

		const succeeded: string[] = [];
		const failed: { templateId: string; error: string }[] = [];

		for (const req of requirements) {
			try {
				const template = await ctx.runQuery(
					api.documentPipeline.getTemplate,
					{ templateId: req.templateId },
				);
				if (!template) {
					failed.push({
						templateId: req.templateId,
						error: "Template not found",
					});
					continue;
				}
				if (!template.content) {
					failed.push({
						templateId: req.templateId,
						error: `Template "${template.title}" has no HTML content`,
					});
					continue;
				}

				await ctx.runAction(api.documentPipeline.generateAndSendDocument, {
					templateId: req.templateId,
					to,
					subject: `Forhemit — ${template.title}`,
					data,
					generatedBy,
				});

				succeeded.push(template.title);
			} catch (error) {
				failed.push({
					templateId: req.templateId,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		return {
			succeeded,
			failed,
			message: `${succeeded.length} sent, ${failed.length} failed`,
		};
	},
});
