import type { PillarItem } from "./types";

export const DEFAULT_PILLARS: PillarItem[] = [
  { id: "P1", title: "Operational Continuity Monitoring", desc: "Monthly COOP review against actual conditions. Written status report within 10 business days of month-end.", checked: true },
  { id: "P2", title: "Key-Person Risk Tracking", desc: "Employment status and succession readiness monitoring for critical personnel. Escalation protocol active.", checked: true },
  { id: "P3", title: "Financial Baseline Reporting", desc: "Monthly comparison vs. QofE baseline. EBITDA variance flagging at ±15%. CPA coordination for lender reporting.", checked: true },
  { id: "P4", title: "Governance Documentation", desc: "Operating procedures, delegation of authority, board resolution log, officer succession plan maintenance.", checked: true },
  { id: "P5", title: "Lender Covenant Monitoring", desc: "Monthly DSCR, liquidity, and CapEx covenant tracking. 60-day advance warning of projected breach. Lender RM coordination.", checked: true },
  { id: "P6", title: "Succession Progress Reporting", desc: "Quarterly successor readiness updates. Final Transition Report at end of stewardship period.", checked: true },
];
