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
    monthLabel: "MONTH 1: GET YOUR NUMBER & BUILD THE PLAN",
    dayRange: "Days 1–30",
    bullets: [
      "Sign NDAs and Retainer Agreement",
      "Bank starts reviewing your business for the loan",
      "We map who runs what after you leave (backup plan for every key person)",
    ],
    checkpoint: "Checkpoint: Fair price confirmed by independent appraiser",
  },
  {
    id: "phase-2",
    monthLabel: "MONTH 2: LOCK IN THE DEAL",
    dayRange: "Days 31–60",
    bullets: [
      "You sign the Letter of Intent (price locked in)",
      'Bank issues formal commitment letter ("yes, we\'ll lend")',
      "Final numbers check: Does the business still look healthy?",
    ],
    checkpoint: "Checkpoint: Bank commitment secured",
  },
  {
    id: "phase-3",
    monthLabel: "MONTH 3: FINAL APPROVALS & PAPERWORK",
    dayRange: "Days 61–90",
    bullets: [
      "Lawyers draft the purchase agreement",
      'Independent trustee confirms: "This business won\'t die when the owner leaves" (operations ready)',
      "Employees get trained on how ownership works",
    ],
    checkpoint: "Checkpoint: Trustee sign-off—business ready to run without you",
  },
  {
    id: "phase-4",
    monthLabel: "MONTH 4: CLOSE & GET PAID",
    dayRange: "Days 91–120",
    bullets: [
      "Final document signing",
      "Bank wires the money—you get paid (usually 60–80% upfront, remainder via seller note)",
      "Employees officially take over",
      "You stay on as an advisor for 6–12 months (flexible hours) to help them learn the ropes",
    ],
    checkpoint: "Result: You sold your business. Check in hand.",
  },
];

export type CheckpointRow = {
  title: string;
  day: string;
  body: string;
};

export const FOUR_CHECKPOINTS: CheckpointRow[] = [
  {
    title: "Price Check",
    day: "Day 45",
    body: "Independent expert confirms the price is fair to the employees (protects you from future lawsuits)",
  },
  {
    title: "Bank Check",
    day: "Day 60",
    body: "Lender officially commits the money to buy you out",
  },
  {
    title: "Numbers Check",
    day: "Day 75",
    body: "Final financial review confirms business health hasn't changed",
  },
  {
    title: "Operations Check",
    day: "Day 90",
    body: "Expert confirms the business can run without you (Forhemit delivers this)",
  },
];
