/**
 * CRM — shared data layer
 *
 * Types, constants, and utilities for the CRM feature.
 * Hooks stay in apps (Convex-dependent).
 */

// Types
export type {
  PipelineStage,
  NdaStatus,
  ActivityType,
  CrmView,
  TaskPriority,
  TaskStatus,
  SortDirection,
  SortField,
  SortConfig,
  DueFilter,
  StageStyle,
  Company,
  Contact,
  Activity,
  Task,
  CompanyFilters,
  PipelineStats,
  CompanyFormData,
  ContactFormData,
  ActivityFormData,
  TaskFormData,
} from "./types";

export {
  PIPELINE_STAGES,
  NDA_STATUS,
  ACTIVITY_TYPES,
  CRM_VIEWS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  STAGE_STYLES,
} from "./types";

// Constants
export {
  DEFAULT_COMPANY_VALUES,
  DEFAULT_ACTIVITY_VALUES,
  DEFAULT_TASK_VALUES,
  STAGE_OPTIONS,
  NDA_OPTIONS,
  ACTIVITY_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  FILTER_LABELS,
  DEFAULT_PAGE_SIZE,
  DAYS_OF_WEEK,
  MONTHS,
  COMMON_INDUSTRIES,
  COMMON_ADVISORS,
} from "./constants";

// Formatters
export {
  formatDate,
  getRelativeDate,
  daysUntil,
  getTodayString,
  getDateOffset,
  getStageStyle,
  getNdaBadgeClass,
  getDueDateStatus,
  truncateText,
  highlightText,
  formatNumber,
  formatPercent,
} from "./lib/formatters";

// Calculations
export {
  calculateStats,
  calculateConversionMetrics,
  calculateAvgDaysInStage,
  calculateActivityMetrics,
  calculatePriorityScore,
  sortByPriority,
} from "./lib/calculations";

// Filters
export {
  filterCompanies,
  sortCompanies,
  groupByStage,
  groupByDueDate,
} from "./lib/filters";
