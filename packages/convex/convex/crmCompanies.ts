import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// ============================================
// CRM Companies Queries
// ============================================

/**
 * Get all companies
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("crmCompanies").order("desc").collect();
  },
});

/**
 * Get a single company by ID with related data
 */
export const get = query({
  args: { id: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.id);
    if (!company) return null;

    // Get related contacts
    const contacts = await ctx.db
      .query("crmContacts")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .collect();

    // Get recent activities
    const activities = await ctx.db
      .query("crmActivities")
      .withIndex("by_company_date", (q) => q.eq("companyId", args.id))
      .order("desc")
      .take(50);

    // Get pending tasks
    const tasks = await ctx.db
      .query("crmTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.id))
      .order("desc")
      .take(20);

    return {
      company,
      contacts,
      activities,
      tasks,
    };
  },
});

/**
 * Get companies by stage (for kanban view)
 */
export const getByStage = query({
  args: {
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
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("crmCompanies")
      .withIndex("by_stage", (q) => q.eq("stage", args.stage))
      .order("desc")
      .take(args.limit || 100);
    return results;
  },
});

/**
 * Get pipeline statistics
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allCompanies = await ctx.db.query("crmCompanies").collect();

    const total = allCompanies.length;
    const active = allCompanies.filter(
      (c) => !["Closed", "Dead", "On hold"].includes(c.stage)
    ).length;
    const closed = allCompanies.filter((c) => c.stage === "Closed").length;
    const ndaSigned = allCompanies.filter((c) => c.ndaStatus === "Signed").length;

    // Calculate overdue tasks
    const today = new Date().toISOString().split("T")[0];
    const overdue = allCompanies.filter(
      (c) => c.nextStepDate && c.nextStepDate < today
    ).length;

    // Calculate due this week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const thisWeek = allCompanies.filter((c) => {
      if (!c.nextStepDate) return false;
      return c.nextStepDate >= today && c.nextStepDate <= nextWeek.toISOString().split("T")[0];
    }).length;

    // Stage distribution
    const stageDistribution: Record<string, number> = {};
    allCompanies.forEach((c) => {
      stageDistribution[c.stage] = (stageDistribution[c.stage] || 0) + 1;
    });

    // NDA distribution
    const ndaDistribution = {
      Signed: allCompanies.filter((c) => c.ndaStatus === "Signed").length,
      Pending: allCompanies.filter((c) => c.ndaStatus === "Pending").length,
      None: allCompanies.filter((c) => c.ndaStatus === "None").length,
    };

    return {
      total,
      active,
      closed,
      ndaSigned,
      overdue,
      thisWeek,
      stageDistribution,
      ndaDistribution,
      winRate: total > 0 ? Math.round((closed / total) * 100) : 0,
    };
  },
});

/**
 * Get companies with upcoming tasks for calendar view
 */
export const getWithUpcomingTasks = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const companies = await ctx.db
      .query("crmCompanies")
      .withIndex("by_nextStepDate", (q) =>
        q.gte("nextStepDate", args.startDate).lte("nextStepDate", args.endDate)
      )
      .collect();

    return companies;
  },
});

// ============================================
// CRM Companies Mutations
// ============================================

/**
 * Create a new company
 */
export const create = mutation({
  args: {
    name: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    revenue: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    stage: v.optional(v.string()),
    ndaStatus: v.optional(v.string()),
    advisor: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    lastContactDate: v.optional(v.string()),
    nextStep: v.optional(v.string()),
    nextStepDate: v.optional(v.string()),
    expectedCloseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const companyId = await ctx.db.insert("crmCompanies", {
      name: args.name,
      industry: args.industry,
      size: args.size,
      revenue: args.revenue,
      website: args.website,
      address: args.address,
      stage: (args.stage as Doc<"crmCompanies">["stage"]) || "First contact",
      ndaStatus: (args.ndaStatus as Doc<"crmCompanies">["ndaStatus"]) || "None",
      advisor: args.advisor,
      referralSource: args.referralSource,
      lastContactDate: args.lastContactDate,
      nextStep: args.nextStep,
      nextStepDate: args.nextStepDate,
      expectedCloseDate: args.expectedCloseDate,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Log the creation activity
    await ctx.db.insert("crmActivities", {
      companyId,
      type: "note",
      title: "Company created",
      description: `${args.name} added to the pipeline`,
      date: new Date().toISOString().split("T")[0],
      createdAt: now,
    });

    return companyId;
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
    size: v.optional(v.string()),
    revenue: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    stage: v.optional(v.string()),
    ndaStatus: v.optional(v.string()),
    advisor: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    lastContactDate: v.optional(v.string()),
    nextStep: v.optional(v.string()),
    nextStepDate: v.optional(v.string()),
    expectedCloseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const company = await ctx.db.get(id);

    if (!company) {
      throw new Error("Company not found");
    }

    const now = Date.now();
    const typedUpdates: Partial<Doc<"crmCompanies">> = {};

    // Build typed updates
    if (updates.name) typedUpdates.name = updates.name;
    if (updates.industry !== undefined) typedUpdates.industry = updates.industry;
    if (updates.size !== undefined) typedUpdates.size = updates.size;
    if (updates.revenue !== undefined) typedUpdates.revenue = updates.revenue;
    if (updates.website !== undefined) typedUpdates.website = updates.website;
    if (updates.address !== undefined) typedUpdates.address = updates.address;
    if (updates.stage) typedUpdates.stage = updates.stage as Doc<"crmCompanies">["stage"];
    if (updates.ndaStatus) typedUpdates.ndaStatus = updates.ndaStatus as Doc<"crmCompanies">["ndaStatus"];
    if (updates.advisor !== undefined) typedUpdates.advisor = updates.advisor;
    if (updates.referralSource !== undefined) typedUpdates.referralSource = updates.referralSource;
    if (updates.lastContactDate !== undefined) typedUpdates.lastContactDate = updates.lastContactDate;
    if (updates.nextStep !== undefined) typedUpdates.nextStep = updates.nextStep;
    if (updates.nextStepDate !== undefined) typedUpdates.nextStepDate = updates.nextStepDate;
    if (updates.expectedCloseDate !== undefined) typedUpdates.expectedCloseDate = updates.expectedCloseDate;
    if (updates.notes !== undefined) typedUpdates.notes = updates.notes;
    typedUpdates.updatedAt = now;

    await ctx.db.patch(id, typedUpdates);

    // Log stage change if applicable
    if (updates.stage && updates.stage !== company.stage) {
      await ctx.db.insert("crmActivities", {
        companyId: id,
        type: "stage_change",
        title: "Stage changed",
        description: `Stage moved from "${company.stage}" to "${updates.stage}"`,
        date: new Date().toISOString().split("T")[0],
        metadata: {
          oldStage: company.stage,
          newStage: updates.stage,
        },
        createdAt: now,
      });
    }

    return id;
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
