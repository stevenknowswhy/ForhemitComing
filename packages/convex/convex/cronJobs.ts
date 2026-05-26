import { internalMutation } from "./_generated/server";

const DAY_MS = 86_400_000;

// ─── Recurrence helpers ───────────────────────────────────────────

const RECURRENCE_INTERVALS: Record<string, number> = {
  weekly: 7 * DAY_MS,
  monthly: 30 * DAY_MS,
  quarterly: 90 * DAY_MS,
};

const RECURRENCE_THRESHOLDS: Record<string, number> = {
  weekly: 0.85,
  monthly: 25,
  quarterly: 80,
};

function getRecurrenceDueDate(rule: string | undefined): number {
  const now = Date.now();
  return now + (RECURRENCE_INTERVALS[rule ?? ""] ?? 7 * DAY_MS);
}

// ─── Time-trigger helpers ─────────────────────────────────────────

type TimeTrigger = "DAYS_FROM_STAGE" | "DAYS_FROM_GATE" | "DAYS_BEFORE_CLOSING" | "RECURRING";

interface TriggerRequirement {
  trigger?: TimeTrigger;
  daysOffset?: number;
  triggerGate?: string;
  stage?: string;
  templateId: string;
  recurrenceRule?: string;
}

interface DealCompany {
  _id: string;
  stage: string;
  stageEnteredAt?: number;
  expectedCloseDate?: string;
  gates?: Record<string, { passed?: boolean; passedAt?: number }>;
}

function matchesTrigger(req: TriggerRequirement, deal: DealCompany, now: number): boolean {
  switch (req.trigger) {
    case "DAYS_FROM_STAGE":
      return !!(req.daysOffset && deal.stageEnteredAt &&
        deal.stageEnteredAt + req.daysOffset * DAY_MS <= now);
    case "DAYS_FROM_GATE":
      if (!req.daysOffset || !req.triggerGate) return false;
      {
        const gate = deal.gates?.[req.triggerGate];
        return !!(gate?.passed && gate.passedAt &&
          gate.passedAt + req.daysOffset * DAY_MS <= now);
      }
    case "DAYS_BEFORE_CLOSING":
      if (!req.daysOffset || !deal.expectedCloseDate) return false;
      {
        const closingMs = new Date(deal.expectedCloseDate).getTime();
        return !isNaN(closingMs) && closingMs - req.daysOffset * DAY_MS <= now;
      }
    case "RECURRING":
      return req.stage === deal.stage;
    default:
      return false;
  }
}

function calculateTriggerDueDate(
  req: TriggerRequirement,
  deal: DealCompany,
  now: number,
): number | undefined {
  switch (req.trigger) {
    case "DAYS_FROM_STAGE":
      if (req.daysOffset && deal.stageEnteredAt)
        return deal.stageEnteredAt + req.daysOffset * DAY_MS;
      break;
    case "DAYS_FROM_GATE":
      if (req.daysOffset && req.triggerGate) {
        const gate = deal.gates?.[req.triggerGate];
        if (gate?.passed && gate.passedAt)
          return gate.passedAt + req.daysOffset * DAY_MS;
      }
      break;
    case "DAYS_BEFORE_CLOSING":
      if (req.daysOffset && deal.expectedCloseDate) {
        const closingMs = new Date(deal.expectedCloseDate).getTime();
        if (!isNaN(closingMs)) return closingMs - req.daysOffset * DAY_MS;
      }
      break;
    case "RECURRING":
      return now + 7 * DAY_MS;
  }
  return undefined;
}

// ============================================
// Create recurring tasks — runs weekly
// ============================================

