import { PipelineStage, STAGE_STYLES } from "../types";

// ============================================
// Date Formatters
// ============================================

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get relative date description (Today, Tomorrow, Yesterday, etc.)
 */
export function getRelativeDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";

  const days = daysUntil(dateStr);
  if (days === null) return "—";

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `In ${days} days`;
}

/**
 * Calculate days until a date
 */
export function daysUntil(dateStr: string | undefined | null): number | null {
  if (!dateStr) return null;

  const target = new Date(dateStr);
  const now = new Date();

  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get date N days from today as ISO string
 */
export function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// ============================================
// Stage Helpers
// ============================================

/**
 * Get style configuration for a pipeline stage
 */
export function getStageStyle(stage: PipelineStage | string) {
  return STAGE_STYLES[stage as PipelineStage] || {
    name: stage,
    color: "#94a3b8",
    bg: "#1e293b",
    borderColor: "#94a3b840",
  };
}

// ============================================
// NDA Status Helpers
// ============================================

/**
 * Get CSS class for NDA status badge
 */
export function getNdaBadgeClass(ndaStatus: string): string {
  switch (ndaStatus) {
    case "Signed":
      return "crm-nda-signed";
    case "Pending":
      return "crm-nda-pending";
    default:
      return "crm-nda-none";
  }
}

// ============================================
// Due Date Helpers
// ============================================

/**
 * Get CSS class and label for due date status
 */
export function getDueDateStatus(
  dateStr: string | undefined | null
): { className: string; label: string } | null {
  if (!dateStr) return null;

  const days = daysUntil(dateStr);
  if (days === null) return null;

  if (days < 0) {
    return {
      className: "crm-tag-overdue",
      label: `${Math.abs(days)}d overdue`,
    };
  }
  if (days === 0) {
    return {
      className: "crm-tag-today",
      label: "Due today",
    };
  }
  if (days <= 7) {
    return {
      className: "crm-tag-soon",
      label: `Due in ${days}d`,
    };
  }
  return null;
}

// ============================================
// Text Formatters
// ============================================

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "…";
}

/**
 * Highlight search terms in text
 */
export function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery || !text) return text;
  const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");
  return text.replace(regex, '<span class="crm-highlight">$1</span>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================
// Number Formatters
// ============================================

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals = 0): string {
  return `${num.toFixed(decimals)}%`;
}
