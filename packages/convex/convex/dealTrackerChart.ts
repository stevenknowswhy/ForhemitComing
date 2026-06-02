/**
 * Deal Tracker → Phase Radial Chart Query
 *
 * Transforms per-company deal tracker data into the PhaseData shape
 * the radial chart component expects. Imports PHASE_CHART_CONFIG
 * from a local copy because Convex runtime cannot resolve @forhemit/shared.
 *
 * If you change ring order or task IDs, update BOTH this file and
 * packages/shared/src/lib/phaseChartConfig.ts.
 */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

// ─── Inline Config (mirrors packages/shared/src/lib/phaseChartConfig.ts) ──

interface RingConfig {
	taskId: string;
	label: string;
	isGate?: boolean;
	gateIndex?: number;
}

interface PhaseConfig {
	key: string;
	label: string;
	rings: RingConfig[];
}

interface GateConfig {
	gateIndex: number;
	label: string;
	dayTarget: number;
}

const PHASE_CHART_CONFIG: { phases: PhaseConfig[]; gates: GateConfig[] } = {
	phases: [
		{
			key: "ignition",
			label: "Ignition",
			rings: [
				{ taskId: "t1_1", label: "Retainer Secured" },
				{ taskId: "t1_8", label: "ESOP Counsel Engaged" },
				{ taskId: "t1_10", label: "Data Room Populated" },
				{ taskId: "t1_11", label: "COOP v1.0 Delivered" },
				{ taskId: "t1_12", label: "Pre-COOP Status" },
			],
		},
		{
			key: "build",
			label: "Build",
			rings: [
				{ taskId: "t2_1", label: "QofE Fieldwork" },
				{ taskId: "t2_7", label: "Lender Package" },
				{ taskId: "t2_8", label: "FMV Appraisal" },
				{ taskId: "t2_3", label: "COOP v2.0" },
				{
					taskId: "t2_gate",
					label: "Gate 1: FMV",
					isGate: true,
					gateIndex: 0,
				},
			],
		},
		{
			key: "validate",
			label: "Validate",
			rings: [
				{ taskId: "t3_1", label: "LOI Executed" },
				{ taskId: "t3_2", label: "ESOP Plan Draft" },
				{
					taskId: "t3_gate2",
					label: "Gate 2: Lender",
					isGate: true,
					gateIndex: 1,
				},
				{
					taskId: "t3_gate3",
					label: "Gate 3: QofE",
					isGate: true,
					gateIndex: 2,
				},
				{ taskId: "t3_6", label: "Seller Note" },
			],
		},
		{
			key: "closeprep",
			label: "Close Prep",
			rings: [
				{ taskId: "t4_1", label: "PSA Draft" },
				{ taskId: "t4_3", label: "Employment Agreement" },
				{ taskId: "t4_4", label: "Landlord Consents" },
				{ taskId: "t4_7", label: "COOP v4.0 Final" },
				{
					taskId: "t4_gate4",
					label: "Gate 4: COOP",
					isGate: true,
					gateIndex: 3,
				},
			],
		},
		{
			key: "closing",
			label: "Closing",
			rings: [
				{ taskId: "t5_1", label: "Title/Lien" },
				{ taskId: "t5_2", label: "Wire Protocol" },
				{ taskId: "t5_3", label: "Lender Authorization" },
				{ taskId: "t5_4", label: "Day 121 Ready" },
				{ taskId: "t5_7", label: "Closing Day" },
			],
		},
	],

	gates: [
		{ gateIndex: 0, label: "Gate 1: FMV", dayTarget: 45 },
		{ gateIndex: 1, label: "Gate 2: Lender", dayTarget: 60 },
		{ gateIndex: 2, label: "Gate 3: QofE", dayTarget: 75 },
		{ gateIndex: 3, label: "Gate 4: COOP", dayTarget: 90 },
	],
};

// ─── Phase key normalization ────────────────────────────────────

function normalizePhaseKey(dbPhase: string): string {
	return dbPhase === "close-prep" ? "closeprep" : dbPhase;
}

// ─── Gate Status Derivation ─────────────────────────────────────

type GateStatus = "cleared" | "pending" | "blocked";

