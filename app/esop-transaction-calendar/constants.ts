import type { CalendarPhase, PrimaryRole, SecondaryRole } from "./types";

export const TOTAL_DAYS = 120;

export const MAX_VISIBLE_EVENTS = 3;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Primary deal parties — shown in “Primary” filter row. */
export const PRIMARY_ROLES: readonly PrimaryRole[] = [
  "forhemit",
  "broker",
  "owner",
  "lender",
  "trustee",
  "legal",
  "cpa",
] as const;

/** Secondary / support parties — shown in “Secondary” filter row. */
export const SECONDARY_ROLES: readonly SecondaryRole[] = [
  "appraiser",
  "tpa",
  "tr-counsel",
  "sec-lender",
  "sec-counsel",
  "closing-agent",
] as const;

/** Shown only when two-lender mode is on (chips + events). */
export const TWO_LENDER_SECONDARY_ROLES: readonly SecondaryRole[] = ["sec-lender", "sec-counsel"] as const;

/** @deprecated Use PRIMARY_ROLES — kept for any external imports */
export const ROLES = PRIMARY_ROLES;

export const PHASES: CalendarPhase[] = [
  { id: 1, name: "Ignition", start: 1, end: 14, color: "#B8965A", label: "01 Ignition" },
  { id: 2, name: "Build", start: 15, end: 45, color: "#6A9E6A", label: "02 Build" },
  { id: 3, name: "Validate", start: 46, end: 75, color: "#5A7EA0", label: "03 Validate" },
  { id: 4, name: "Close Prep", start: 76, end: 105, color: "#9A6A8A", label: "04 Close Prep" },
  { id: 5, name: "Closing", start: 106, end: 120, color: "#5A8A8A", label: "05 Closing" },
];
