export type PrimaryRole =
  | "forhemit"
  | "broker"
  | "owner"
  | "lender"
  | "trustee"
  | "legal"
  | "cpa";

export type SecondaryRole =
  | "appraiser"
  | "tpa"
  | "tr-counsel"
  | "sec-lender"
  | "sec-counsel"
  | "closing-agent";

export type CalendarRole = PrimaryRole | SecondaryRole;

/** Single-select filter: all roles vs one party (within the active tier). */
export type RoleFilter = "all" | CalendarRole;

/** Controls which party row is shown: primary deal parties vs secondary / support parties. */
export type PartyTier = "primary" | "secondary";

export type CalendarEvent = {
  day: number;
  dur: number;
  role: CalendarRole;
  type: string;
  title: string;
  short: string;
  desc: string;
  /** Hard gate / milestone: always visible on the calendar for every party filter. */
  gate?: boolean;
  /** Secondary parties involved (shown as dots on cells and tags in detail). */
  tags?: SecondaryRole[];
  /** When true, only shown if “Two-lender deal” is enabled. */
  twoLender?: boolean;
};

export type CalendarPhase = {
  id: number;
  name: string;
  start: number;
  end: number;
  color: string;
  label: string;
};

export type GateInfo = {
  name: string;
  desc: string;
};

export type RoleMeta = {
  label: string;
  color: string;
  bg: string;
  bd: string;
};

export type EsopTransactionCalendarProps = {
  /** Page-local class for spacing / width */
  className?: string;
  /**
   * embedded: bounded height for section cards (default).
   * standalone: taller scroll area for full-page or modal use.
   */
  variant?: "embedded" | "standalone";
  /** Override default Day 1 (local midnight). If omitted, defaults to tomorrow after mount. */
  defaultStartDate?: Date;
  /** Show logo + subtitle in the navy header bar */
  showBrandHeader?: boolean;
  /** Optional id for aria-labelledby from a page heading */
  ariaLabelledBy?: string;
};
