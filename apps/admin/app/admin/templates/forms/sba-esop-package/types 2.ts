// ── SBA ESOP LENDER PACKAGE FORM TYPES ───────────────────────────────────────

export interface LenderInfo {
  lenderName: string;
  institution: string;
  companyName: string;
  industry: string;
  yearsInOperation: number;
  submissionDate: string;
  pbcState: string;
}

export interface FinancialSnapshot {
  revenue: string;
  ebitda: string;
  dscr: string;
  kpInsurance: string;
}

export interface ManagementPerson {
  name: string;
  tenure: string;
  role: string;
  status: "" | "Executed" | "In Progress" | "Pending";
}

export interface ManagementTeam {
  members: [ManagementPerson, ManagementPerson, ManagementPerson];
  notes: string;
}

export interface AdvisoryTeam {
  esopCounsel: string;
  esopAdmin: string;
  sellerCpa: string;
  sellerAttorney: string;
  trustee: string;
  valuationFirm: string;
}

export interface ForhemitTeam {
  founderName: string;
  founderYears: string;
  email: string;
  phone: string;
  website: string;
  agreementDate: string;
  extraNotes: string;
}

export interface ComplianceChecklist {
  feeStructureDeliverables: boolean;
  sbaCounselReview: boolean;
  sellerGuarantee: boolean;
  twentyFourMonthStop: boolean;
  trusteeIndependence: boolean;
  controlDisclaimer: boolean;
  feesModeled: boolean;
  erisaDisclaimer: boolean;
  sellerNoteStandby: boolean;
  month20Transition: boolean;
}

export interface PackageInputs {
  lender: LenderInfo;
  financial: FinancialSnapshot;
  management: ManagementTeam;
  advisory: AdvisoryTeam;
  forhemit: ForhemitTeam;
  checklist: ComplianceChecklist;
}

export interface ValidationErrors {
  lenderName?: string;
  institution?: string;
  companyName?: string;
  industry?: string;
  yearsInOperation?: string;
  revenue?: string;
  ebitda?: string;
  dscr?: string;
  founderName?: string;
  founderYears?: string;
  founderEmail?: string;
}

export type PackageStep =
  | "lender"
  | "financial"
  | "management"
  | "advisory"
  | "forhemit"
  | "checklist"
  | "review";

export interface GeneratedPackageData {
  inputs: PackageInputs;
  generatedAt: string;
  allChecklistItemsConfirmed: boolean;
}
