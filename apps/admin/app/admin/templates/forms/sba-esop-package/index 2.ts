// ── SBA ESOP LENDER PACKAGE FORM ─────────────────────────────────────────────
//
// A seven-step form for generating SBA ESOP lender package executive summaries.
//
// Steps:
//   1. Lender & Transaction
//   2. Financial Snapshot
//   3. Management Team
//   4. Advisory Team
//   5. Forhemit Team
//   6. SBA Compliance Checklist
//   7. Review & Generate
//
// Architecture:
//   - Types in types.ts
//   - Constants/defaults in constants.ts
//   - Form state logic in hooks/usePackageForm.ts
//   - Input components in components/inputs/
//   - Section components in components/sections/
//   - Main component: SBAESOPPackageForm.tsx
//
// ──────────────────────────────────────────────────────────────────────────────

export { SBAESOPPackageForm as default } from "./SBAESOPPackageForm";
export { SBAESOPPackageForm } from "./SBAESOPPackageForm";

// Re-export types for consumers
export type {
  PackageInputs,
  LenderInfo,
  FinancialSnapshot,
  ManagementTeam,
  AdvisoryTeam,
  ForhemitTeam,
  ComplianceChecklist,
  PackageStep,
  ValidationErrors,
} from "./types";
