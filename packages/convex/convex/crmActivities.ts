import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// ============================================
// CRM Activities Queries
// ============================================

/**
 * Get all activities for a company
 */
export const listByCompany = query({
  args: {
    companyId: v.id("crmCompanies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("crmActivities")
      .withIndex("by_company_date", (q) => q.eq("companyId", args.companyId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

/**
 * Get recent activities across all companies
 */
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("crmActivities")
      .withIndex("by_date", (q) => q)
      .order("desc")
      .take(limit);
  },
});

/**
 * Get activities by type
 */
export const getByType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("crmActivities")
      .withIndex("by_type", (q) =>
        q.eq("type", args.type as Doc<"crmActivities">["type"])
      )
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

// ============================================
// CRM Activities Mutations
// ============================================

/**
 * Create a new activity
 */
export const create = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    performedBy: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        oldStage: v.optional(v.string()),
        newStage: v.optional(v.string()),
        duration: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const activityId = await ctx.db.insert("crmActivities", {
      companyId: args.companyId,
      type: args.type as Doc<"crmActivities">["type"],
      title: args.title,
      description: args.description,
      date: args.date,
      performedBy: args.performedBy,
      metadata: args.metadata,
      createdAt: now,
    });

    // Update company's last contact date if this is a contact activity
    if (["call", "email", "meeting"].includes(args.type)) {
      await ctx.db.patch(args.companyId, {
        lastContactDate: args.date,
        updatedAt: now,
      });
    }

    return activityId;
  },
});

/**
 * Update an existing activity
 */
export const update = mutation({
  args: {
    id: v.id("crmActivities"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    performedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const activity = await ctx.db.get(id);

    if (!activity) {
      throw new Error("Activity not found");
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

/**
 * Delete an activity
 */
export const remove = mutation({
  args: { id: v.id("crmActivities") },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.id);
    if (!activity) {
      throw new Error("Activity not found");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

/**
 * Log a quick note/activity
 */
export const logNote = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    note: v.string(),
    performedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const today = new Date().toISOString().split("T")[0];

    const activityId = await ctx.db.insert("crmActivities", {
      companyId: args.companyId,
      type: "note",
      title: "Note added",
      description: args.note,
      date: today,
      performedBy: args.performedBy,
      createdAt: now,
    });

    // Update company's last contact date
    await ctx.db.patch(args.companyId, {
      lastContactDate: today,
      updatedAt: now,
    });

    return activityId;
  },
});
