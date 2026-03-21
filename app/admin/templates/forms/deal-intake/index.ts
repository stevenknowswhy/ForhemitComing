// Public API for Deal Intake module

// Main component (default export for registry compatibility)
export { DealIntakeForm } from "./DealIntakeForm";
export { DealIntakeForm as default } from "./DealIntakeForm";

// Types
export type {
  DealInputs,
  BusinessInfo,
  FinancialInputs,
  CapitalStack,
  DSCRInputs,
  OpenItem,
  CalculatedValues,
  DSCRResult,
  CreditMemoData,
} from "./types";

// Constants
export {
  DEFAULT_INPUTS,
  OPEN_ITEM_DEFINITIONS,
  STATE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  SBA_MAX_LOAN,
  TARGET_DSCR,
  COLORS,
  STEPS,
} from "./constants";

// Calculations
export {
  calculateValues,
  calculateDSCR,
  calculateStressedDSCR,
  pmt,
  calcGuarantyFee,
} from "./lib/calculations";

export { fmt, fmtPct, fmtX, fmtK } from "./lib/formatters";
export { generateCreditMemo } from "./lib/creditMemo";
export {
  generateStructuredCreditMemo,
  type StructuredCreditMemo,
  type CreditMemoSection,
  type CreditMemoRow,
} from "./lib/creditMemoData";

// Hooks
export { useDealCalculations } from "./hooks/useDealCalculations";

// Components (for advanced usage)
export {
  TextInput,
  NumberInput,
  SelectInput,
  ToggleButton,
  StepIndicator,
} from "./components/inputs";

export {
  DealBasicsStep,
  CapitalStackStep,
  DSCRScenarioStep,
  OpenItemsStep,
  CreditMemoOutput,
} from "./components/sections";
