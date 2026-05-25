import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { requireAuth } from "./lib/requireAuth";
import { calculateStageTriggerDueDate } from "./stages";
import { calculateGateTriggerDueDate } from "./gates";

/**
 * Workflow task management utilities and helpers
 * Centralized workflow operations for better separation of concerns
 */

/**
 * Check if a workflow task should be created based on existing tasks
 */
export const shouldCreateWorkflowTask = async (
	ctx: any,
	companyId: Id<"crmCompanies">,
	templateId: Id<"templates">,
	contactId: Id<"crmContacts"> | undefined,
): Promise<boolean> => {
	const existing = await ctx.db
		.query("workflowTasks")
		.withIndex("by_company_template", (q: any) =>
			q.eq("companyId", companyId).eq("templateId", templateId),
		);

	if (contactId) {
		const existingForContact = await existing
			.filter((q: any) => q.eq(q.field("contactId"), contactId))
			.first();
		return !existingForContact;
	} else {
		const existingWithoutContact = await existing.first();
		return !existingWithoutContact;
	}
};

/**
 * Create a workflow task with proper validation and metadata
 */
export const createWorkflowTask = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		templateId: v.id("templates"),
		contactId: v.optional(v.id("crmContacts")),
		dueDate: v.number(),
		recurrenceRule: v.optional(v.string()),
		recurrenceParentId: v.optional(v.id("workflowTasks")),
		recurrenceInstanceNumber: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const template = await ctx.db.get(args.templateId);
		if (!template) throw new Error("Template not found");

		const taskId = await ctx.db.insert("workflowTasks", {
			templateId: args.templateId,
			companyId: args.companyId,
			contactId: args.contactId,
			direction: template.category === "communication" ? "outbound" : "inbound",
			status: "pending",
			dueDate: args.dueDate,
			recurrenceRule: args.recurrenceRule,
			recurrenceParentId: args.recurrenceParentId,
			recurrenceInstanceNumber: args.recurrenceInstanceNumber,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return taskId;
	},
});

/**
 * Calculate workflow task priority based on due date and other factors
 */
export const calculateTaskPriority = (
	dueDate: number,
	isRecurring: boolean = false,
): "high" | "normal" | "low" => {
	const now = Date.now();
	const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

	if (daysUntilDue <= 2) return "high";
	if (daysUntilDue <= 7) return "normal";
	return "low";
};

/**
 * Batch create workflow tasks for multiple contacts
 */
export const createWorkflowTasksForContacts = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		templateId: v.id("templates"),
		contactIds: v.array(v.id("crmContacts")),
		dueDate: v.number(),
		recurrenceRule: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<{ created: number; tasks: any[] }> => {
		await requireAuth(ctx);
		const template = await ctx.db.get(args.templateId);
		if (!template) throw new Error("Template not found");

		const createdTasks: any[] = [];
		const now = Date.now();

		for (const contactId of args.contactIds) {
			const shouldCreate = await shouldCreateWorkflowTask(
				ctx,
				args.companyId,
				args.templateId,
				contactId,
			);

			if (shouldCreate) {
				const taskId: any = await ctx.runMutation(
					api.workflowService.createWorkflowTask,
					{
						companyId: args.companyId,
						templateId: args.templateId,
						contactId,
						dueDate: args.dueDate,
						recurrenceRule: args.recurrenceRule,
					},
				);
				createdTasks.push(taskId);
			}
		}

		return { created: createdTasks.length, tasks: createdTasks };
	},
});

/**
 * Get all pending workflow tasks for a company, sorted by due date
 */
export const getPendingWorkflowTasks = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const tasks = await ctx.db
			.query("workflowTasks")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.filter((q) => q.eq(q.field("status"), "pending"))
			.order("asc")
			.collect();

		const now = Date.now();
		return tasks.map((task) => ({
			...task,
			priority: calculateTaskPriority(task.dueDate),
			isOverdue: task.dueDate < now,
			daysUntilDue: Math.ceil((task.dueDate - now) / (1000 * 60 * 60 * 24)),
		}));
	},
});

/**
 * Mark workflow task as completed
 */
export const completeWorkflowTask = mutation({
	args: {
		taskId: v.id("workflowTasks"),
		completedBy: v.string(),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const task = await ctx.db.get(args.taskId);
		if (!task) throw new Error("Task not found");

		await ctx.db.patch(args.taskId, {
			status: "completed",
			completedAt: Date.now(),
			completedBy: args.completedBy,
			notes: args.notes,
			updatedAt: Date.now(),
		});

		return { success: true };
	},
});
