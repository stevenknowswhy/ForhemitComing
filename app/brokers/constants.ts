import type { CheckpointRow, PhaseBlock } from "@/app/four-month-path/constants";

export type { PhaseBlock, CheckpointRow };

export const BROKER_FIRST_CALL_CHECKLIST_PDF_HREF =
  "/downloads/Forhemit-Broker-First-Call-Checklist.pdf";

export type BrokerTimelineFaqItem = {
  id: string;
  q: string;
  a: string;
};

export const BROKER_PILLARS = [
  {
    id: "close",
    icon: "◆",
    title: "A more assured closing",
    body: "Parallel ESOP work means your seller is not hanging on a single buyer’s timeline. When diligence drags or a strategic walks, the employee track is already financed and moving—so you are less likely to lose the fee to “no deal.”",
  },
  {
    id: "price",
    icon: "◇",
    title: "Full fair value at close",
    body: "The structure is built around an independent valuation and bank-backed financing—cash to the seller at closing, not a vague earn-out story. Your client gets a real number and a real wire, aligned with how ESOP purchases are typically funded.",
  },
  {
    id: "commission",
    icon: "▣",
    title: "You stay the broker of record",
    body: "We are not shopping the business on the buy side. We quarterback ESOP execution—lender, trustee, appraiser, ERISA counsel—while you keep the relationship and a standard success fee when the transaction closes.",
  },
] as const;

export const BROKER_QUALIFICATION_CRITERIA = [
  { id: "revenue", label: "Listing at roughly $3M+ revenue (bankable scale)" },
  { id: "employees", label: "At least ~20 full-time employees (viable internal bench)" },
  { id: "profitable", label: "Profitable recent history (underwriting-friendly)" },
  { id: "ownership", label: "Seller owns a controlling stake (or clear path to 100%)" },
  { id: "operable", label: "Business can run without the owner—or owner will transition" },
  { id: "entity", label: "C-Corp or S-Corp (ESOP-feasible entity)" },
  { id: "market", label: "You are open to running or allowing a parallel ESOP track" },
] as const;

export const BROKER_PHASE_BLOCKS: PhaseBlock[] = [
  {
    id: "brk-phase-1",
    monthLabel: "MONTH 1: QUALIFY THE LISTING & BUILD THE FILE",
    dayRange: "Days 1–30",
    bullets: [
      "NDAs and engagement: you keep the broker relationship; we align on what the seller can share",
      "Lender starts credit narrative—your client sees early signal on financeability",
      "Operations map: who runs what post-close so underwriting does not stall on “key person” risk",
    ],
    checkpoint: "Checkpoint: Independent indication of fair value (appraiser path kicked off)",
  },
  {
    id: "brk-phase-2",
    monthLabel: "MONTH 2: LOCK TERMS",
    dayRange: "Days 31–60",
    bullets: [
      "Letter of intent level economics for the ESOP purchase—your seller knows the number",
      "Bank moves toward commitment—parallel to any buyer LOIs you are negotiating",
      "Quality of earnings / financial package tightened so Month 3 is paperwork, not archaeology",
    ],
    checkpoint: "Checkpoint: Lender commitment directionally clear",
  },
  {
    id: "brk-phase-3",
    monthLabel: "MONTH 3: DOCUMENTS & TRUSTEE",
    dayRange: "Days 61–90",
    bullets: [
      "Purchase agreement and ESOP plan documents—coordinated with your deal timeline",
      "Trustee diligence: employees as buyers must be protected; that protects everyone at close",
      "Employee communications staged so the market process is not disrupted prematurely",
    ],
    checkpoint: "Checkpoint: Trustee comfortable the company runs without the seller at the desk",
  },
  {
    id: "brk-phase-4",
    monthLabel: "MONTH 4: CLOSE & PAY SELLER",
    dayRange: "Days 91–120",
    bullets: [
      "Sign, fund, wire—seller paid consistent with the ESOP structure (typically largely upfront)",
      "You invoice your success fee on the closed transaction like any other closing",
      "If a private buyer won earlier, you already benefited from leverage; if not, you still have a close",
    ],
    checkpoint: "Result: funded transaction—broker fee event, seller exit, employees own the company",
  },
];

export const BROKER_CHECKPOINTS: CheckpointRow[] = [
  {
    title: "Valuation checkpoint",
    day: "~Day 45",
    body: "Independent appraisal supports a fair price to the ESOP—credible with lenders and defensible for your seller.",
  },
  {
    title: "Bank checkpoint",
    day: "~Day 60",
    body: "Lender commitment in view so you are not selling a fantasy—your parallel buyer conversations sit on real financing.",
  },
  {
    title: "Financial health checkpoint",
    day: "~Day 75",
    body: "Trailing performance still supports the deal—reduces eleventh-hour reprices that kill M&A and ESOP alike.",
  },
  {
    title: "Operations checkpoint",
    day: "~Day 90",
    body: "Evidence the business runs without the owner in the chair—what banks and trustees need for a clean close.",
  },
];

