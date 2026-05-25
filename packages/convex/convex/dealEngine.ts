import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { calculateFees } from "../feeSchedule";
import { DEFAULT_GATES, setGate, calculateGateTriggerDueDate } from "./gates";
import { computeInitialFees } from "./feeCalculator";
import { advanceDealStage, calculateStageTriggerDueDate } from "./stages";
import { createTriggeredTasks, wireTriggers } from "./triggers";

/**
 * Deal Engine — mutations and queries for ESOP deal state management.
 *
 * Manages fee milestones (retainer / validation / commitment / success) and
 * pipeline stage tracking on the crmCompanies table.
 *
 * Gate management has been extracted to gates.ts module for better separation of concerns.
 */

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const initializeDeal = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    ebitda: v.number(),
    ref: v.string(),
  },
  handler: async (ctx, args) => {
    const breakdown = calculateFees(args.ebitda);
    const now = Date.now();

    // Initialize fees using the fee calculator
    const fees = computeInitialFees(args.ebitda);

    await ctx.db.patch(args.companyId, {
      ref: args.ref,
      stageEnteredAt: now,
      updatedAt: now,

      gates: DEFAULT_GATES,

      fees: {
        ...fees,
        tier: String(breakdown.tier),
        ebitda: args.ebitda,
        totalFee: breakdown.totalFee,
        stewardshipAnnual: breakdown.stewardshipAnnual,
        stewardshipTranchesPaid: 0,
        stewardshipTotalTranches: 0,
      },
    });

    return ctx.db.get(args.companyId);
  },
});


// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getDeal = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.companyId);
  },
});

export const getActiveDeals = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("crmCompanies").collect();
    return all.filter(
      (c) => c.fees != null && c.stage !== "Dead" && c.stage !== "On hold",
    );
  },
});

// ---------------------------------------------------------------------------
// Deal queue — enriched view of all tasks for a company
// ---------------------------------------------------------------------------

export const getDealQueue = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    // 1. Get the company
    const company = await ctx.db.get(args.companyId);
    if (!company) return [];

    // 2. Get all workflowTasks for this company
    const tasks = await ctx.db
      .query("workflowTasks")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    if (tasks.length === 0) return [];

    // 3. Get all templates referenced by those tasks
    const templateIds = new Set(tasks.map((t) => t.templateId));
    const templateMap = new Map<string, { title: string; audience: string[] }>();
    for (const tid of templateIds) {
      const tmpl = await ctx.db.get(tid);
      if (tmpl) {
        templateMap.set(tid, { title: tmpl.title, audience: tmpl.audience });
      }
    }

    // 4. Get all stageRequirements for enrichment
    const allReqs = await ctx.db.query("stageRequirements").collect();
    const reqByTemplate = new Map<string, (typeof allReqs)[number]>();
    for (const r of allReqs) {
      if (!reqByTemplate.has(r.templateId)) {
        reqByTemplate.set(r.templateId, r);
      }
    }

    // 5. Build enriched rows
    const now = Date.now();
    const rows = tasks.map((task) => {
      const tmpl = templateMap.get(task.templateId);
      const req = reqByTemplate.get(task.templateId);
      const isOverdue = task.dueDate != null && task.dueDate < now && task.status === "pending";

      return {
        taskId: task._id,
        templateId: task.templateId,
        templateName: tmpl?.title ?? "Unknown",
        audience: tmpl?.audience ?? [],
        status: isOverdue ? "overdue" : task.status,
        dueDate: task.dueDate,
        sentAt: task.sentAt,
        feeMilestone: req?.feeMilestone ?? null,
        autoSend: req?.autoSend ?? false,
        blockingGate: req?.blockingGate ?? null,
        createdAt: task.createdAt,
      };
    });

    // 6. Sort: overdue first, then by dueDate ascending (nulls last)
    rows.sort((a, b) => {
      const aOverdue = a.status === "overdue" ? 0 : 1;
      const bOverdue = b.status === "overdue" ? 0 : 1;
      if (aOverdue !== bOverdue) return aOverdue - bOverdue;

      const aDue = a.dueDate ?? Number.MAX_SAFE_INTEGER;
      const bDue = b.dueDate ?? Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    });

    return rows;
  },
});
