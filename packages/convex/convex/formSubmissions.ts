import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// Submit a form response — updates workflowTask
// ============================================

export const submitForm = mutation({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    responseData: v.any(),
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.workflowTaskId);
    if (!task) throw new Error("Workflow task not found");

    // Update the task with form response
    await ctx.db.patch(args.workflowTaskId, {
      status: "received",
      receivedAt: Date.now(),
      responseData: {
        ...args.responseData,
        submittedAt: Date.now(),
        submittedBy: args.submittedBy,
      },
      updatedAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId: task.companyId,
      type: "email",
      title: "Form submitted",
      description: `Form response received for workflow task`,
      date: new Date().toISOString().split("T")[0],
      performedBy: args.submittedBy || "system",
      createdAt: Date.now(),
    });

    return { success: true, taskId: args.workflowTaskId };
  },
});

// ============================================
// Get form data for a workflow task
// ============================================

export const getFormData = query({
  args: { workflowTaskId: v.id("workflowTasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.workflowTaskId);
    if (!task) return null;

    const template = await ctx.db.get(task.templateId);
    const company = await ctx.db.get(task.companyId);
    const contact = task.contactId ? await ctx.db.get(task.contactId) : null;

    return {
      task,
      template: template ? {
        title: template.title,
        description: template.description,
        category: template.category,
        content: template.content,
      } : null,
      company: company ? {
        name: company.name,
        stage: company.stage,
      } : null,
      contact: contact ? {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        role: contact.role,
      } : null,
    };
  },
});

// ============================================
// Get all form submissions for a company
// ============================================

export const getCompanyFormSubmissions = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("workflowTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.neq(q.field("responseData"), undefined))
      .collect();

    const enriched = await Promise.all(
      tasks.map(async (task) => {
        const template = await ctx.db.get(task.templateId);
        return {
          taskId: task._id,
          templateTitle: template?.title || "Unknown",
          submittedAt: task.receivedAt,
          responseData: task.responseData,
          status: task.status,
        };
      })
    );

    return enriched;
  },
});
