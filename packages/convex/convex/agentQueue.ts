import { v } from "convex/values";
import { query, mutation, action, internal } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal as internalApi } from "./_generated/api";

// ============================================
// Pipeline Stage → Agent Mapping
// ============================================

/**
 * Maps CRM pipeline stages to the agent + template that should run
 * when a deal enters that stage.
 *
 * "First contact" → no agent (manual intake)
 * "Intro call"    → no agent (relationship building)
 * "NDA sent"      → no agent (legal process)
 * "Feasibility"   → deal-analyst runs Gate 1 assessment
 * "Term sheet"    → capital-structurer designs the capital stack
 * "LOI signed"    → document-producer generates closing docs
 * "Closed"        → steward-monitor begins post-close tracking
 * "On hold"       → no agent
 * "Dead"          → no agent
 */
const STAGE_AGENT_MAP: Record<
  string,
  { agentId: string; templateId: string; gate: number } | null
> = {
  "First contact": null,
  "Intro call": null,
  "NDA sent": null,
  "Feasibility": { agentId: "deal-analyst", templateId: "T-04", gate: 1 },
  "Term sheet": { agentId: "capital-structurer", templateId: "T-08", gate: 2 },
  "LOI signed": { agentId: "document-producer", templateId: "T-13", gate: 3 },
  "Closed": { agentId: "steward-monitor", templateId: "T-21", gate: 4 },
  "On hold": null,
  "Dead": null,
};

// ============================================
// Agent Queue Queries
// ============================================

/**
 * Get pending jobs ordered by priority (used by processAgentQueue).
 */
export const getPending = query({
  args: {
    limit: v.optional(v.number()),
    simulationOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 1;

    if (args.simulationOnly) {
      return await ctx.db
        .query("agentQueue")
        .withIndex("by_status_priority", (q) =>
          q.eq("status", "simulation")
        )
        .order("asc")
        .take(limit);
    }

    return await ctx.db
      .query("agentQueue")
      .withIndex("by_status_priority", (q) =>
        q.eq("status", "pending")
      )
      .order("asc")
      .take(limit);
  },
});

/**
 * Get queue jobs for a company.
 */
export const listByCompany = query({
  args: {
    companyId: v.id("crmCompanies"),
    gate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("agentQueue")
      .withIndex("by_company", (q) =>
        q.eq("companyId", args.companyId)
      );

    if (args.gate !== undefined) {
      q = q.filter((q) => q.eq(q.field("gate"), args.gate));
    }

    return await q.order("desc").collect();
  },
});

/**
 * Get queue jobs by agent and status.
 */
export const getByAgent = query({
  args: {
    agentId: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("agentQueue")
      .withIndex("by_agent", (q) =>
        q.eq("agentId", args.agentId)
      );

    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await q.order("desc").collect();
  },
});

// ============================================
// Agent Queue Mutations
// ============================================

/**
 * Enqueue an agent job.
 * Called by advanceStage or manually for rework/simulation.
 */
export const enqueue = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    agentId: v.string(),
    templateId: v.string(),
    gate: v.number(),
    priority: v.optional(v.number()),
    isSimulation: v.optional(v.boolean()),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const isSimulation = args.isSimulation ?? false;

    return await ctx.db.insert("agentQueue", {
      companyId: args.companyId,
      agentId: args.agentId,
      templateId: args.templateId,
      gate: args.gate,
      status: isSimulation ? "simulation" : "pending",
      priority: args.priority ?? 1,
      isSimulation,
      context: args.context,
      createdAt: Date.now(),
    });
  },
});

/**
 * Mark a queue job as in_progress.
 */
export const markInProgress = mutation({
  args: { id: v.id("agentQueue") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id);
    if (!job) throw new Error("Queue job not found");

    await ctx.db.patch(args.id, {
      status: "in_progress" as const,
      startedAt: Date.now(),
    });
    return args.id;
  },
});

/**
 * Mark a queue job as completed.
 */
