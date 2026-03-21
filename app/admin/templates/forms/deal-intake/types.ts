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
}

export interface DSCRResult {
  sbaDS: number;
  esopDS: number;
  snDS: number;
  totalDS: number;
  ocf: number;
  dscrEbitda: number;
  dscrOcf: number;
}

export interface CreditMemoData {
  inputs: DealInputs;
  calculated: CalculatedValues;
  dscr: DSCRResult;
  activeEbitda: number;
  resolvedCount: number;
  unresolvedItems: string[];
}
