export { default, LenderQATrackerForm } from "./LenderQATrackerForm";

// Types
export type {
  LenderQAInputs,
  DealHeader,
  QAItem,
  QAStatus,
  QAPriority,
  QACategory,
  QASource,
  QAFilter,
  LoanType,
  DealStage,
  ValidationError,
  MetricsData,
  CategoryProgress,
} from "./types";

// Constants
export {
  CATEGORIES,
  LOAN_TYPE_OPTIONS,
  DEAL_STAGE_OPTIONS,
  QA_STATUS_OPTIONS,
  QA_PRIORITY_OPTIONS,
  QA_SOURCE_OPTIONS,
  FILTER_OPTIONS,
  SBA_LOAN_LIMITS,
  DEFAULT_DEAL_HEADER,
  DEFAULT_QA_ITEM,
  DEFAULT_INPUTS,
  STEPS,
  ESOP_TEMPLATE_ITEMS,
} from "./constants";

// Hooks
export { useLenderQAForm } from "./hooks/useLenderQAForm";

// Utils
export {
  validateEmail,
  validateDealId,
  validatePositiveNumber,
  validatePhone,
  formatPhone,
  validateDates,
  checkLoanLimit,
  validateDealHeader,
  validateQAItem,
  isOverdue,
  isNearDue,
} from "./lib/validation";

export {
  calculateMetrics,
  calculateCategoryProgress,
  generateItemId,
  formatDate,
  formatCurrency,
  getLoanTypeLabel,
  filterItems,
  groupItemsByCategory,
} from "./lib/calculations";
