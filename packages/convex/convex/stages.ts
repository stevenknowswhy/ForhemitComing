import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Stage types
export type DealStage =
  | "First contact"
  | "Intro call"
  | "NDA sent"
  | "Feasibility"
  | "Term sheet"
  | "LOI signed"
  | "Closed"
  | "On hold"
  | "Dead";

export interface StageState {
  stage: DealStage;
  stageEnteredAt?: number;
  updatedAt?: number;
}

// Default stage state
export const DEFAULT_STAGE_STATE: StageState = {
  stage: "First contact",
  stageEnteredAt: Date.now(),
  updatedAt: Date.now(),
};

/** Pure helper: resolve stage from a company record */
export function resolveStage(company: { stage?: string; stageEnteredAt?: number; updatedAt?: number } | null): StageState {
  if (!company) return DEFAULT_STAGE_STATE;
  return {
    stage: (company.stage as DealStage) || "First contact",
    stageEnteredAt: company.stageEnteredAt,
    updatedAt: company.updatedAt,
  };
}

/** Pure helper: check if a stage transition is valid (no DB access) */
export function checkStageTransition(currentStage: string, newStage: string): boolean {
  const validTransitions: Record<string, string[]> = {
    "First contact": ["Intro call", "Dead"],
    "Intro call": ["NDA sent", "Dead"],
    "NDA sent": ["Feasibility", "Dead"],
    "Feasibility": ["Term sheet", "Dead"],
    "Term sheet": ["LOI signed", "Dead"],
    "LOI signed": ["Closed", "Dead"],
    "Closed": ["Dead"],
    "Dead": ["First contact"],
    "On hold": ["First contact", "Intro call", "NDA sent", "Feasibility", "Term sheet", "LOI signed"],
  };
  const validNextStages = validTransitions[currentStage] || [];
  return validNextStages.includes(newStage);
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Initialize stage state for a deal
 */
export const initializeStage = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    stage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const stage = (args.stage || "First contact") as DealStage;

    await ctx.db.patch(args.companyId, {
      stage,
      stageEnteredAt: now,
      updatedAt: now,
    });

    return { stage, stageEnteredAt: now };
  },
});

/**
 * Advance deal to a new stage
 */
export const advanceDealStage = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    newStage: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate stage transition
    const company = await ctx.db.get(args.companyId);
    if (!company) throw new Error("Company not found");
    if (!checkStageTransition(company.stage, args.newStage)) {
      throw new Error(`Invalid stage transition from ${company.stage} to ${args.newStage}`);
    }

    const oldStage = company.stage;

    await ctx.db.patch(args.companyId, {
      stage: args.newStage as DealStage,
      stageEnteredAt: now,
      updatedAt: now,
    });

    return {
      oldStage,
      newStage: args.newStage as DealStage,
      stageEnteredAt: now,
    };
  },
});

/**
 * Set stage notes (can be used for stage-specific information)
 */
export const setStageNotes = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.companyId, {
      notes: args.notes,
      updatedAt: now,
    });
  },
});

/**
 * Reset deal to first touch stage
 */
export const resetDealStage = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.companyId, {
      stage: "First contact",
      stageEnteredAt: now,
      updatedAt: now,
      ...args.notes ? { notes: args.notes } : {},
    });

    return { stage: "First contact", stageEnteredAt: now };
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Get current stage state for a company
 */
export const getStage = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    return resolveStage(company);
  },
});

/**
 * Get stage history (would need to be implemented with additional schema)
 */
export const getStageHistory = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    // This would need a stageHistory table to track transitions
    // For now, just return current state
    const company = await ctx.db.get(args.companyId);
    return [resolveStage(company)];
  },
});

/**
 * Check if a stage transition is valid
 */
export const isValidStageTransition = query({
  args: {
    currentStage: v.string(),
    newStage: v.string(),
  },
  handler: async (_ctx, args) => {
    return checkStageTransition(args.currentStage, args.newStage);
  },
});

/**
 * Get stage information with metadata
 */
export const getStageInfo = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    const stage = resolveStage(company);

    const stageDays = stage.stageEnteredAt
      ? Math.floor((Date.now() - stage.stageEnteredAt) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      ...stage,
      stageDays,
      lastUpdated: company?.updatedAt,
    };
  },
});

/**
 * Calculate due date for stage-based triggers
 */
export const calculateStageTriggerDueDate = (stageEnteredAt: number | undefined, daysOffset: number): number | undefined => {
  if (!stageEnteredAt) return undefined;
  return stageEnteredAt + daysOffset * 86_400_000;
};