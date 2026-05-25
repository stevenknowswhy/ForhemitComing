import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Fee milestone types
export type FeeMilestone = "retainer" | "validation" | "commitment" | "success";
export type FeeStatus = "pending" | "invoiced" | "paid";

export interface FeeMilestoneData {
  status: FeeStatus;
  amount: number;
  invoicedAt?: number;
  paidAt?: number;
}

export interface FeesState {
  retainer: FeeMilestoneData;
  validation: FeeMilestoneData;
  commitment: FeeMilestoneData;
  success: FeeMilestoneData;
}

// Default fees state
export const DEFAULT_FEES: FeesState = {
  retainer: { status: "pending", amount: 25000 },
  validation: { status: "pending", amount: 50000 },
  commitment: { status: "pending", amount: 100000 },
  success: { status: "pending", amount: 0 },
};

/**
 * Pure computation: build initial FeesState from ebitda.
 * Extracted so callers don't need to go through a mutation.
 */
export function computeInitialFees(ebitda: number): FeesState {
  const { calculateFees } = require("../feeSchedule");
  const breakdown = calculateFees(ebitda);
  return {
    retainer: { status: "pending", amount: breakdown.retainer },
    validation: { status: "pending", amount: breakdown.validation },
    commitment: { status: "pending", amount: breakdown.commitment },
    success: { status: "pending", amount: breakdown.success },
  };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Initialize fees for a deal
 */
export const initializeFees = mutation({
  args: {
    ebitda: v.number(),
  },
  handler: async (_ctx, args) => {
    return computeInitialFees(args.ebitda);
  },
});

/**
 * Update fee milestone status
 */
export const updateFee = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    milestone: v.union(
      v.literal("retainer"),
      v.literal("validation"),
      v.literal("commitment"),
      v.literal("success"),
    ),
    status: v.union(v.literal("invoiced"), v.literal("paid")),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) throw new Error("Company not found");
    if (!company.fees) throw new Error("Deal not initialized — fees are missing");

    const now = Date.now();
    const milestone = { ...company.fees[args.milestone] };

    milestone.status = args.status;
    if (args.status === "invoiced") {
      milestone.invoicedAt = now;
    } else {
      milestone.paidAt = now;
    }

    const updatedFees = {
      ...company.fees,
      [args.milestone]: milestone,
    };

    await ctx.db.patch(args.companyId, {
      fees: updatedFees,
      updatedAt: now,
    });

    return updatedFees;
  },
});

/**
 * Update fee milestone amount
 */
export const updateFeeAmount = mutation({
  args: {
    companyId: v.id("crmCompanies"),
    milestone: v.union(
      v.literal("retainer"),
      v.literal("validation"),
      v.literal("commitment"),
      v.literal("success"),
    ),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) throw new Error("Company not found");
    if (!company.fees) throw new Error("Deal not initialized — fees are missing");

    const now = Date.now();
    const milestone = { ...company.fees[args.milestone] };

    milestone.amount = args.amount;

    const updatedFees = {
      ...company.fees,
      [args.milestone]: milestone,
    };

    await ctx.db.patch(args.companyId, {
      fees: updatedFees,
      updatedAt: now,
    });

    return updatedFees;
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Get fees state for a company
 */
export const getFees = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    return resolveFees(company);
  },
});

/** Pure helper: resolve fees from a company record */
export function resolveFees(company: Record<string, any> | null): FeesState {
  return (company?.fees as FeesState) ?? DEFAULT_FEES;
}

/**
 * Check if all fees are paid
 */
export const areAllFeesPaid = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    const fees = resolveFees(company);
    return Object.values(fees).every(fee => fee.status === "paid");
  },
});

/**
 * Get fees summary with status counts
 */
export const getFeesSummary = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    const fees = resolveFees(company);

    const paid = Object.values(fees).filter(fee => fee.status === "paid").length;
    const invoiced = Object.values(fees).filter(fee => fee.status === "invoiced").length;
    const total = Object.keys(fees).length;

    const totalAmount = Object.values(fees).reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = Object.values(fees)
      .filter(fee => fee.status === "paid")
      .reduce((sum, fee) => sum + fee.amount, 0);

    return {
      paid,
      invoiced,
      pending: total - paid - invoiced,
      total,
      totalAmount,
      paidAmount,
      percentagePaid: Math.round((paidAmount / totalAmount) * 100),
      fees,
    };
  },
});

/**
 * Get fee breakdown for reporting
 */
export const getFeeBreakdown = query({
  args: { companyId: v.id("crmCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    const fees = resolveFees(company);

    return Object.entries(fees).map(([milestone, data]) => ({
      milestone,
      ...data,
      statusDisplay: data.status === "pending" ? "Pending" :
                     data.status === "invoiced" ? "Invoiced" : "Paid",
      paidDisplay: data.status === "paid" ? "Paid" :
                   data.status === "invoiced" ? "Invoiced" : "Not yet paid",
    }));
  },
});