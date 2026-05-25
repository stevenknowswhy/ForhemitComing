import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { shouldCreateWorkflowTask } from "./workflowService";

// ============================================
// get — fetch a single workflow task by ID
// ============================================

export const get = query({
  args: { id: v.id("workflowTasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============================================
// transitionDealStage — auto-create tasks on stage change
// ============================================

export const transitionDealStage = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    newStage: v.string(),
  },
  handler: async (ctx, args) => {
    const { companyId, newStage } = args;
    const company = await ctx.db.get(companyId);
    if (!company) throw new Error("Company not found");

    const oldStage = company.stage;

    // Update company stage
    await ctx.db.patch(companyId, {
      stage: newStage as any,
      updatedAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId,
      type: "stage_change",
      title: `Stage changed: ${oldStage} → ${newStage}`,
      description: `Deal moved from "${oldStage}" to "${newStage}"`,
      date: new Date().toISOString().split("T")[0],
      performedBy: "system",
      metadata: { oldStage, newStage },
      createdAt: Date.now(),
    });

    // Fetch requirements for this stage
    const requirements = await ctx.db.query("stageRequirements")
      .withIndex("by_stage", (q) => q.eq("stage", newStage))
      .collect();

    const createdTasks: string[] = [];

    for (const req of requirements) {
      if (!req.autoCreate) continue;

      const template = await ctx.db.get(req.templateId);
      if (!template) continue;

      // Find the relevant contact based on audience
      const contactIds: Id<"crmContacts">[] = [];
      for (const audience of req.requiredForAudience) {
        const fkMap: Record<string, Id<"crmContacts"> | undefined> = {
          seller: company.sellerContactId,
          broker: company.brokerContactId,
          lender: company.lenderContactId,
          trustee: company.trusteeContactId,
          counsel: company.counselContactId,
        };
        const contactId = fkMap[audience];
        if (contactId && !contactIds.includes(contactId)) {
          contactIds.push(contactId);
        }
      }

      // If no specific contact (internal audience), create task without contact
      if (contactIds.length === 0 && req.requiredForAudience.includes("internal")) {
        // Check for duplicate
        const shouldCreate = await shouldCreateWorkflowTask(ctx, companyId, req.templateId, undefined);
        if (shouldCreate) {
          const taskId = await ctx.runMutation(api.workflowService.createWorkflowTask, {
            companyId,
            templateId: req.templateId,
            contactId: undefined,
            dueDate: Date.now() + 7 * 86400000, // 7 days
            recurrenceRule: req.recurrenceRule,
          });
          createdTasks.push(taskId);

          // If recurring, create first instance
          if (req.recurrenceRule) {
            await ctx.db.insert("workflowTasks", {
              templateId: req.templateId,
              companyId,
              contactId: undefined,
              direction: template.category === "communication" ? "outbound" : "inbound",
              status: "pending",
              recurrenceParentId: taskId,
              recurrenceInstanceNumber: 1,
              dueDate: Date.now() + 7 * 86400000,
              recurrenceRule: req.recurrenceRule,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }
        continue;
      }

      // Create tasks for each contact
      for (const contactId of contactIds) {
        // Check for duplicate
        const shouldCreate = await shouldCreateWorkflowTask(ctx, companyId, req.templateId, contactId);
        if (shouldCreate) {
          const taskId = await ctx.runMutation(api.workflowService.createWorkflowTask, {
            companyId,
            templateId: req.templateId,
            contactId,
            dueDate: Date.now() + 7 * 86400000,
            recurrenceRule: req.recurrenceRule,
          });
          createdTasks.push(taskId);

          // If recurring, create first instance
          if (req.recurrenceRule) {
            await ctx.db.insert("workflowTasks", {
              templateId: req.templateId,
              companyId,
              contactId,
              direction: template.category === "communication" ? "outbound" : "inbound",
              status: "pending",
              recurrenceParentId: taskId,
              recurrenceInstanceNumber: 1,
              dueDate: Date.now() + 7 * 86400000,
              recurrenceRule: req.recurrenceRule,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }
      }
    }

    return {
      success: true,
      oldStage,
      newStage,
      tasksCreated: createdTasks.length,
      taskIds: createdTasks,
    };
  },
});

// ============================================
// markTaskCompleted — manual completion
// ============================================

export const markTaskCompleted = mutation({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    notes: v.optional(v.string()),
    meetingAgenda: v.optional(v.string()),
    meetingHeldAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.workflowTaskId);
    if (!task) throw new Error("Workflow task not found");

    await ctx.db.patch(args.workflowTaskId, {
      status: "completed",
      completedAt: Date.now(),
      meetingAgenda: args.meetingAgenda,
      meetingHeldAt: args.meetingHeldAt,
      privateNotes: args.notes || task.privateNotes,
      updatedAt: Date.now(),
    });

    // Create note if provided
    if (args.notes) {
      await ctx.db.insert("notes", {
        companyId: task.companyId,
        contactId: task.contactId,
        authorId: (await ctx.db.query("users").first())?._id as any, // TODO: get from auth
        content: args.notes,
        type: "internal",
        isPrivate: true,
        workflowTaskId: args.workflowTaskId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId: task.companyId,
      type: "task",
      title: "Workflow task completed",
      description: `Task marked as completed`,
      date: new Date().toISOString().split("T")[0],
      performedBy: "system",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// ============================================
// markTaskSent — update when email/document sent
// ============================================

export const markTaskSent = mutation({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    resendId: v.optional(v.string()),
    opensignEnvelopeId: v.optional(v.string()),
    responseData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workflowTaskId, {
      status: "sent",
      sentAt: Date.now(),
      resendId: args.resendId,
      opensignEnvelopeId: args.opensignEnvelopeId,
      responseData: args.responseData,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// ============================================
// markTaskReceived — when doc/form comes back
// ============================================

export const markTaskReceived = mutation({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    responseData: v.optional(v.any()),
    signedDocumentUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workflowTaskId, {
      status: "received",
      receivedAt: Date.now(),
      responseData: args.responseData,
      signedDocumentUrl: args.signedDocumentUrl,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// ============================================
// getMissingTasks — agent-facing: what's needed?
// ============================================

export const getMissingTasks = query({
  handler: async (ctx) => {
    // Get all active companies
    const activeCompanies = await ctx.db.query("crmCompanies")
      .filter((q) => q.neq(q.field("stage"), "Dead"))
      .filter((q) => q.neq(q.field("stage"), "Closed"))
      .collect();

    const result: Array<{
      companyId: Id<"crmCompanies">;
      companyName: string;
      stage: string;
      missing: Array<{ title: string; audience: string[]; templateId: Id<"templates"> }>;
      overdue: Array<{ title: string; dueDate: number; taskId: Id<"workflowTasks"> }>;
    }> = [];

    for (const company of activeCompanies) {
      // Get requirements for current stage
      const requirements = await ctx.db.query("stageRequirements")
        .withIndex("by_stage", (q) => q.eq("stage", company.stage))
        .collect();

      // Get existing tasks for this company
      const existingTasks = await ctx.db.query("workflowTasks")
        .withIndex("by_company", (q) => q.eq("companyId", company._id))
        .collect();

      const missing: Array<{ title: string; audience: string[]; templateId: Id<"templates"> }> = [];
      const overdue: Array<{ title: string; dueDate: number; taskId: Id<"workflowTasks"> }> = [];

      for (const req of requirements) {
        const template = await ctx.db.get(req.templateId);
        if (!template) continue;

        const hasTask = existingTasks.some((t) => t.templateId === req.templateId);

        if (!hasTask) {
          missing.push({
            title: template.title,
            audience: req.requiredForAudience,
            templateId: req.templateId,
          });
        }
      }

      // Check for overdue tasks
      const now = Date.now();
      for (const task of existingTasks) {
        if (task.status === "pending" && task.dueDate && task.dueDate < now) {
          const template = await ctx.db.get(task.templateId);
          overdue.push({
            title: template?.title || "Unknown",
            dueDate: task.dueDate,
            taskId: task._id,
          });
        }
      }

      if (missing.length > 0 || overdue.length > 0) {
        result.push({
          companyId: company._id,
          companyName: company.name,
          stage: company.stage,
          missing,
          overdue,
        });
      }
    }

    // Sort by urgency: most missing + overdue first
    result.sort((a, b) => (b.missing.length + b.overdue.length) - (a.missing.length + a.overdue.length));

    return result;
  },
});

// ============================================
// getDealWorkflow — full task list for a deal
// ============================================

export const getDealWorkflow = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("workflowTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const enriched = await Promise.all(
      tasks.map(async (task) => {
        const template = await ctx.db.get(task.templateId);
        const contact = task.contactId ? await ctx.db.get(task.contactId) : null;
        return {
          ...task,
          templateTitle: (template as any)?.title || "Unknown",
          templateCategory: template?.category,
          templateDescription: template?.description,
          contactName: contact ? `${(contact as any).firstName} ${(contact as any).lastName}` : null,
          contactEmail: contact?.email,
        };
      })
    );

    // Group by status
    const grouped = {
      pending: enriched.filter((t) => t.status === "pending"),
      sent: enriched.filter((t) => t.status === "sent"),
      delivered: enriched.filter((t) => t.status === "delivered"),
      opened: enriched.filter((t) => t.status === "opened"),
      received: enriched.filter((t) => t.status === "received"),
      completed: enriched.filter((t) => t.status === "completed"),
      skipped: enriched.filter((t) => t.status === "skipped"),
      overdue: enriched.filter((t) => t.status === "overdue" || (t.status === "pending" && t.dueDate && t.dueDate < Date.now())),
    };

    return grouped;
  },
});

// ============================================
// getAllWorkflowTasks — list all tasks with filters
// ============================================

export const getAllWorkflowTasks = query({
  args: {
    status: v.optional(v.string()),
    companyId: v.optional(v.id("crmCompanies")),
  },
  handler: async (ctx, args) => {
    let tasks;

    if (args.companyId) {
      tasks = await ctx.db.query("workflowTasks")
        .withIndex("by_company", (q) => q.eq("companyId", args.companyId!))
        .collect();
    } else if (args.status) {
      tasks = await ctx.db.query("workflowTasks")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else {
      tasks = await ctx.db.query("workflowTasks").collect();
    }

    const enriched = await Promise.all(
      tasks.map(async (task) => {
        const template = await ctx.db.get(task.templateId);
        const company = await ctx.db.get(task.companyId);
        const contact = task.contactId ? await ctx.db.get(task.contactId) : null;
        return {
          ...task,
          templateTitle: (template as any)?.title || "Unknown",
          companyName: (company as any)?.name || "Unknown",
          contactName: contact ? `${(contact as any).firstName} ${(contact as any).lastName}` : null,
        };
      })
    );

    return enriched;
  },
});
