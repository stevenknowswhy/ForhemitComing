import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// ============================================
// CRM Tasks Queries
// ============================================

/**
 * Get all tasks for a company
 */
export const listByCompany = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crmTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

/**
 * Get pending tasks across all companies
 */
export const getPending = query({
  args: {
    limit: v.optional(v.number()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("crmTasks")
      .withIndex("by_dueDate", (q) => q)
      .filter((q) => q.eq(q.field("status"), "pending"))
      .take(args.limit || 50);
    return results;
  },
});

/**
 * Get overdue tasks
 */
export const getOverdue = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    const tasks = await ctx.db
      .query("crmTasks")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Filter overdue in-memory
    const overdue = tasks.filter((t) => t.dueDate && t.dueDate < today);

    // Sort by due date
    overdue.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));

    if (args.limit) {
      return overdue.slice(0, args.limit);
    }
    return overdue;
  },
});

/**
 * Get tasks due today
 */
export const getDueToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    return await ctx.db
      .query("crmTasks")
      .withIndex("by_dueDate", (q) => q.eq("dueDate", today))
      .collect();
  },
});

/**
 * Get a single task by ID
 */
export const get = query({
  args: { id: v.id("crmTasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============================================
// CRM Tasks Mutations
// ============================================

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const taskId = await ctx.db.insert("crmTasks", {
      companyId: args.companyId,
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      status: "pending",
      priority: (args.priority as Doc<"crmTasks">["priority"]) || "medium",
      assignedTo: args.assignedTo,
      createdAt: now,
    });

    // Also update the company's next step if provided
    if (args.title) {
      await ctx.db.patch(args.companyId, {
        nextStep: args.title,
        nextStepDate: args.dueDate,
        updatedAt: now,
      });
    }

    return taskId;
  },
});

/**
 * Update an existing task
 */
export const update = mutation({
  args: {
    id: v.id("crmTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const task = await ctx.db.get(id);

    if (!task) {
      throw new Error("Task not found");
    }

    const typedUpdates: Partial<Doc<"crmTasks">> = {};
    if (updates.title) typedUpdates.title = updates.title;
    if (updates.description !== undefined) typedUpdates.description = updates.description;
    if (updates.dueDate !== undefined) typedUpdates.dueDate = updates.dueDate;
    if (updates.status) typedUpdates.status = updates.status as Doc<"crmTasks">["status"];
    if (updates.priority) typedUpdates.priority = updates.priority as Doc<"crmTasks">["priority"];
    if (updates.assignedTo !== undefined) typedUpdates.assignedTo = updates.assignedTo;

    // If marking as completed, set completedAt
    if (updates.status === "completed" && task.status !== "completed") {
      typedUpdates.completedAt = Date.now();

      // Log activity
      await ctx.db.insert("crmActivities", {
        companyId: task.companyId,
        type: "task",
        title: "Task completed",
        description: `Completed: ${task.title}`,
        date: new Date().toISOString().split("T")[0],
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(id, typedUpdates);

    return id;
  },
});

/**
 * Mark a task as complete
 */
export const complete = mutation({
  args: { id: v.id("crmTasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.id, {
      status: "completed",
      completedAt: now,
    });

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId: task.companyId,
      type: "task",
      title: "Task completed",
      description: `Completed: ${task.title}`,
      date: new Date().toISOString().split("T")[0],
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: { id: v.id("crmTasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
