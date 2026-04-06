/**
 * ESOP Repayment & Amortization Model
 * Financial modeling form for SBA loan and seller note analysis
 */

// Main component
export { default, RepaymentModelForm } from "./RepaymentModelForm";

// Types
export type {
  RepaymentModelInputs,
  DealHeader,
  AdvisorTeam,
  SellingShareholder,
  SBALoan,
  SellerNote,
  FinancialProjections,
  AmortizationRow,
  ScenarioResult,
  WaterfallData,
  ModelMetrics,
  ViewTab,
  ScenarioTab,
  ValidationError,
  AmortizationType,
  SubordinationType,
  StandstillPeriod,
  ProjectionMethod,
} from "./types";

// Constants
export {
  STEPS,
  DEFAULT_INPUTS,
  DEFAULT_DEAL_HEADER,
  DEFAULT_ADVISOR_TEAM,
  DEFAULT_SELLING_SHAREHOLDER,
  DEFAULT_SBA_LOAN,
  DEFAULT_SELLER_NOTE,
  DEFAULT_PROJECTIONS,
  FISCAL_YEAR_OPTIONS,
  SBA_TERM_OPTIONS,
  AMORTIZATION_OPTIONS,
  SN_TERM_OPTIONS,
  SUBORDINATION_OPTIONS,
  STANDSTILL_OPTIONS,
  SECTION_1042_OPTIONS,
  POST_CLOSE_ROLE_OPTIONS,
  PROJECTION_METHOD_OPTIONS,
  SCENARIOS,
  DSCR_COLORS,
  CHART_COLORS,
  SBA_LOAN_LIMIT,
  MIN_DSCR_COVENANT,
  TARGET_DSCR,
} from "./constants";

// Hooks
export { useRepaymentModel } from "./hooks/useRepaymentModel";

// Library functions
export {
  pmt,
  calculateSBAPayment,
  buildAmortizationSchedule,
  buildScenarios,
  calculateWaterfall,
  calculateMetrics,
  getDscrColor,
  getDscrPill,
  getDscrStatus,
  validateStep1,
  validateStep2,
  fmt,
  fmtK,
  fmtX,
  fmtPct,
  formatDate,
  today,
  fmtNumber,
  fmtYear,
  formatPhone,
} from "./lib";
