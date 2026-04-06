/**
 * Lender Q&A Tracker - Type Definitions
 * 3-step wizard for tracking lender questions and conditions
 */

export type LoanType =
  | "7a-std"
  | "7a-small"
  | "504"
  | "conv"
  | "other"
  | "";

export type DealStage =
  | "Q&A Open"
  | "Pending Commitment"
  | "Committed"
  | "Closed"
  | "";

export type QACategory =
  | "Creditworthiness"
  | "Management continuity"
  | "ESOP structure"
  | "SBA compliance"
  | "Collateral"
  | "Financials"
  | "Valuation"
  | "Legal";

export type QASource =
  | "Lender"
  | "SBA"
  | "Trustee"
  | "Appraiser"
  | "Internal"
  | "Legal Counsel"
  | "";

export type QAStatus = "Open" | "Pending" | "Resolved" | "Blocked" | "Waived";

export type QAPriority = "High" | "Med" | "Low";

export type QAFilter =
  | "all"
  | "Open"
  | "Pending"
  | "Resolved"
  | "Blocked"
  | "Waived"
  | "high"
  | "overdue";

export interface DealHeader {
  company: string;
  dealid: string;
  loantype: LoanType;
  loanamt: string;
  lender: string;
  lcontact: string;
  lemail: string;
  lphone: string;
  subdate: string;
  closedate: string;
  dealstage: DealStage;
  advisor: string;
  advisoremail: string;
  headernotes: string;
}

export interface QAItem {
  id: string;
  cat: QACategory;
  source: QASource;
  q: string;
  status: QAStatus;
  pri: QAPriority;
  owner: string;
  due: string;
  notes: string;
  docref: string;
  resdate: string;
  resby: string;
  dateReceived: string;
  lastModified: string;
}

export interface LenderQAInputs {
  header: DealHeader;
  items: QAItem[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface MetricsData {
  total: number;
  resolved: number;
  pending: number;
  blocked: number;
  overdue: number;
  percentage: number;
}

export interface CategoryProgress {
  category: QACategory;
  total: number;
  resolved: number;
  percentage: number;
  hasOverdue: boolean;
}
