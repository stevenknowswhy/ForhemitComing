// ── DEAL INTAKE FORM TYPES ───────────────────────────────────────────────────

export interface BusinessInfo {
  name: string;
  state: string;
  type: string;
  employeeCount: number;
}

export interface FinancialInputs {
  purchasePrice: number;
  ebitda: number;
  closingCosts: number;
}

export interface CapitalStack {
  sbaAmount: number;
  sellerNote: number;
  standbyMode: "full" | "active";
}

export interface DSCRInputs {
  scenario: "A" | "B";
  ebitdaB: number;
  loanTerm: number;
  interestRate: number;
  // NEW: User-editable ESOP loan assumptions (were hardcoded)
  esopRate: number;
  esopTerm: number;
  // NEW: User-editable tax rate for OCF DSCR calculation
  taxRate: number;
}

export interface OpenItem {
  title: string;
  description: string;
  resolved: boolean;
}

export interface DealInputs {
  business: BusinessInfo;
  financial: FinancialInputs;
  capital: CapitalStack;
  dscr: DSCRInputs;
  openItems: OpenItem[];
  lenderNotes: string;
}

export interface CalculatedValues {
  totalProjectCost: number;
  esopLoan: number;
  impliedMultiple: number;
  sbaPct: number;
  sellerPct: number;
  esopPct: number;
  // NEW: Dynamic guaranty fee calculation
  guarantyFee: number;
}

export interface DSCRResult {
  sbaDS: number;
  esopDS: number;
  snDS: number;
  totalDS: number;
  // NEW: OCF calculation uses tax rate (removed arbitrary D&A proxy)
  ocf: number;
  // FIXED: Primary DSCR is EBITDA / totalDS (SBA standard)
  dscrEbitda: number;
  // FIXED: OCF DSCR is supplemental, clearly labeled
  dscrOcf: number;
  // Include assumption values for display
  esopRate: number;
  esopTerm: number;
  taxRate: number;
  sbaRate: number;
}

export interface CreditMemoData {
  inputs: DealInputs;
  calculated: CalculatedValues;
  dscr: DSCRResult;
  activeEbitda: number;
  resolvedCount: number;
  unresolvedItems: string[];
}
