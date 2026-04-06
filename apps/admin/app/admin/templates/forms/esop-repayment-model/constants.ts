/**
 * ESOP Repayment & Amortization Model - Constants and Default Values
 */

import {
  DealHeader,
  AdvisorTeam,
  SellingShareholder,
  SBALoan,
  SellerNote,
  FinancialProjections,
  RepaymentModelInputs,
  AmortizationType,
  SubordinationType,
  StandstillPeriod,
  ProjectionMethod,
} from "./types";

// ── Step Configuration ─────────────────────────────────────────────────────

export const STEPS = [
  { id: 1, label: "Deal Header", num: "1" },
  { id: 2, label: "Debt Structure & Projections", num: "2" },
  { id: 3, label: "Model Output & Print", num: "3" },
];

// ── Default Values ─────────────────────────────────────────────────────────

export const DEFAULT_DEAL_HEADER: DealHeader = {
  company: "",
  dealId: "",
  industry: "",
  fiscalYearEnd: "12/31",
  closeDate: "",
  transactionValue: 0,
  esopOwnershipPct: 100,
  employeeCount: 0,
};

export const DEFAULT_ADVISOR_TEAM: AdvisorTeam = {
  leadAdvisor: "",
  esopAttorney: "",
  trustee: "",
  sbaLender: "",
  appraiser: "",
  tpa: "",
};

export const DEFAULT_SELLING_SHAREHOLDER: SellingShareholder = {
  sellerNames: "",
  section1042Election: "tbd",
  postCloseRole: "employee",
  sellerNotes: "",
  openItems: "",
};

export const DEFAULT_SBA_LOAN: SBALoan = {
  amount: 6000000,
  rate: 7.5,
  term: 25,
  amortizationType: "full",
  prepaymentPenalty: true,
  collateral: "All business assets, 1st lien",
};

export const DEFAULT_SELLER_NOTE: SellerNote = {
  amount: 2000000,
  rate: 5.0,
  term: 5,
  subordination: "yes",
  standstillPeriod: "5",
  security: "Subordinate lien on assets",
};

export const DEFAULT_PROJECTIONS: FinancialProjections = {
  year1Ebitda: 1800000,
  ebitdaGrowthRate: 3.0,
  historicalEbitda: 0,
  capexPct: 5,
  taxPct: 8,
  workingCapitalReserve: 0,
  depreciationAmortization: 120000,
  addbacks: 0,
  projectionMethod: "mgmt",
};

export const DEFAULT_INPUTS: RepaymentModelInputs = {
  header: { ...DEFAULT_DEAL_HEADER },
  advisors: { ...DEFAULT_ADVISOR_TEAM },
  seller: { ...DEFAULT_SELLING_SHAREHOLDER },
  sbaLoan: { ...DEFAULT_SBA_LOAN },
  sellerNote: { ...DEFAULT_SELLER_NOTE },
  projections: { ...DEFAULT_PROJECTIONS },
};

// ── Select Options ─────────────────────────────────────────────────────────

export const FISCAL_YEAR_OPTIONS = [
  { value: "12/31", label: "December 31" },
  { value: "3/31", label: "March 31" },
  { value: "6/30", label: "June 30" },
  { value: "9/30", label: "September 30" },
];

export const SBA_TERM_OPTIONS = [
  { value: 10, label: "10 years" },
  { value: 15, label: "15 years" },
  { value: 25, label: "25 years (SBA ESOP standard)" },
];

export const AMORTIZATION_OPTIONS: { value: AmortizationType; label: string }[] = [
  { value: "full", label: "Fully amortizing" },
  { value: "io1", label: "Interest only — year 1" },
  { value: "io2", label: "Interest only — years 1–2" },
];

export const SN_TERM_OPTIONS = [
  { value: 5, label: "5 years" },
  { value: 7, label: "7 years" },
  { value: 10, label: "10 years" },
  { value: 12, label: "12 years" },
];

export const SUBORDINATION_OPTIONS: { value: SubordinationType; label: string }[] = [
  { value: "yes", label: "Full standstill (SBA required)" },
  { value: "partial", label: "Interest-only payments permitted" },
  { value: "no", label: "Not subordinated" },
];

export const STANDSTILL_OPTIONS: { value: StandstillPeriod; label: string }[] = [
  { value: "2", label: "2 years" },
  { value: "5", label: "Full term (typical)" },
  { value: "custom", label: "Custom" },
];

export const SECTION_1042_OPTIONS = [
  { value: "yes", label: "Yes — QRP reinvestment" },
  { value: "no", label: "No" },
  { value: "tbd", label: "TBD" },
];

export const POST_CLOSE_ROLE_OPTIONS = [
  { value: "employee", label: "Remains as employee" },
  { value: "consultant", label: "Transitions to consultant" },
  { value: "departing", label: "Departing at close" },
];

export const PROJECTION_METHOD_OPTIONS: { value: ProjectionMethod; label: string }[] = [
  { value: "mgmt", label: "Management projections" },
  { value: "advisor", label: "Advisor model" },
  { value: "historical", label: "Historical growth extrapolation" },
  { value: "conservative", label: "Conservative case only" },
];

// ── Financial Constants ────────────────────────────────────────────────────

export const SBA_LOAN_LIMIT = 5000000;
export const MIN_DSCR_COVENANT = 1.25;
export const TARGET_DSCR = 1.5;

// ── Scenario Configurations ────────────────────────────────────────────────

export const SCENARIOS = [
  { key: "base", label: "Base case", multiplier: 1.0, color: "#1B4F8A" },
  { key: "stress", label: "Stress −15%", multiplier: 0.85, color: "#9E2B2B" },
  { key: "upside", label: "Upside +15%", multiplier: 1.15, color: "#0D6E5A" },
  { key: "stress2", label: "Deep stress −25%", multiplier: 0.75, color: "#B85C00" },
] as const;

// ── DSCR Threshold Colors ──────────────────────────────────────────────────

export const DSCR_COLORS = {
  pass: "#0D6E5A",   // teal - ≥ 1.50x
  warn: "#B85C00",   // amber - 1.25x to 1.49x
  fail: "#9E2B2B",   // red - < 1.25x
  neutral: "#8AA0B8", // hint - N/A
};

export const DSCR_BG_COLORS = {
  pass: "#E2F4EF",
  warn: "#FEF0DC",
  fail: "#FCEAEA",
  neutral: "transparent",
};

// ── Chart Colors ───────────────────────────────────────────────────────────

export const CHART_COLORS = {
  sbaBalance: "#B5D4F4",
  sbaBorder: "#1B4F8A",
  sellerNote: "#FAC775",
  sellerNoteBorder: "#9A6E00",
  fcf: "#0D6E5A",
  minDscrLine: "rgba(184, 92, 0, 0.5)",
};
