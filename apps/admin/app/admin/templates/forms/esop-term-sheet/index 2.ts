// Public API for ESOP Term Sheet module

// Main component (default export for registry compatibility)
export { ESOPTermSheetForm } from "./ESOPTermSheetForm";
export { ESOPTermSheetForm as default } from "./ESOPTermSheetForm";

// Types
export type { UserInputs, Scenario, Scenarios, ThemeColor } from "./types";

// Constants
export { DEFAULT_INPUTS, NAVY, BLUE, AMBER, GREEN, GRAY, RED } from "./constants";

// Calculations
export { calculateScenarios } from "./lib/calculations";
export { fmt, fmtK, pct } from "./lib/formatters";

// Hooks
export { useTermSheetCalculations } from "./hooks/useTermSheetCalculations";

// Components (for advanced usage)
export {
  Callout,
  Section,
  Row,
  DSCRBar,
  StackBar,
  ScenarioToggle,
  OpenItem,
} from "./components/shared";
