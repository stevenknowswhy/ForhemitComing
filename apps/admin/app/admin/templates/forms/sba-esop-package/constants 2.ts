import {
  PackageInputs,
  ManagementPerson,
  ComplianceChecklist,
} from "./types";

// ── DEFAULT INPUTS ───────────────────────────────────────────────────────────

const DEFAULT_MANAGEMENT_PERSON: ManagementPerson = {
  name: "",
  tenure: "",
  role: "",
  status: "",
};

export const DEFAULT_INPUTS: PackageInputs = {
  lender: {
    lenderName: "",
    institution: "",
    companyName: "",
    industry: "",
    yearsInOperation: 0,
    submissionDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    pbcState: "",
  },
  financial: {
    revenue: "",
    ebitda: "",
    dscr: "",
    kpInsurance: "",
  },
  management: {
    members: [
      { ...DEFAULT_MANAGEMENT_PERSON },
      { ...DEFAULT_MANAGEMENT_PERSON },
      { ...DEFAULT_MANAGEMENT_PERSON },
    ],
    notes: "",
  },
  advisory: {
    esopCounsel: "",
    esopAdmin: "",
    sellerCpa: "",
    sellerAttorney: "",
    trustee: "",
    valuationFirm: "",
  },
  forhemit: {
    founderName: "",
    founderYears: "",
    email: "",
    phone: "",
    website: "",
    agreementDate: "",
    extraNotes: "",
  },
  checklist: {
    feeStructureDeliverables: false,
    sbaCounselReview: false,
    sellerGuarantee: false,
    twentyFourMonthStop: false,
    trusteeIndependence: false,
    controlDisclaimer: false,
    feesModeled: false,
    erisaDisclaimer: false,
    sellerNoteStandby: false,
    month20Transition: false,
  },
};

// ── STEP DEFINITIONS ─────────────────────────────────────────────────────────

export const STEPS: { id: string; label: string; num: number }[] = [
  { id: "lender", label: "Lender & transaction", num: 1 },
  { id: "financial", label: "Financial snapshot", num: 2 },
  { id: "management", label: "Management team", num: 3 },
  { id: "advisory", label: "Advisory team", num: 4 },
  { id: "forhemit", label: "Forhemit team", num: 5 },
  { id: "checklist", label: "SBA checklist", num: 6 },
  { id: "review", label: "Review & generate", num: 7 },
];

// ── CHECKLIST ITEMS ──────────────────────────────────────────────────────────

export const CHECKLIST_ITEMS: {
  key: keyof ComplianceChecklist;
  label: string;
}[] = [
  {
    key: "feeStructureDeliverables",
    label:
      "Fee structure references administrative COOP deliverables only — not DSCR, EBITDA, revenue, or any borrower financial metric.",
  },
  {
    key: "sbaCounselReview",
    label:
      "Stewardship Agreement will be reviewed by SBA district counsel with written non-affiliation confirmation under 13 CFR 121.301 before loan application submission.",
  },
  {
    key: "sellerGuarantee",
    label:
      "Seller personal guarantee is executed with 24-month automatic release language: release upon 24 months of satisfactory payment or full repayment of SBA loan.",
  },
  {
    key: "twentyFourMonthStop",
    label:
      "Forhemit engagement terminates automatically at 24 months from closing. No evergreen clause, no extension rights, no contingent continuation.",
  },
  {
    key: "trusteeIndependence",
    label:
      "ESOP Trustee independence is documented: Forhemit played no role in trustee selection, vetting, interviewing, or compensation. Trustee acknowledgment letter is in the closing package.",
  },
  {
    key: "controlDisclaimer",
    label:
      "Forhemit control disclaimer is in the Stewardship Agreement: no board seat, no voting rights, no management hiring/firing authority, no bank account access, no signature authority.",
  },
  {
    key: "feesModeled",
    label:
      "Forhemit fees are modeled as SG&A in the financial projections. DSCR sensitivity analysis is included showing impact of fee expense.",
  },
  {
    key: "erisaDisclaimer",
    label:
      "ERISA non-fiduciary disclaimer is present in the Stewardship Agreement: Forhemit is not a fiduciary under ERISA Section 3(21); all recommendations are advisory only and non-binding.",
  },
  {
    key: "sellerNoteStandby",
    label:
      "Seller Note explicitly states: no payments of principal or interest until SBA loan is paid in full. Full standby for 120 months.",
  },
  {
    key: "month20Transition",
    label:
      "Month-20 Governance Transition Report is a defined contractual deliverable in the Stewardship Agreement, assessing internal capacity for governance continuity at handoff.",
  },
];

// ── STATE OPTIONS ────────────────────────────────────────────────────────────

export const STATE_OPTIONS = [
  "California",
  "Florida",
  "Texas",
  "New York",
  "Washington",
  "Illinois",
  "Massachusetts",
  "Colorado",
  "Other",
];

// ── MANAGEMENT STATUS OPTIONS ────────────────────────────────────────────────

export const MANAGEMENT_STATUS_OPTIONS = [
  { value: "", label: "Status…" },
  { value: "Executed", label: "Executed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Pending", label: "Pending" },
];

// ── COLORS ───────────────────────────────────────────────────────────────────

export const COLORS = {
  navy: "#1C2E4A",
  navyLt: "#2A4268",
  gold: "#A8781E",
  goldLt: "#C49A2E",
  sand: "#F5F1E8",
  slate: "#EEF2F7",
  mid: "#D0D9E8",
  body: "#1E1E1E",
  muted: "#6B7280",
  green: "#1A5C3A",
  greenLt: "#EEF6F1",
  amber: "#7A4F00",
  amberLt: "#FBF5E6",
  red: "#7A1E1E",
  redLt: "#FDF3F3",
  sba: "#1A3A5C",
  sbaLt: "#E8EFF7",
  white: "#FFFFFF",
  bg: "#F4F6F9",
};
