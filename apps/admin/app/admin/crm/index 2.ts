// ============================================
// CRM Feature Barrel Export
// ============================================

// Import styles
import "./styles/crm-theme.css";

// Main Component
export { EngagementTracker } from "./EngagementTracker";
export { EngagementTracker as default } from "./EngagementTracker";

// Types
export type {
  Company,
  Contact,
  Activity,
  Task,
  PipelineStage,
  NdaStatus,
  ActivityType,
  CrmView,
  TaskPriority,
  TaskStatus,
  StageStyle,
  CompanyFilters,
  SortConfig,
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

// Hooks
export {
  useCrmCompanies,
  useCrmCompany,
  useCrmStats,
  useCrmActivities,
  useCrmContacts,
  useCrmTasks,
} from "./hooks";

// Utilities
export {
  // Formatters
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
  // Filters
  filterCompanies,
  sortCompanies,
  groupByStage,
  groupByDueDate,
  // Calculations
  calculateStats,
  calculateConversionMetrics,
  calculateAvgDaysInStage,
  calculateActivityMetrics,
  calculatePriorityScore,
  sortByPriority,
} from "./lib";
