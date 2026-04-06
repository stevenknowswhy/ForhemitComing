import type { IntakeAnswers, IntakeStepDef } from "../types";

export const ALL_STEPS: IntakeStepDef[] = [
  {
    id: "selling",
    field: "selling",
    label: "Are you looking to sell?",
    showIf: (a) => a.role === "owner",
    options: [
      { value: "yes", label: "Yes", sub: "Actively exploring a sale" },
      { value: "no", label: "Not right now", sub: "Focused on building resilience first" },
    ],
  },
  {
    id: "broker",
    field: "broker",
    label: "Do you have a broker?",
    showIf: (a) => a.role === "owner" && a.selling === "yes",
    options: [
      { value: "yes", label: "Yes, I have a broker", sub: "They're managing the sale process" },
      { value: "no", label: "No, navigating this myself", sub: "No advisor engaged yet" },
    ],
  },
  {
    id: "saleTrack",
    field: "saleTrack",
    label: "How are you approaching the sale?",
    lender: true,
    showIf: (a) => (a.role === "owner" && a.selling === "yes") || a.role === "broker",
    options: [
      { value: "single", label: "Single track", sub: "One buyer or lender path" },
      { value: "dual", label: "Dual track", sub: "Broker seeking buyers while lender package builds" },
      { value: "employee", label: "Selling to employees", sub: "100% employee ownership transfer" },
    ],
  },
  {
    id: "financingType",
    field: "financingType",
    label: "What financing do you expect?",
    lender: true,
    multi: true,
    hint: "Select all that apply",
    showIf: (a) => (a.selling === "yes" || a.role === "broker") && a.saleTrack !== undefined,
    options: [
      { value: "sba", label: "SBA 7(a) loan", sub: "Government-backed, most common" },
      { value: "conventional", label: "Conventional financing", sub: "Traditional bank, larger down payment" },
      { value: "seller_note", label: "Seller note", sub: "Seller carries part of the deal" },
      { value: "esop_loan", label: "ESOP trustee loan", sub: "For employee ownership transitions" },
      { value: "unsure", label: "Not sure yet", sub: "We'll help identify the right structure" },
    ],
  },
  {
    id: "closeUrgency",
    field: "closeUrgency",
    label: "How do you want to approach closing?",
    lender: true,
    showIf: (a) => (a.selling === "yes" || a.role === "broker") && a.financingType !== undefined,
    options: [
      {
        value: "fast",
        label: "Close as quickly as possible",
        sub: "Prioritize speed — lender package and financials move first, collateral builds in parallel",
      },
      {
        value: "prepared",
        label: "Have everything ready first",
        sub: "Build the full package before going to market — close on our terms, when we're ready",
      },
    ],
  },
  {
    id: "esop",
    field: "esop",
    label: "Are you exploring an ESOP?",
    showIf: (a) => a.role === "owner" && a.selling === "no",
    options: [
      { value: "yes", label: "Yes, exploring an ESOP", sub: "Interested in employee ownership" },
      { value: "no", label: "No, focused on resilience", sub: "I want my business to run without me" },
    ],
  },
];

export function getVisible(committed: IntakeAnswers) {
  return ALL_STEPS.filter((s) => s.showIf(committed));
}

export function isComplete(p: IntakeAnswers) {
  if (p.role === "broker" && p.saleTrack !== undefined && p.financingType !== undefined && p.closeUrgency !== undefined)
    return true;
  if (
    p.role === "owner" &&
    p.selling === "yes" &&
    p.broker !== undefined &&
    p.saleTrack !== undefined &&
    p.financingType !== undefined &&
    p.closeUrgency !== undefined
  )
    return true;
  if (p.role === "owner" && p.selling === "no" && p.esop !== undefined) return true;
  return false;
}
