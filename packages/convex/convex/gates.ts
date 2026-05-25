import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// Gate names type
export type GateName = "gate1" | "gate2" | "gate3" | "gate4";

export interface GateState {
	passed: boolean;
	passedAt?: number;
}

export interface GatesState {
	gate1: GateState;
	gate2: GateState;
	gate3: GateState;
	gate4: GateState;
}

// Default gates state
export const DEFAULT_GATES: GatesState = {
	gate1: { passed: false },
	gate2: { passed: false },
	gate3: { passed: false },
	gate4: { passed: false },
};

/** Pure helper: resolve gates from a company record */
export function resolveGates(company: Record<string, any> | null): GatesState {
	return (company?.gates as GatesState) ?? DEFAULT_GATES;
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Initialize gates for a deal
 */
export const initializeGates = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		return DEFAULT_GATES;
	},
});

/**
 * Set a gate as passed with timestamp
 */
export const setGate = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		gateName: v.union(
			v.literal("gate1"),
			v.literal("gate2"),
			v.literal("gate3"),
			v.literal("gate4"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		if (!company) throw new Error("Company not found");

		const existing = company.gates ?? DEFAULT_GATES;

		const updated = {
			...existing,
			[args.gateName]: { passed: true, passedAt: Date.now() },
		};

		await ctx.db.patch(args.companyId, {
			gates: updated,
			updatedAt: Date.now(),
		});
		return updated;
	},
});

/**
 * Get gates state for a company
 */
export const getGates = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		return resolveGates(company);
	},
});

/**
 * Check if all gates are passed
 */
export const areAllGatesPassed = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		const gates = resolveGates(company);
		return Object.values(gates).every((gate) => gate.passed);
	},
});

/**
 * Check if specific gate is passed
 */
export const isGatePassed = query({
	args: {
		companyId: v.id("crmCompanies"),
		gateName: v.union(
			v.literal("gate1"),
			v.literal("gate2"),
			v.literal("gate3"),
			v.literal("gate4"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		const gates = resolveGates(company);
		return gates[args.gateName]?.passed || false;
	},
});

/**
 * Get gates summary with status counts
 */
export const getGatesSummary = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		const gates = resolveGates(company);

		const passed = Object.values(gates).filter((gate) => gate.passed).length;
		const total = Object.keys(gates).length;

		return {
			passed,
			total,
			percentage: Math.round((passed / total) * 100),
			gates,
		};
	},
});

/**
 * Set a specific gate as passed with timestamp
 * Enhanced version with validation and return
 */
export const passGate = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		gateName: v.union(
			v.literal("gate1"),
			v.literal("gate2"),
			v.literal("gate3"),
			v.literal("gate4"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		if (!company) throw new Error("Company not found");

		const existing = company.gates ?? DEFAULT_GATES;

		const updated = {
			...existing,
			[args.gateName]: { passed: true, passedAt: Date.now() },
		};

		await ctx.db.patch(args.companyId, {
			gates: updated,
			updatedAt: Date.now(),
		});
		return updated;
	},
});

/**
 * Set gates state for a company (bulk update)
 */
export const setGates = mutation({
	args: {
		companyId: v.id("crmCompanies"),
		gates: v.object({
			gate1: v.object({
				passed: v.boolean(),
				passedAt: v.optional(v.number()),
			}),
			gate2: v.object({
				passed: v.boolean(),
				passedAt: v.optional(v.number()),
			}),
			gate3: v.object({
				passed: v.boolean(),
				passedAt: v.optional(v.number()),
			}),
			gate4: v.object({
				passed: v.boolean(),
				passedAt: v.optional(v.number()),
			}),
		}),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		if (!company) throw new Error("Company not found");

		const updated = {
			...args.gates,
			// Ensure all gates exist, even if not provided
			gate1: args.gates.gate1 ?? DEFAULT_GATES.gate1,
			gate2: args.gates.gate2 ?? DEFAULT_GATES.gate2,
			gate3: args.gates.gate3 ?? DEFAULT_GATES.gate3,
			gate4: args.gates.gate4 ?? DEFAULT_GATES.gate4,
		};

		await ctx.db.patch(args.companyId, {
			gates: updated,
			updatedAt: Date.now(),
		});
		return updated;
	},
});

/**
 * Get specific gate state
 */
export const getGate = query({
	args: {
		companyId: v.id("crmCompanies"),
		gateName: v.union(
			v.literal("gate1"),
			v.literal("gate2"),
			v.literal("gate3"),
			v.literal("gate4"),
		),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx);
		const company = await ctx.db.get(args.companyId);
		const gates = resolveGates(company);
		return gates[args.gateName] ?? DEFAULT_GATES[args.gateName];
	},
});

/**
 * Calculate due date for time-based gate triggers
 */
export const calculateGateTriggerDueDate = (
	gateState: GateState | undefined,
	daysOffset: number,
): number | undefined => {
	if (!gateState?.passed || !gateState.passedAt) return undefined;

	return gateState.passedAt + daysOffset * 86_400_000;
};

/**
 * Check gate requirements for stage requirements
 */
export const checkGateRequirements = (
	gates: GatesState | undefined,
	requiredGate?: string,
): boolean => {
	if (!requiredGate) return true;
	if (!gates) return false;

	const gate = gates[requiredGate as keyof typeof gates];
	return gate?.passed || false;
};
