// ============================================
// CRM Library Exports
// ============================================

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
} from "./formatters";

export {
  filterCompanies,
  sortCompanies,
  groupByStage,
  groupByDueDate,
} from "./filters";

export {
  calculateStats,
  calculateConversionMetrics,
  calculateAvgDaysInStage,
  calculateActivityMetrics,
  calculatePriorityScore,
  sortByPriority,
} from "./calculations";
