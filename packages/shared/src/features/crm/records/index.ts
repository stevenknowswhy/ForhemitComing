// CRM records module (OD-13) — Twenty-vocabulary records for /admin/crm.
// Nested under features/crm because the stewardship CRM owns the top-level
// files; import via `@forhemit/shared/features/crm/records`.

export * from "./types";
export { STAGE_ORDER, STAGE_META, STAGE_OPTIONS } from "./constants";
export type { StageMeta } from "./constants";
export {
  filterRecords,
  groupByStage,
  recordMatchesSearch,
  sortRecords,
  nextStage,
  calculateMetrics,
} from "./lib/calculations";
export type { CrmMetrics } from "./lib/calculations";
export {
  displayName,
  formatAmount,
  formatCrmDate,
  fullName,
  personInitials,
  sourceLabel,
} from "./lib/formatters";
export {
  companyToRow,
  noteToRow,
  opportunityToRow,
  personToRow,
  rowToCompany,
  rowToNote,
  rowToOpportunity,
  rowToPerson,
} from "./lib/serialization";
export {
  isTwentyImportPayload,
  isTwentySource,
  mapTwentyImport,
} from "./lib/twenty-import";
export type { TwentyImportResult } from "./lib/twenty-import";
export { useCrm } from "./hooks/useCrm";
export type { CrmToast, UseCrmReturn } from "./hooks/useCrm";
