/**
 * ESOP Repayment & Amortization Model - Type Definitions
 * Financial modeling form for SBA loan and seller note analysis
 */

// ── Deal Header Types ──────────────────────────────────────────────────────

export interface DealHeader {
  company: string;
  dealId: string;
  industry: string;
  fiscalYearEnd: string;
  closeDate: string;
  transactionValue: number;
  esopOwnershipPct: number;
  employeeCount: number;
}

export interface AdvisorTeam {
  leadAdvisor: string;
  esopAttorney: string;
  trustee: string;
  sbaLender: string;
  appraiser: string;
  tpa: string;
}

export interface SellingShareholder {
  sellerNames: string;
  section1042Election: "yes" | "no" | "tbd";
  postCloseRole: "employee" | "consultant" | "departing";
  sellerNotes: string;
  openItems: string;
}

// ── Debt Structure Types ───────────────────────────────────────────────────

export type AmortizationType = "full" | "io1" | "io2";
export type SubordinationType = "yes" | "partial" | "no";
export type StandstillPeriod = "2" | "5" | "custom";
export type ProjectionMethod = "mgmt" | "advisor" | "historical" | "conservative";

export interface SBALoan {
  amount: number;
  rate: number;
  term: number;
  amortizationType: AmortizationType;
  prepaymentPenalty: boolean;
  collateral: string;
}

export interface SellerNote {
  amount: number;
  rate: number;
  term: number;
  subordination: SubordinationType;
  standstillPeriod: StandstillPeriod;
  security: string;
}

// ── Financial Projections Types ────────────────────────────────────────────

export interface FinancialProjections {
  year1Ebitda: number;
  ebitdaGrowthRate: number;
  historicalEbitda: number;
  capexPct: number;
  taxPct: number;
  workingCapitalReserve: number;
  depreciationAmortization: number;
  addbacks: number;
  projectionMethod: ProjectionMethod;
}

// ── Main Input Type ────────────────────────────────────────────────────────

export interface RepaymentModelInputs {
  header: DealHeader;
  advisors: AdvisorTeam;
  seller: SellingShareholder;
  sbaLoan: SBALoan;
  sellerNote: SellerNote;
  projections: FinancialProjections;
}

// ── Calculation Result Types ───────────────────────────────────────────────

export interface AmortizationRow {
  year: number;
  ebitda: number;
  capex: number;
  taxes: number;
  fcf: number;
  sbaInterest: number;
  sbaPrincipal: number;
  sbaBalance: number;
  snInterest: number;
  snPrincipal: number;
  snBalance: number;
  totalDebtService: number;
  dscr: number | null;
}

export interface ScenarioResult {
  name: string;
  multiplier: number;
  rows: AmortizationRow[];
  year1Dscr: number | null;
  minDscr: number | null;
  yearsBelowMin: number;
}

export interface WaterfallData {
  ebitda: number;
  capex: number;
  taxes: number;
  wcReserve: number;
  fcf: number;
  sbaDebtService: number;
  snDebtService: number;
  netCash: number;
}

export interface ModelMetrics {
  totalDebt: number;
  year1Dscr: number | null;
  minDscr: number | null;
  totalInterestCost: number;
  debtToEbitda: number | null;
  sbaMonthlyPayment: number;
  sbaAnnualPayment: number;
}

// ── View State Types ───────────────────────────────────────────────────────

export type ViewTab = "amort" | "dscr" | "chart" | "scen";
export type ScenarioTab = "base" | "stress" | "upside" | "stress2";

export interface ValidationError {
  field: string;
  message: string;
}
