// CRM records constants (OD-13) — pipeline stages shared with the ESOP idiom.

import type { OpportunityStage } from "./types";
import { OPPORTUNITY_STAGES } from "./types";

/** Canonical pipeline order; groupByStage and stage sorting follow it. */
export const STAGE_ORDER: readonly OpportunityStage[] = OPPORTUNITY_STAGES;

export interface StageMeta {
  label: string;
  description: string;
}

export const STAGE_META: Record<OpportunityStage, StageMeta> = {
  prospect: {
    label: "Prospect",
    description: "Identified but not yet contacted",
  },
  introduced: {
    label: "Introduced",
    description: "First contact made",
  },
  active: {
    label: "Active",
    description: "In an active working relationship",
  },
  preferred: {
    label: "Preferred",
    description: "Go-to partner or customer",
  },
  dormant: {
    label: "Dormant",
    description: "No recent activity; candidate for a nudge",
  },
};

export const STAGE_OPTIONS: readonly OpportunityStage[] = OPPORTUNITY_STAGES;
