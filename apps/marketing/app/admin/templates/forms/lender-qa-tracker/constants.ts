/**
 * Lender Q&A Tracker - Constants and Default Values
 */
import {
  DealHeader,
  LenderQAInputs,
  QAItem,
  QACategory,
  QAStatus,
  QAPriority,
  QASource,
  LoanType,
  DealStage,
} from "./types";

export const CATEGORIES: QACategory[] = [
  "Creditworthiness",
  "Management continuity",
  "ESOP structure",
  "SBA compliance",
  "Collateral",
  "Financials",
  "Valuation",
  "Legal",
];

export const LOAN_TYPE_OPTIONS: { value: LoanType; label: string }[] = [
  { value: "", label: "Select…" },
  { value: "7a-std", label: "SBA 7(a) Standard" },
  { value: "7a-small", label: "SBA 7(a) Small" },
  { value: "504", label: "SBA 504" },
  { value: "conv", label: "Conventional" },
  { value: "other", label: "Other" },
];

export const DEAL_STAGE_OPTIONS: { value: DealStage; label: string }[] = [
  { value: "", label: "Select…" },
  { value: "Q&A Open", label: "Q&A Open" },
  { value: "Pending Commitment", label: "Pending Commitment" },
  { value: "Committed", label: "Committed" },
  { value: "Closed", label: "Closed" },
];

export const QA_STATUS_OPTIONS: { value: QAStatus; label: string }[] = [
  { value: "Open", label: "Open" },
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" },
  { value: "Blocked", label: "Blocked" },
  { value: "Waived", label: "Waived" },
];

export const QA_PRIORITY_OPTIONS: { value: QAPriority; label: string }[] = [
  { value: "High", label: "High" },
  { value: "Med", label: "Med" },
  { value: "Low", label: "Low" },
];

export const QA_SOURCE_OPTIONS: { value: QASource; label: string }[] = [
  { value: "", label: "Select…" },
  { value: "Lender", label: "Lender" },
  { value: "SBA", label: "SBA" },
  { value: "Trustee", label: "Trustee" },
  { value: "Appraiser", label: "Appraiser" },
  { value: "Internal", label: "Internal" },
  { value: "Legal Counsel", label: "Legal Counsel" },
];

export const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" },
  { value: "Blocked", label: "Blocked" },
  { value: "Waived", label: "Waived" },
  { value: "high", label: "High priority" },
  { value: "overdue", label: "Overdue" },
];

export const SBA_LOAN_LIMITS: Record<string, number> = {
  "7a-std": 5000000,
  "7a-small": 500000,
  "504": 5000000,
};

export const DEFAULT_DEAL_HEADER: DealHeader = {
  company: "",
  dealid: "",
  loantype: "",
  loanamt: "",
  lender: "",
  lcontact: "",
  lemail: "",
  lphone: "",
  subdate: new Date().toISOString().split("T")[0],
  closedate: "",
  dealstage: "",
  advisor: "",
  advisoremail: "",
  headernotes: "",
};

export const DEFAULT_QA_ITEM: Omit<QAItem, "id" | "dateReceived" | "lastModified"> = {
  cat: "Creditworthiness",
  source: "",
  q: "",
  status: "Open",
  pri: "Med",
  owner: "",
  due: "",
  notes: "",
  docref: "",
  resdate: "",
  resby: "",
};

export const DEFAULT_INPUTS: LenderQAInputs = {
  header: { ...DEFAULT_DEAL_HEADER },
  items: [],
};

export const STEPS = [
  { id: 1, label: "Deal Header", num: "1" },
  { id: 2, label: "Q&A Items", num: "2" },
  { id: 3, label: "Summary & Print", num: "3" },
];

// Common ESOP questions template
export const ESOP_TEMPLATE_ITEMS: Omit<
  QAItem,
  "id" | "dateReceived" | "lastModified"
>[] = [
  {
    cat: "SBA compliance",
    source: "SBA",
    q: "Confirmation of ERISA compliance and plan qualification status",
    pri: "High",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "ESOP structure",
    source: "Lender",
    q: "Copy of ESOP plan document and latest determination letter",
    pri: "High",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "Valuation",
    source: "Lender",
    q: "Independent appraisal supporting the transaction price",
    pri: "High",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "Management continuity",
    source: "Lender",
    q: "Employment agreements for key management post-transaction",
    pri: "Med",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "Financials",
    source: "Lender",
    q: "3 years historical financial statements and current interim statements",
    pri: "High",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "Creditworthiness",
    source: "Lender",
    q: "Personal financial statements of guarantors",
    pri: "Med",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
  {
    cat: "Collateral",
    source: "Lender",
    q: "Equipment list with serial numbers and fair market values",
    pri: "Med",
    status: "Open",
    owner: "",
    due: "",
    notes: "",
    docref: "",
    resdate: "",
    resby: "",
  },
];