export const createRecurringTasks = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const createdTasks: string[] = [];

    // Find all parent tasks with recurrence rules
    const recurringParents = await ctx.db.query("workflowTasks")
      .filter((q) => q.neq(q.field("recurrenceRule"), undefined))
      .filter((q) => q.eq(q.field("recurrenceParentId"), undefined)) // only parents, not children
      .collect();

    for (const parent of recurringParents) {
      // Skip if parent is completed
      if (parent.status === "completed" || parent.status === "skipped") continue;

      // Find the most recent child instance
      const children = await ctx.db.query("workflowTasks")
        .withIndex("by_parent", (q) => q.eq("recurrenceParentId", parent._id))
        .order("desc")
        .take(1);

      const lastChild = children[0];

      // Determine if we need a new instance
      const needsNewInstance = !lastChild || (() => {
        const weeksSince = (now - lastChild.createdAt) / oneWeekMs;
        const threshold = RECURRENCE_THRESHOLDS[parent.recurrenceRule ?? ""] ?? Infinity;
        return weeksSince >= threshold;
      })();

      if (!needsNewInstance) continue;

      // Calculate next instance number
      const nextNumber = (lastChild?.recurrenceInstanceNumber || 0) + 1;

      // Calculate due date based on recurrence
      const dueDate = getRecurrenceDueDate(parent.recurrenceRule);

      // Create the new instance
      const taskId = await ctx.db.insert("workflowTasks", {
        templateId: parent.templateId,
        companyId: parent.companyId,
        contactId: parent.contactId,
        direction: parent.direction,
        status: "pending",
        dueDate,
        recurrenceRule: parent.recurrenceRule,
        recurrenceParentId: parent._id,
        recurrenceInstanceNumber: nextNumber,
        createdAt: now,
        updatedAt: now,
      });

      createdTasks.push(taskId);
    }

    return {
      success: true,
      parentsChecked: recurringParents.length,
      tasksCreated: createdTasks.length,
      taskIds: createdTasks,
    };
  },
});

// ============================================
// Time-based trigger check — runs daily
// ============================================

export const checkTimeBasedTriggers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let totalCreated = 0;
    let dealsChecked = 0;

    // 1. Get all active deals (companies with fees initialized, not dead/on-hold)
    const allCompanies = await ctx.db.query("crmCompanies").collect();
    const activeDeals = allCompanies.filter(
      (c) => c.fees != null && c.stage !== "Dead" && c.stage !== "On hold",
    );

    // 2. Get all stageRequirements with time-based triggers
    const allReqs = await ctx.db.query("stageRequirements").collect();
    const timeBasedReqs = allReqs.filter((r) =>
      r.trigger && ["DAYS_FROM_STAGE", "DAYS_FROM_GATE", "DAYS_BEFORE_CLOSING", "RECURRING"].includes(r.trigger),
    );

    if (timeBasedReqs.length === 0) {
      return { dealsChecked: 0, tasksCreated: 0, reason: "no time-based rules" };
    }

    // 3. For each active deal, check time-based triggers
    for (const company of activeDeals) {
      dealsChecked++;

      const matches = timeBasedReqs.filter((req) =>
        matchesTrigger(req as TriggerRequirement, company as DealCompany, now)
      );

      // 4. For each match, deduplicate and create task
      for (const req of matches) {
        const existing = await ctx.db
          .query("workflowTasks")
          .withIndex("by_company_template", (q) =>
            q.eq("companyId", company._id).eq("templateId", req.templateId),
          )
          .collect();

        const hasActive = existing.some(
          (t) => t.status !== "skipped" && t.status !== "completed",
        );

        if (hasActive) continue;

        // Calculate dueDate
        const dueDate = calculateTriggerDueDate(req as TriggerRequirement, company as DealCompany, now);

        // Skip if no dueDate could be calculated
        if (dueDate === undefined) continue;

        await ctx.db.insert("workflowTasks", {
          templateId: req.templateId,
          companyId: company._id,
          direction: "outbound" as const,
          status: "pending" as const,
          dueDate,
          recurrenceRule: req.recurrenceRule,
          createdAt: now,
          updatedAt: now,
        });
        totalCreated++;
      }
    }

    return { dealsChecked, tasksCreated: totalCreated };
  },
});
