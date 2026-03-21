import { DealInputs, OpenItem } from "./types";

// ── DEFAULT INPUTS ───────────────────────────────────────────────────────────

export const DEFAULT_INPUTS: DealInputs = {
  business: {
    name: "",
    state: "",
    type: "",
    employeeCount: 0,
  },
  financial: {
    purchasePrice: 10_000_000,
    ebitda: 2_000_000,
    closingCosts: 850_000,
  },
  capital: {
    sbaAmount: 5_000_000,
    sellerNote: 2_000_000,
    standbyMode: "full",
  },
  dscr: {
    scenario: "A",
    ebitdaB: 2_500_000,
    loanTerm: 10,
    interestRate: 7.5,
  },
  openItems: [],
  lenderNotes: "",
};

// ── OPEN ITEM DEFINITIONS ────────────────────────────────────────────────────

export const OPEN_ITEM_DEFINITIONS: Omit<OpenItem, "resolved">[] = [
  {
    title: "QofE completed and signed",
    description:
      "Quality of Earnings report from an independent firm, covering at least 3 fiscal years.",
  },
  {
    title: "ESOP leveraged loan lender identified",
    description:
      "Third-party lender for the ESOP leveraged loan tranche has been identified and indicative terms received.",
  },
  {
    title: "Intercreditor agreement drafted",
    description:
      "Written waterfall defining payment priority across SBA senior debt, seller note, and ESOP leveraged loan.",
  },
  {
    title: "ESOP trustee engaged",
    description:
      "Independent trustee retained and conflicts-of-interest review underway per ERISA requirements.",
  },
  {
    title: "COOP plan in place",
    description:
      "Business continuity and operational continuity plan documented — required by Forhemit stewardship standard.",
  },
];

// ── STATE OPTIONS ────────────────────────────────────────────────────────────

export const STATE_OPTIONS = [
  "California",
  "Florida",
  "Texas",
  "New York",
  "Washington",
  "Other",
];

// ── BUSINESS TYPE OPTIONS ────────────────────────────────────────────────────

export const BUSINESS_TYPE_OPTIONS = [
  "Medical practice — cardiology",
  "Medical practice — orthopedics",
  "Medical practice — other",
  "Professional services",
  "Manufacturing",
  "Distribution",
  "Technology / SaaS",
  "Construction / trades",
  "Other",
];

// ── FINANCIAL CONSTANTS ───────────────────────────────────────────────────────

export const SBA_MAX_LOAN = 5_000_000;
export const TARGET_DSCR = 1.25;
export const ESOP_LOAN_PREMIUM = 0.01; // 1% higher rate for ESOP loan
export const ESOP_LOAN_TERM = 7; // years
export const D_AND_A_PCT = 0.08; // 8% of EBITDA
export const TAX_RATE = 0.25; // 25% corporate tax
export const SELLER_NOTE_RATE = 0.06; // 6% for active payment calculation

// ── COLORS ────────────────────────────────────────────────────────────────────

export const COLORS = {
  sba: "#185FA5",
  seller: "#1D9E75",
  esop: "#BA7517",
  good: "#1D9E75",
  warn: "#BA7517",
  danger: "#A32D2D",
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    tertiary: "var(--color-text-tertiary)",
  },
};

// ── STEP DEFINITIONS ───────────────────────────────────────────────────────────

export const STEPS = [
  { id: 0, label: "Deal basics", num: "01" },
  { id: 1, label: "Capital stack", num: "02" },
  { id: 2, label: "DSCR scenario", num: "03" },
  { id: 3, label: "Open items", num: "04" },
];
