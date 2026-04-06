/**
 * Lender Q&A Tracker - Calculation Utilities
 */
import { QAItem, MetricsData, CategoryProgress, QACategory } from "../types";
import { CATEGORIES } from "../constants";
import { isOverdue } from "./validation";

export function calculateMetrics(items: QAItem[]): MetricsData {
  const total = items.length;
  const resolved = items.filter((i) => i.status === "Resolved" || i.status === "Waived").length;
  const pending = items.filter((i) => i.status === "Pending").length;
  const blocked = items.filter((i) => i.status === "Blocked").length;
  const overdue = items.filter((i) => isOverdue(i)).length;
  const percentage = total ? Math.round((resolved / total) * 100) : 0;

  return {
    total,
    resolved,
    pending,
    blocked,
    overdue,
    percentage,
  };
}

export function calculateCategoryProgress(items: QAItem[]): CategoryProgress[] {
  return CATEGORIES.map((category) => {
    const catItems = items.filter((i) => i.cat === category);
    const total = catItems.length;
    const resolved = catItems.filter((i) => i.status === "Resolved" || i.status === "Waived").length;
    const percentage = total ? Math.round((resolved / total) * 100) : 0;
    const hasOverdue = catItems.some((i) => isOverdue(i));

    return {
      category,
      total,
      resolved,
      percentage,
      hasOverdue,
    };
  });
}

export function generateItemId(dealId: string, items: QAItem[]): string {
  const prefix = dealId.trim() || "LQ";

  // Find next number
  const existingNums = items.map((i) => {
    const match = i.id.match(/-LQ-(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
  return `${prefix}-LQ-${String(nextNum).padStart(3, "0")}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${m}/${d}/${y}`;
}

export function formatCurrency(amount: string): string {
  if (!amount) return "";
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `$${num.toLocaleString()}`;
}

export function getLoanTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    "7a-std": "SBA 7(a) Standard",
    "7a-small": "SBA 7(a) Small",
    "504": "SBA 504",
    conv: "Conventional",
    other: "Other",
  };
  return labels[value] || value;
}

export function filterItems(
  items: QAItem[],
  filter: string
): (QAItem & { _idx: number })[] {
  const today = new Date().toISOString().split("T")[0];

  return items
    .map((item, idx) => ({ ...item, _idx: idx }))
    .filter((item) => {
      if (filter === "all") return true;
      if (filter === "high") return item.pri === "High";
      if (filter === "overdue") {
        return !!item.due && item.due < today && item.status !== "Resolved" && item.status !== "Waived";
      }
      return item.status === filter;
    });
}

export function groupItemsByCategory<T extends QAItem>(items: T[]): Record<QACategory, T[]> {
  const grouped = {} as Record<QACategory, T[]>;

  CATEGORIES.forEach((cat) => {
    grouped[cat] = [];
  });

  items.forEach((item) => {
    if (grouped[item.cat]) {
      grouped[item.cat].push(item);
    }
  });

  return grouped;
}