export const markCompleted = mutation({
  args: { id: v.id("agentQueue") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id);
    if (!job) throw new Error("Queue job not found");

    await ctx.db.patch(args.id, {
      status: "completed" as const,
      completedAt: Date.now(),
    });
    return args.id;
  },
});

/**
 * Mark a queue job as failed with error message.
 */
export const markFailed = mutation({
  args: {
    id: v.id("agentQueue"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.id);
    if (!job) throw new Error("Queue job not found");

    await ctx.db.patch(args.id, {
      status: "failed" as const,
      error: args.error,
      completedAt: Date.now(),
    });
    return args.id;
  },
});

// ============================================
// advanceStage — The Critical Wiring Point
// ============================================

/**
 * Advance a company to a new pipeline stage and trigger agent work.
 *
 * This is the bridge between the CRM and the AI agent framework.
 * When a deal moves to a new stage, this mutation:
 * 1. Updates the company's stage in crmCompanies
 * 2. Logs the stage change as a crmActivity
 * 3. Looks up the stage in STAGE_AGENT_MAP
 * 4. If an agent is mapped, enqueues a job in agentQueue
 *
 * Call this instead of crmCompanies.update when changing stages,
 * so agent work is automatically triggered.
 */
export const advanceStage = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    newStage: v.union(
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
    isSimulation: v.optional(v.boolean()),
    performedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) throw new Error("Company not found");

    const oldStage = company.stage;
    const now = Date.now();
    const isSimulation = args.isSimulation ?? false;

    // 1. Update the company stage
    await ctx.db.patch(args.companyId, {
      stage: args.newStage,
      updatedAt: now,
    });

    // 2. Log the stage change activity
    await ctx.db.insert("crmActivities", {
      companyId: args.companyId,
      type: "stage_change",
      title: "Stage changed",
      description: `Stage moved from "${oldStage}" to "${args.newStage}"`,
      date: new Date().toISOString().split("T")[0],
      performedBy: args.performedBy,
      metadata: {
        oldStage,
        newStage: args.newStage,
      },
      createdAt: now,
    });

    // 3. Check if this stage triggers an agent
    const mapping = STAGE_AGENT_MAP[args.newStage];
    if (!mapping) {
      return { success: true, agentQueued: false };
    }

    // 4. Enqueue agent work (wrapped in try/catch so CRM still works
    //    if agent tables aren't deployed yet)
    try {
      // Build context snapshot for the agent
      const contacts = await ctx.db
        .query("crmContacts")
        .withIndex("by_company", (q) =>
          q.eq("companyId", args.companyId)
        )
        .collect();

      const recentActivities = await ctx.db
        .query("crmActivities")
        .withIndex("by_company_date", (q) =>
          q.eq("companyId", args.companyId)
        )
        .order("desc")
        .take(20);

      const contextSnapshot = JSON.stringify({
        company: {
          id: company._id,
          name: company.name,
          industry: company.industry,
          size: company.size,
          revenue: company.revenue,
          stage: args.newStage,
          ndaStatus: company.ndaStatus,
          notes: company.notes,
        },
        contacts: contacts.map((c) => ({
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          phone: c.phone,
          role: c.role,
          isPrimary: c.isPrimary,
        })),
        recentActivities: recentActivities.map((a) => ({
          type: a.type,
          title: a.title,
          description: a.description,
          date: a.date,
        })),
        stageTransition: {
          from: oldStage,
          to: args.newStage,
          timestamp: now,
        },
      });

      const jobId = await ctx.db.insert("agentQueue", {
        companyId: args.companyId,
        agentId: mapping.agentId,
        templateId: mapping.templateId,
        gate: mapping.gate,
        status: isSimulation ? "simulation" : "pending",
        priority: 1,
        isSimulation,
        context: contextSnapshot,
        createdAt: now,
      });

      return { success: true, agentQueued: true, jobId };
    } catch (e) {
      // CRM still works if agent tables aren't deployed
      console.warn("Failed to queue agent work:", e);
      return { success: true, agentQueued: false, warning: String(e) };
    }
  },
});