function deriveGateStatus(
	gateTaskStatus: string | undefined,
	allSubsComplete: boolean,
): GateStatus {
	// If the task has an explicit gateStatus, use it
	if (gateTaskStatus === "blocked") return "blocked";
	if (gateTaskStatus === "cleared") return "cleared";

	// Fallback: derive from subtask completion
	if (allSubsComplete) return "cleared";
	return "pending";
}

// ─── Query ──────────────────────────────────────────────────────

export const getPhaseChartStats = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		await requireAuth(ctx);

		// Fetch all tracker tasks for this company
		const tasks = await ctx.db
			.query("dealTrackerTasks")
			.withIndex("by_company", (q) => q.eq("companyId", args.companyId))
			.collect();

		// Build a lookup map: taskId → task record
		const taskMap = new Map<string, (typeof tasks)[number]>();
		for (const task of tasks) {
			taskMap.set(task.taskId, task);
		}

		// No tracker data
		if (tasks.length === 0) {
			return {
				rings: PHASE_CHART_CONFIG.phases.flatMap((phase) =>
					phase.rings.map((ring, ringIndex) => ({
						phase: phase.key,
						ringIndex,
						taskId: ring.taskId,
						label: ring.label,
						completedSubs: 0,
						totalSubs: 0,
						fillPercent: 0,
						isGate: ring.isGate ?? false,
					})),
				),
				gates: PHASE_CHART_CONFIG.gates.map((gate) => ({
					gateIndex: gate.gateIndex,
					label: gate.label,
					dayTarget: gate.dayTarget,
					status: "pending" as GateStatus,
				})),
				summary: { completedItems: 0, totalItems: 0, percent: 0 },
				hasData: false,
			};
		}

		// ── Build ring data ──────────────────────────────────────

		const rings: Array<{
			phase: string;
			ringIndex: number;
			taskId: string;
			label: string;
			completedSubs: number;
			totalSubs: number;
			fillPercent: number;
			isGate: boolean;
		}> = [];

		let totalCompleted = 0;
		let totalItems = 0;

		for (const phase of PHASE_CHART_CONFIG.phases) {
			for (let ringIndex = 0; ringIndex < phase.rings.length; ringIndex++) {
				const ring = phase.rings[ringIndex];
				const task = taskMap.get(ring.taskId);

				let completedSubs = 0;
				let totalSubs = 0;

				if (task) {
					totalSubs = task.subtasks.length;
					completedSubs = task.subtasks.filter((s) => s.completed).length;
				} else {
					// Dev-mode warning: task ID in config not found in DB
					if (process.env.NODE_ENV === "development") {
						console.warn(
							`[phaseChartConfig] Task "${ring.taskId}" (${ring.label}) not found in dealTrackerTasks for company ${args.companyId}`,
						);
					}
				}

				const fillPercent =
					totalSubs > 0
						? Math.round((completedSubs / totalSubs) * 1000) / 10
						: 0;

				totalCompleted += completedSubs;
				totalItems += totalSubs;

				rings.push({
					phase: phase.key,
					ringIndex,
					taskId: ring.taskId,
					label: ring.label,
					completedSubs,
					totalSubs,
					fillPercent,
					isGate: ring.isGate ?? false,
				});
			}
		}

		// ── Build gate data ──────────────────────────────────────

		const gates: Array<{
			gateIndex: number;
			label: string;
			dayTarget: number;
			status: GateStatus;
		}> = [];

		for (const gateConfig of PHASE_CHART_CONFIG.gates) {
			// Find the gate task by matching gateIndex to config
			// The ring config tells us which taskId maps to each gateIndex
			let gateTask: (typeof tasks)[number] | undefined;
			for (const phase of PHASE_CHART_CONFIG.phases) {
				for (const ring of phase.rings) {
					if (ring.isGate && ring.gateIndex === gateConfig.gateIndex) {
						gateTask = taskMap.get(ring.taskId);
						break;
					}
				}
				if (gateTask) break;
			}

			const status = deriveGateStatus(
				gateTask?.gateStatus,
				gateTask?.allSubtasksCompleted ?? false,
			);

			gates.push({
				gateIndex: gateConfig.gateIndex,
				label: gateConfig.label,
				dayTarget: gateConfig.dayTarget,
				status,
			});
		}

		// ── Summary ──────────────────────────────────────────────

		const percent =
			totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

		return {
			rings,
			gates,
			summary: {
				completedItems: totalCompleted,
				totalItems,
				percent,
			},
			hasData: true,
		};
	},
});
