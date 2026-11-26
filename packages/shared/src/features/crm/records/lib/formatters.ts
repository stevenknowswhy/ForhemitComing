// CRM records formatters (OD-13) — pure display helpers, no side effects.

import type { Company, CrmRecord, Opportunity, Person } from "../types";

export function fullName(person: Person | null | undefined): string {
  if (!person?.firstName) return "Unknown";
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

export function personInitials(person: Person | null | undefined): string {
  if (!person?.firstName) return "??";
  const first = person.firstName[0] ?? "?";
  const last = person.lastName?.[0] ?? "";
  return (first + last).toUpperCase();
}

/** A human-readable label for any record; used in tables, kanban cards, toasts. */
export function displayName(record: CrmRecord): string {
  switch (record.kind) {
    case "person":
      return fullName(record);
    case "company":
    case "opportunity":
      return record.name || "Untitled";
  }
}

/** Dollar amount for pipeline display; null/undefined renders as an em dash. */
export function formatAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Short date (MM/DD/YYYY) from an ISO timestamp or date string. */
export function formatCrmDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return "—";
  return `${month}/${day}/${year}`;
}

/** Label for a record's origin, shown as a badge on imported rows. */
export function sourceLabel(record: Company | Opportunity | Person): string {
  return record.source === "twenty" ? "Twenty" : "Manual";
}
