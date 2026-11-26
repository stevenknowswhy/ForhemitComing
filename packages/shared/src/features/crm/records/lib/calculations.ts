// CRM records calculations (OD-13) — pure filter/sort/group/metrics helpers.

import { STAGE_ORDER } from "../constants";
import type {
  CrmData,
  CrmFilterOptions,
  CrmRecord,
  CrmSortConfig,
  Opportunity,
  OpportunityStage,
} from "../types";
import { displayName } from "./formatters";

/** Case-insensitive substring match against a record's searchable text. */
export function recordMatchesSearch(
  record: CrmRecord,
  search: string
): boolean {
  const q = search.toLowerCase().trim();
  if (!q) return true;
  const haystack = [
    displayName(record),
    record.kind === "person" ? record.email : null,
    record.kind === "company" ? record.domain : null,
    record.kind === "company" ? record.industry : null,
    record.kind === "person" ? record.jobTitle : null,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

/** Filter records by free-text search, pipeline stage, and import source. */
export function filterRecords<T extends CrmRecord>(
  records: T[],
  options: CrmFilterOptions = {}
): T[] {
  const { search = "", stage = null, source = null } = options;
  return records.filter((record) => {
    if (source && record.source !== source) return false;
    if (stage) {
      if (record.kind !== "opportunity") return false;
      if (record.stage !== stage) return false;
    }
    return recordMatchesSearch(record, search);
  });
}

function stageIndex(stage: OpportunityStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? STAGE_ORDER.length : idx;
}

function comparableField(record: CrmRecord): string | number {
  switch (record.kind) {
    case "person":
      return displayName(record);
    case "company":
      return record.name;
    case "opportunity":
      return record.name;
  }
}

/** Sort records by name, stage (pipeline order), amount, or createdAt. */
export function sortRecords<T extends CrmRecord>(
  records: T[],
  sort: CrmSortConfig
): T[] {
  if (!sort.field) return [...records];
  const dir = sort.dir === "desc" ? -1 : 1;
  return [...records].sort((a, b) => {
    switch (sort.field) {
      case "name": {
        const aName = comparableField(a);
        const bName = comparableField(b);
        if (typeof aName === "string" && typeof bName === "string") {
          return aName.localeCompare(bName) * dir;
        }
        return 0;
      }
      case "stage": {
        if (a.kind !== "opportunity" || b.kind !== "opportunity") return 0;
        return (stageIndex(a.stage) - stageIndex(b.stage)) * dir;
      }
      case "amount": {
        if (a.kind !== "opportunity" || b.kind !== "opportunity") return 0;
        return ((a.amount ?? 0) - (b.amount ?? 0)) * dir;
      }
      case "createdAt":
        // createdAt is an ISO timestamp string in the domain types.
        return (Date.parse(a.createdAt) - Date.parse(b.createdAt)) * dir;
      default:
        return 0;
    }
  });
}

/**
 * Group opportunities by pipeline stage in STAGE_ORDER order; every stage
 * appears, even when empty, so kanban columns stay stable.
 */
export function groupByStage(
  opportunities: Opportunity[]
): Record<OpportunityStage, Opportunity[]> {
  const grouped = Object.fromEntries(
    STAGE_ORDER.map((stage) => [stage, []])
  ) as unknown as Record<OpportunityStage, Opportunity[]>;
  for (const opportunity of opportunities) {
    grouped[opportunity.stage].push(opportunity);
  }
  return grouped;
}

/** The next stage forward in the pipeline, or null at either boundary. */
export function nextStage(stage: OpportunityStage): OpportunityStage | null {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1] ?? null;
}

export interface CrmMetrics {
  people: number;
  companies: number;
  opportunities: number;
  notes: number;
  /** Records imported from Twenty, per the import seam. */
  fromTwenty: number;
  /** Sum of opportunity amounts that are still open (not dormant). */
  pipelineValue: number;
  byStage: Record<OpportunityStage, number>;
}

export function calculateMetrics(data: CrmData): CrmMetrics {
  const byStage = Object.fromEntries(
    STAGE_ORDER.map((stage) => [stage, 0])
  ) as unknown as Record<OpportunityStage, number>;
  let pipelineValue = 0;
  for (const opportunity of data.opportunities) {
    byStage[opportunity.stage] += 1;
    if (opportunity.stage !== "dormant" && opportunity.amount) {
      pipelineValue += opportunity.amount;
    }
  }
  const all = [
    ...data.people,
    ...data.companies,
    ...data.opportunities,
  ];
  return {
    people: data.people.length,
    companies: data.companies.length,
    opportunities: data.opportunities.length,
    notes: data.notes.length,
    fromTwenty: all.filter((record) => record.source === "twenty").length,
    pipelineValue,
    byStage,
  };
}
