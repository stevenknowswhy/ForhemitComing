// ── FORM INPUTS INTERFACE ────────────────────────────────────────────────────

export interface UserInputs {
  // Step 1: Basic Deal Info
  purchasePrice: number;
  ebitda: number;
  taxRate: number;

  // Step 2: Financing Structure
  sbaLoanAmount: number;
  esopLoanRate: number;
  esopLoanTerm: number;

  // Step 3: Cost Estimates
  forhemitFee: number;
  trusteeFee: number;
  appraisalFee: number;
  counselFee: number;
  sbaFee: number;
  stampTax: number;
  qoeFee: number;
  legalFee: number;
  cpaFee: number;

  // Step 4: Deal Stage
  dealStage: "preloi" | "mid" | "postfmv";
}

// ── SCENARIO INTERFACE ───────────────────────────────────────────────────────

export interface Scenario {
  id: string;
  label: string;
  sub: string;
  ebitda: number;
  multiple: string;
  sba: number;
  esop: number;
  note: number;
  total: number;
  pp: number;
  sellerCash: number;
  sellerCashPct: number;
  sbaDS: number;
  esopDS: number;
  totalDS: number;
  dscr_ebitda: number;
  dscr_ocf: number;
  ocf: number;
  stress10: number;
  stress20: number;
  breakeven: number;
  color: string;
  bg: string;
  border: string;
  textColor: string;
}

export interface Scenarios {
  A: Scenario;
  B: Scenario;
}

// ── THEME INTERFACE ──────────────────────────────────────────────────────────

export interface ThemeColor {
  color: string;
  bg: string;
  border: string;
}
