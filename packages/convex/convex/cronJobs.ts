import { internalMutation } from "./_generated/server";

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
      let needsNewInstance = false;

      if (!lastChild) {
        // No children yet — create first instance
        needsNewInstance = true;
      } else {
        // Check if last child was created more than 6 days ago
        const daysSinceLastCreated = (now - lastChild.createdAt) / oneWeekMs;

        if (parent.recurrenceRule === "weekly" && daysSinceLastCreated >= 0.85) {
          needsNewInstance = true;
        } else if (parent.recurrenceRule === "monthly" && daysSinceLastCreated >= 25) {
          needsNewInstance = true;
        } else if (parent.recurrenceRule === "quarterly" && daysSinceLastCreated >= 80) {
          needsNewInstance = true;
        }
      }

      if (!needsNewInstance) continue;

      // Calculate next instance number
      const nextNumber = (lastChild?.recurrenceInstanceNumber || 0) + 1;

      // Calculate due date based on recurrence
      let dueDate = now + oneWeekMs; // default: 1 week
      if (parent.recurrenceRule === "monthly") {
        dueDate = now + 30 * 24 * 60 * 60 * 1000;
      } else if (parent.recurrenceRule === "quarterly") {
        dueDate = now + 90 * 24 * 60 * 60 * 1000;
      }

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

      const matches = timeBasedReqs.filter((req) => {
        switch (req.trigger) {
          case "DAYS_FROM_STAGE":
            if (!req.daysOffset || !company.stageEnteredAt) return false;
            return company.stageEnteredAt + req.daysOffset * 86_400_000 <= now;

          case "DAYS_FROM_GATE":
            if (!req.daysOffset || !req.triggerGate) return false;
            {
              const gate = company.gates?.[req.triggerGate as keyof typeof company.gates];
              return !!(gate?.passed && gate.passedAt && gate.passedAt + req.daysOffset * 86_400_000 <= now);
            }

          case "DAYS_BEFORE_CLOSING":
            if (!req.daysOffset || !company.expectedCloseDate) return false;
            {
              const closingMs = new Date(company.expectedCloseDate).getTime();
              return !isNaN(closingMs) && closingMs - req.daysOffset * 86_400_000 <= now;
            }

          case "RECURRING":
            return req.stage === company.stage;

          default:
            return false;
        }
      });

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
        let dueDate: number | undefined;
        if (req.daysOffset && req.trigger === "DAYS_FROM_STAGE" && company.stageEnteredAt) {
          dueDate = company.stageEnteredAt + req.daysOffset * 86_400_000;
        } else if (req.daysOffset && req.trigger === "DAYS_FROM_GATE" && req.triggerGate) {
          const gate = company.gates?.[req.triggerGate as keyof typeof company.gates];
          if (gate?.passed && gate.passedAt) {
            dueDate = gate.passedAt + req.daysOffset * 86_400_000;
          }
        } else if (req.daysOffset && req.trigger === "DAYS_BEFORE_CLOSING" && company.expectedCloseDate) {
          const closingMs = new Date(company.expectedCloseDate).getTime();
          if (!isNaN(closingMs)) {
            dueDate = closingMs - req.daysOffset * 86_400_000;
          }
        } else if (req.trigger === "RECURRING") {
          dueDate = now + 7 * 86_400_000; // default: 1 week out
        }

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
