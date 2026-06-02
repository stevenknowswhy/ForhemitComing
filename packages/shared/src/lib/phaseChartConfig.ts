/**
 * Phase Radial Chart — Shared Configuration
 *
 * Single source of truth for ring order, task mapping, and gate definitions.
 * Imported by the frontend chart component.
 *
 * NOTE: The Convex query (dealTrackerChart.ts) inlines a copy of this config
 * because Convex's runtime cannot resolve @forhemit/shared imports.
 * If you change ring order or task IDs here, update BOTH files.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface RingConfig {
	taskId: string;
	label: string;
	isGate?: boolean;
	gateIndex?: number;
}

export interface PhaseConfig {
	key: string;
	label: string;
	rings: RingConfig[];
}

export interface GateConfig {
	gateIndex: number;
	label: string;
	dayTarget: number;
}

export interface PhaseChartConfigType {
	phases: PhaseConfig[];
	gates: GateConfig[];
}

// ─── Config ─────────────────────────────────────────────────────

export const PHASE_CHART_CONFIG: PhaseChartConfigType = {
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
					label: "Gate 2: SBA",
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
				{ taskId: "t5_3", label: "SBA Authorization" },
				{ taskId: "t5_4", label: "Day 121 Ready" },
				{ taskId: "t5_7", label: "Closing Day" },
			],
		},
	],

	gates: [
		{ gateIndex: 0, label: "Gate 1: FMV", dayTarget: 45 },
		{ gateIndex: 1, label: "Gate 2: SBA", dayTarget: 60 },
		{ gateIndex: 2, label: "Gate 3: QofE", dayTarget: 75 },
		{ gateIndex: 3, label: "Gate 4: COOP", dayTarget: 90 },
	],
} as const;

// ─── Helpers ────────────────────────────────────────────────────

/** Normalize phase key from DB (close-prep) to config key (closeprep) */
export function normalizePhaseKey(dbPhase: string): string {
	return dbPhase === "close-prep" ? "closeprep" : dbPhase;
}

/** Client-facing gate status label */
export function gateStatusLabel(
	status: "cleared" | "pending" | "blocked",
): string {
	switch (status) {
		case "cleared":
			return "Cleared";
		case "pending":
			return "In Progress";
		case "blocked":
			return "Needs Attention";
	}
}

/** Gate dot color hex */
export function gateDotColor(
	status: "cleared" | "pending" | "blocked",
): string {
	switch (status) {
		case "cleared":
			return "#22c55e";
		case "pending":
			return "#f59e0b";
		case "blocked":
			return "#ef4444";
	}
}
