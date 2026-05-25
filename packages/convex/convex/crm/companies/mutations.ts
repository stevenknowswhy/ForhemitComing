import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { validateCompanyData } from "./validators";

/**
 * Create a new company
 */
export const create = mutation({
  args: {
    name: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()), // e.g., "150 employees"
    revenue: v.optional(v.string()), // e.g., "$22M"
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    stage: v.union(
      v.literal("First contact"),
      v.literal("Intro call"),
      v.literal("NDA sent"),
      v.literal("Feasibility"),
      v.literal("Term sheet"),
      v.literal("LOI signed"),
      v.literal("Closed"),
      v.literal("On hold"),
      v.literal("Dead")
    ),
    ndaStatus: v.union(v.literal("None"), v.literal("Pending"), v.literal("Signed")),
    advisor: v.optional(v.string()), // e.g., "Morgan Stanley", "Self-sourced"
    referralSource: v.optional(v.string()),
    lastContactDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    nextStep: v.optional(v.string()),
    nextStepDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    expectedCloseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate input data
    const validation = validateCompanyData(args);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const now = Date.now();
    const companyId = await ctx.db.insert("crmCompanies", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return ctx.db.get(companyId);
  },
});

/**
 * Update an existing company
 */
export const update = mutation({
  args: {
    id: v.id("crmCompanies"),
    name: v.optional(v.string()),
    industry: v.optional(v.string()),
    size: v.optional(v.string()), // e.g., "150 employees"
    revenue: v.optional(v.string()), // e.g., "$22M"
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    stage: v.optional(
      v.union(
        v.literal("First contact"),
        v.literal("Intro call"),
        v.literal("NDA sent"),
        v.literal("Feasibility"),
        v.literal("Term sheet"),
        v.literal("LOI signed"),
        v.literal("Closed"),
        v.literal("On hold"),
        v.literal("Dead")
      )
    ),
    ndaStatus: v.optional(v.union(v.literal("None"), v.literal("Pending"), v.literal("Signed"))),
    advisor: v.optional(v.string()), // e.g., "Morgan Stanley", "Self-sourced"
    referralSource: v.optional(v.string()),
    lastContactDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    nextStep: v.optional(v.string()),
    nextStepDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    expectedCloseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.id);
    if (!company) {
      throw new Error("Company not found");
    }

    // Validate partial updates
    const { id: _id, ...updateData } = args;

    if (Object.keys(updateData).length > 0) {
      const validation = validateCompanyData(updateData);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }
    }

    await ctx.db.patch(args.id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.id);
  },
});

/**
 * Delete a company and all related data
 */
export const remove = mutation({
  args: { id: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.id);
    if (!company) {
      throw new Error("Company not found");
    }

    // Delete related contacts
    const contacts = await ctx.db
      .query("crmContacts")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .collect();
    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
    }

    // Delete related activities
    const activities = await ctx.db
      .query("crmActivities")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .collect();
    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }

    // Delete related tasks
    const tasks = await ctx.db
      .query("crmTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete the company
    await ctx.db.delete(args.id);

    return { success: true };
  },
});