export const BROKER_REALISM_FAQ: BrokerTimelineFaqItem[] = [
  {
    id: "parallel",
    q: "Will a parallel ESOP track scare off my buyers?",
    a: "Done well, it signals your seller has a serious alternative—not desperation. Many intermediaries use a funded Plan B to reduce re-trades. We coordinate messaging and NDAs so your process stays orderly.",
  },
  {
    id: "timeline",
    q: "Is 90–120 days realistic while I am in market?",
    a: "For listings with clean financials and responsive sellers, yes—similar to a well-run SBA-backed path. Messy books or slow data add weeks; we surface that in Month 1 so you can set expectations with buyers and the seller.",
  },
  {
    id: "fee",
    q: "Do I still get paid if the ESOP closes?",
    a: "Yes—when you are broker of record on the closed transaction, your success fee is part of the closing economics like any other sale. We do not compete for your commission.",
  },
  {
    id: "if-buyer-wins",
    q: "What if a private buyer wins first?",
    a: "Your seller had negotiating strength while the ESOP track was real. Some ESOP-specific costs may be sunk—similar to other broken-deal costs in M&A—but that is often small relative to saving a fee when buyers ghost at the end.",
  },
];

export const BROKER_OUTCOME_CARDS = [
  {
    id: "private-wins",
    icon: "A",
    title: "Private buyer wins",
    subtitle: "Best-case for a strategic/PE offer you love",
    bullets: [
      "Your seller had a credible ESOP alternative—often firmer on price and terms.",
      "You close M&A as planned and earn your success fee on that transaction.",
      "Some parallel ESOP costs may not be recovered—treat like deal insurance, not a second fee stack.",
    ],
  },
  {
    id: "batna",
    icon: "B",
    title: "While you are negotiating",
    subtitle: "ESOP as leverage, not chaos",
    bullets: [
      "Buyers sense a financed internal path—fewer late “haircuts” and less slow-walking.",
      "You keep the process professional: one data room discipline, aligned timelines.",
      "If the buyer tries to re-trade, your seller can walk toward the employee track without starting from zero.",
    ],
  },
  {
    id: "esop-closes",
    icon: "C",
    title: "No buyer / buyer walked",
    subtitle: "The ESOP completes",
    bullets: [
      "Seller still exits with a bank-backed purchase—typically ~90–120 days when the file is clean.",
      "You earn your fee on the closed ESOP transaction as broker of record.",
      "Employees are the buyers through the trust; legacy and jobs stay intact—strong referral story for you.",
    ],
  },
] as const;

/** What we ask of the broker; paired with “no extra sell-side process” messaging on the page. */
export const BROKER_NEEDS_FROM_YOU = [
  "A clear broker-of-record relationship and permission for us to engage the seller under your NDA (or a tri-party letter)—so nothing happens behind your back.",
  "Access to the same financial narrative you are already using for buyers: P&Ls, balance sheets, cap table, and data-room materials. We only ask for ESOP- or lender-specific items when underwriting needs them—not a second full QoE by default.",
  "A single coordination point: typically you, unless you want us copied with the seller on ESOP-only topics. Short syncs (often weekly early on, then at checkpoints) instead of ad-hoc chaos.",
  "Visibility into your process calendar—IOIs, management meetings, LOI targets—so we never blind-side a buyer or break a process letter.",
  "Help getting the seller’s attention for signatures and quick decisions at standard milestones (engagement, bank, trustee). That is usually minutes, not new projects for you.",
] as const;

/** Same pattern as “No duplicate auction.” rows in the workload answer group. */
export const BROKER_WORKLOAD_MEANING_ROWS = [
  {
    lead: "Closing Certainty.",
    body: "You can be confident there is still a path to close when there are no outside buyers—or when a buyer fails late. The parallel ESOP track is real financing and real milestones, not a placeholder—so you are not rebuilding a deal from scratch.",
  },
  {
    lead: "Negotiating Strength.",
    body: "Your seller gains negotiating leverage: a credible Plan B means they can reject a weak private offer or push back on a bad re-trade without bluffing. Buyers treat a funded employee path differently than an empty threat.",
  },
] as const;

export const BROKER_PROCESS_STEPS = [
  {
    num: "1",
    title: "Intro & listing fit",
    body: "You introduce the seller (or we align under your NDA). We confirm headcount, profitability, and whether dual-track is worth the effort.",
  },
  {
    num: "2",
    title: "Parallel planning",
    body: "You run your buyer process; we build lender, trustee, and appraiser workstreams. Status updates stay coordinated so the seller is not double-booked.",
  },
  {
    num: "3",
    title: "Checkpoint cadence",
    body: "Same rhythm as our four-month path: valuation, bank, financials, operations—no surprise failures at the closing table.",
  },
  {
    num: "4",
    title: "Close one path",
    body: "If a buyer wins, you close M&A. If not, we close the ESOP—you are still the intermediary on the transaction that funds.",
  },
] as const;
