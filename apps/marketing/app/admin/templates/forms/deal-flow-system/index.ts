// ── ESOP DEAL FLOW SYSTEM FORM ───────────────────────────────────────────────
//
// A three-stage form for ESOP deal intake, feasibility study, and due diligence.
//
// Stages:
//   1. First Contact (Intake & Qualification)
//   2. Feasibility Study (Analysis & Scoring)  
//   3. Due Diligence (Document Review)
//
// Architecture:
//   - Types in types.ts
//   - Constants/defaults in constants.ts
//   - Form state logic in hooks/useDealFlowForm.ts
//   - Calculations in lib/calculations.ts
//   - Input components in components/inputs/
//   - Section components in components/sections/
//   - Main component: DealFlowSystemForm.tsx
//
// ──────────────────────────────────────────────────────────────────────────────

// Main component (default export for registry compatibility)
export { DealFlowSystemForm } from "./DealFlowSystemForm";
export { DealFlowSystemForm as default } from "./DealFlowSystemForm";

// Types
export type {
  DealFlowInputs,
  DealFlowMeta,
  DealFlowStage,
  Stage1Data,
  Stage2Data,
  Stage3Data,
  SourceReferral,
  BusinessIdentity,
  KeyContacts,
  QuickQualifiers,
  Motivation,
  RedFlags,
  NextSteps,
  OwnerObjectives,
  PreliminaryValuation,
  EmployeePopulation,
  ESOPStructure,
  FeasibilityRedFlags,
  FeasibilityScores,
  GoNoGo,
  DDDocument,
  LegalCorporateDocs,
  HRPlanDocuments,
  FinancialStatements,
  TaxMatters,
  Liabilities,
  Governance,
  Rollover1042,
  GapItem,
  ValidationErrors,
} from "./types";

// Constants
export {
  STAGES,
  DEFAULT_INPUTS,
  DEAL_SOURCE_OPTIONS,
  ENGAGEMENT_LETTER_OPTIONS,
  FOUND_US_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  HEADCOUNT_OPTIONS,
  REVENUE_OPTIONS,
  TIMELINE_OPTIONS,
  DEAL_STATUS_OPTIONS,
  TIMEZONE_OPTIONS,
  YES_NO_OPTIONS,
  YES_NO_TBD_OPTIONS,
  CONTROL_OPTIONS,
  FINANCIAL_QUALITY_OPTIONS,
  SYNTHETIC_EQUITY_OPTIONS,
  TRUSTEE_TYPE_OPTIONS,
  KEY_PERSON_INS_OPTIONS,
  DD_STATUS_OPTIONS,
  GAP_STATUS_OPTIONS,
  PRIMARY_MOTIVATIONS,
  ESOP_KNOWLEDGE_OPTIONS,
  STAGE1_RED_FLAGS,
  OWNERSHIP_OPTIONS,
  OWNER_OBJECTIVES,
  FEASIBILITY_RED_FLAGS,
  SCORING_CRITERIA,
  DD_SECTIONS,
  LIABILITY_TYPES,
  SCORE_MAX,
  SCORE_MIN,
  TOTAL_MAX_SCORE,
  SCORE_THRESHOLDS,
  COLORS,
} from "./constants";

// Calculations
export {
  calculateTotalScore,
  calculateScorePercentage,
  getScoreRecommendation,
  getRecommendationLabel,
  getScoreColor,
  calculateStageProgress,
  isValidScore,
  clampScore,
  formatScore,
  getScoreBarGradient,
} from "./lib/calculations";

// Hooks
export { useDealFlowForm } from "./hooks/useDealFlowForm";

// Components (for advanced usage)
export {
  TextInput,
  NumberInput,
  SelectInput,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  StageIndicator,
} from "./components/inputs";

export {
  // Stage 1
  SourceReferralSection,
  BusinessIdentitySection,
  KeyContactsSection,
  QuickQualifiersSection,
  MotivationSection,
  NextStepsSection,
  // Stage 2
  OwnerObjectivesSection,
  ValuationSection,
  EmployeePopulationSection,
  ESOPStructureSection,
  FeasibilityFlagsSection,
  ScoringSection,
  GoNoGoSection,
  // Stage 3
  LegalDocumentsSection,
  HRDocumentsSection,
  FinancialDocumentsSection,
  LiabilitiesSection,
  InsuranceGovernanceSection,
  Rollover1042Section,
  GapItemsSection,
  // Output
  DealFlowOutput,
} from "./components/sections";
