import { v } from "convex/values";
import { query } from "../../_generated/server";
import { Doc } from "../../_generated/dataModel";

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
    const query = ctx.db
      .query("crmCompanies")
      .withIndex("by_stage", (q) => q.eq("stage", args.stage))
      .order("desc");

    const companies = args.limit
      ? await query.take(args.limit)
      : await query.collect();

    return companies;
  },
});

/**
 * Get company statistics dashboard data
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allCompanies = await ctx.db.query("crmCompanies").collect();

    const total = allCompanies.length;
    const active = allCompanies.filter(
      (c) => c.stage !== "Closed" && c.stage !== "Dead"
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