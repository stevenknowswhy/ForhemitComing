/** Interactive roadmap HTML */
export const ROADMAP_PDF_HREF = "/downloads/Forhemit-120-Day-Roadmap.html";

/** Printable companion to the fee transparency modal; regenerate via `npm run generate:fee-pdf` */
export const FEE_TRANSPARENCY_PDF_HREF = "/downloads/Forhemit-ESOP-Fee-Transparency.pdf";

/** Replace with Calendly or booking URL when available */
export const SCHEDULE_20_MIN_HREF =
  "mailto:contact@forhemit.com?subject=20-Minute%20Call%20%E2%80%94%20Get%20My%20Price%20Range";

export type PhaseBlock = {
  id: string;
  monthLabel: string;
  dayRange: string;
  bullets: string[];
  checkpoint: string;
};

export const FOUR_PHASE_BLOCKS: PhaseBlock[] = [
  {
    id: "phase-1",
    monthLabel: "MONTH 1: READINESS & VALUATION",
    dayRange: "Month 1 of 4",
    bullets: [
      "Confidential review of financials, headcount, and ownership structure",
      "Qualification check against the $3M+ revenue / 20+ verifiable U.S. employees / profitable / 51%+ controlling-stake standard",
      "Independent valuation commissioned from a qualified third-party appraiser",
      "A plain-language feasibility summary you can share with your own advisors",
    ],
    checkpoint:
      "Checkpoint: A plain-language feasibility summary you can share with your own advisors",
  },
  {
    id: "phase-2",
    monthLabel: "MONTH 2: STRUCTURE & FINANCING",
    dayRange: "Month 2 of 4",
    bullets: [
      "ESOP structure design with ERISA counsel",
      "Lender-ready financing package prepared and placed with ESOP-experienced lenders",
      "Seller financing terms modeled in full, so you see the payment schedule before you commit",
      "Repurchase-obligation forecast so the plan is sustainable from day one",
    ],
    checkpoint:
      "Checkpoint: Seller financing terms modeled in full — you see the payment schedule before you commit",
  },
  {
    id: "phase-3",
    monthLabel: "MONTH 3: LEGAL & COMPLIANCE",
    dayRange: "Month 3 of 4",
    bullets: [
      "Plan and trust documents drafted and reviewed",
      "Independent trustee appointed to represent employees' interests",
      "DOL and IRS compliance requirements documented step by step",
      "Employee communication plan prepared — what is said, when, and by whom",
    ],
    checkpoint:
      "Checkpoint: Independent trustee appointed to represent employees' interests",
  },
  {
    id: "phase-4",
    monthLabel: "MONTH 4: CLOSE & HANDOVER",
    dayRange: "Month 4 of 4",
    bullets: [
      "Closing executed with trustee, lender, and counsel at one table",
      "Employees welcomed as owners with a clear explanation of what they now hold",
      "Your 4-to-12-month post-close availability begins exactly as agreed in writing — on call for check-ins, introductions, and questions, not working hands-on",
      "Ongoing governance, culture, and repurchase planning under Forhemit stewardship",
    ],
    checkpoint:
      "Result: Your employees own the company — and your transition availability begins, exactly as agreed in writing",
  },
];

export type CheckpointRow = {
  title: string;
  day: string;
  body: string;
};

export const FOUR_CHECKPOINTS: CheckpointRow[] = [
  {
    title: "Independent valuation",
    day: "Month 1",
    body: "A qualified third-party appraiser sets the price. The trustee reviews the valuation on behalf of employees and must conclude the price is no more than fair market value.",
  },
  {
    title: "Financing placed",
    day: "Month 2",
    body: "A lender-ready financing package is prepared and placed with ESOP-experienced lenders, and the seller financing terms are modeled in full.",
  },
  {
    title: "Compliance documented",
    day: "Month 3",
    body: "Plan and trust documents are drafted and reviewed, the independent trustee is appointed, and DOL and IRS requirements are documented step by step.",
  },
  {
    title: "Closing executed",
    day: "Month 4",
    body: "The sale closes with trustee, lender, and counsel at one table — and employees are welcomed as owners, with a clear explanation of what they now hold.",
  },
];
