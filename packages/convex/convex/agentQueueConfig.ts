/**
 * Agent Queue Configuration
 *
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

export interface StageAgentMapping {
	agentId: string;
	templateId: string;
	gate: number;
}

export const STAGE_AGENT_MAP: Record<string, StageAgentMapping | null> = {
	"First contact": null,
	"Intro call": null,
	"NDA sent": null,
	Feasibility: { agentId: "deal-analyst", templateId: "T-04", gate: 1 },
	"Term sheet": { agentId: "capital-structurer", templateId: "T-08", gate: 2 },
	"LOI signed": { agentId: "document-producer", templateId: "T-13", gate: 3 },
	Closed: { agentId: "steward-monitor", templateId: "T-21", gate: 4 },
	"On hold": null,
	Dead: null,
};
