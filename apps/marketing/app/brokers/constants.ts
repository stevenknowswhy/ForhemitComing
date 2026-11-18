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
    id: "closing-table",
    icon: "◆",
    title: "Paid at the closing table, or not at all",
    body: "An exclusive listing runs six months, a year — valuation, memorandum, buyer screening, site visits, negotiation — and every hour of it is fronted against a single closing. When a listing expires, the work does not convert. It evaporates.",
  },
  {
    id: "market-odds",
    icon: "◇",
    title: "Only 20 to 30% of listings sell",
    body: "Only about 20 to 30% of businesses that go to market actually sell (Exit Planning Institute). And the deals that do find a buyer can still die on the way — in diligence, on the buyer's financing, or in the founder's own second thoughts.",
  },
  {
    id: "buyer-already-there",
    icon: "▣",
    title: "One buyer does not need to be found",
    body: "None of that is a failure of effort. It is the shape of a market where the buyer has to be found, financed, and kept enthusiastic for months. The employees are already there.",
  },
] as const;

export const BROKER_QUALIFICATION_CRITERIA = [
  { id: "revenue", label: "Annual revenue of $3M or more" },
  { id: "employees", label: "20 or more verifiable U.S. employees" },
  { id: "profitable", label: "Profitable, with a consistent track record" },
  { id: "ownership", label: "The owner holds 51% or more of the company" },
  { id: "timeline", label: "The owner can allow a full four months for the transition" },
  { id: "availability", label: "The owner is willing to be available for 4 to 12 months after closing — on call, not working hands-on" },
] as const;

export const BROKER_PHASE_BLOCKS: PhaseBlock[] = [
  {
    id: "brk-phase-1",
    monthLabel: "MONTH 1: READINESS & VALUATION",
    dayRange: "Month 1 of 4",
    bullets: [
      "Confidential review of the business you bring us, screened against the published standard",
      "Independent valuation: the price is set by an appraiser who works for neither side",
      "Readiness: the transition is stress-tested before the transaction is structured",
    ],
    checkpoint: "Checkpoint: Independent valuation in hand",
  },
  {
    id: "brk-phase-2",
    monthLabel: "MONTH 2: STRUCTURE & FINANCING",
    dayRange: "Month 2 of 4",
    bullets: [
      "The employee-ownership structure is designed and its financing placed",
      "The fee document and the 120-Day Roadmap are already in the founder's hands from the assessment",
      "You are kept informed at the phase gate, with the founder's authorisation",
    ],
    checkpoint: "Checkpoint: Financing placed",
  },
  {
    id: "brk-phase-3",
    monthLabel: "MONTH 3: LEGAL & COMPLIANCE",
    dayRange: "Month 3 of 4",
    bullets: [
      "Plan and trust documents, transaction documents, and the DOL/IRS compliance calendar — coordinated, never improvised",
      "Employee communication happens at the right moment, agreed in advance",
    ],
    checkpoint: "Checkpoint: Compliance documented",
  },
  {
    id: "brk-phase-4",
    monthLabel: "MONTH 4: CLOSE & HANDOVER",
    dayRange: "Month 4 of 4",
    bullets: [
      "Closing is executed and the employees own the company",
      "The founder's on-call transition period of 4 to 12 months begins",
      "The company is monitored for 24 months after close",
    ],
    checkpoint: "Checkpoint: Closing executed",
  },
];

export const BROKER_CHECKPOINTS: CheckpointRow[] = [
  {
    title: "Independent valuation",
    day: "Month 1",
    body: "The price rests on an independent appraisal — set by an appraiser who works for neither side, so you can defend it to your client.",
  },
  {
    title: "Financing placed",
    day: "Month 2",
    body: "The structure and its financing are in place before legal work begins — not hoped for at the closing table.",
  },
  {
    title: "Compliance documented",
    day: "Month 3",
    body: "Plan documents, transaction documents, and the compliance calendar are complete and coordinated with the founder's own counsel.",
  },
  {
    title: "Closing executed",
    day: "Month 4",
    body: "The employees own the company, and the founder's on-call transition period begins.",
  },
];

export const BROKER_REALISM_FAQ: BrokerTimelineFaqItem[] = [
  {
    id: "timeline",
    q: "How long does the process take?",
    a: "About four months from first review to the closing table — against the 12 to 18 months a traditional sale process commonly runs, when it closes at all. What can stretch it is readiness: the work in Month 1 exists to surface that early, not at the closing table.",
  },
  {
    id: "not-a-fit",
    q: "What if my client doesn't qualify?",
    a: "You hear it fast, with the reasons — in terms you can take back to your client, along with what would have to change. The standard we screen against is published on this page, so there are no surprises in either direction.",
  },
  {
    id: "introduction-earns",
    q: "What does an introduction earn me?",
    a: "We are asked, fairly, what a broker gets for an introduction. We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals. What we offer is a clean handoff, a founder who actually transacts, and a broker who is kept informed at every phase.",
  },
  {
    id: "deal-team",
    q: "Do you work with my client's existing deal team?",
    a: "Yes — alongside them, never instead of them. The founder's attorney, CPA, and wealth manager stay in their roles; we coordinate the transition work with them and keep you informed at every phase, with your client's authorisation.",
  },
];

export const BROKER_OUTCOME_CARDS = [
  {
    id: "waiting",
    icon: "A",
    title: "Waiting",
    subtitle: "The market's buyer, on the market's timing",
    bullets: [
      "Relist and hope the next round of buyers is different.",
      "Cut the price and ask the founder to accept less for the same company.",
      "Wait for a buyer the founder will actually accept — while the founder gets older, the file gets staler, and the exclusive term runs down.",
    ],
  },
  {
    id: "making",
    icon: "B",
    title: "Making it happen",
    subtitle: "The buyer who is already there",
    bullets: [
      "The founder sells 100% of the company to its employees, at a price set by an independent appraiser who works for neither side.",
      "Where the transaction qualifies, Section 1042 provides tax-deferred treatment for the founder.",
      "The founder is available to the company for a transition period of 4 to 12 months after close — on call, not working hands-on.",
    ],
  },
  {
    id: "founders-terms",
    icon: "C",
    title: "The founder's terms",
    subtitle: "Some founders aren't refusing to sell. They're refusing to sell to them.",
    bullets: [
      "The business is sound, the price is defensible, and the offers are real — from buyers the founder does not trust with people they have employed for twenty years.",
      "The employees are the buyer this founder can say yes to: continuity rather than absorption.",
      "The conversation can only start with you — the founder called the broker first.",
    ],
  },
] as const;

/** What we ask of the broker in the division of work. */
export const BROKER_NEEDS_FROM_YOU = [
  "You bring the founder, and everything you already know about the business — the knowledge no memorandum fully holds.",
  "You are in the room when your client is first approached about the option.",
  "You describe the business on a first call — no client name needed — and we screen it together against the published standard.",
  "You stay the founder's broker: nothing happens behind your back, and you are kept informed as it proceeds.",
] as const;

/** Division-of-work rows: what Forhemit carries. */
export const BROKER_WORKLOAD_MEANING_ROWS = [
  {
    lead: "Structure and financing.",
    body: "The independent valuation the price rests on, the structure, and its financing — carried by Forhemit, end to end.",
  },
  {
    lead: "After close.",
    body: "The founder's on-call transition availability runs 4 to 12 months, and the company is monitored for 24 months under our Early Warning System, against indicators agreed with the founder up front.",
  },
] as const;

export const BROKER_PROCESS_STEPS = [
  {
    num: "1",
    title: "A short first call",
    body: "You describe the business — no name needed — and the situation: the listing's history, the buyers the founder has refused, where things stand.",
  },
  {
    num: "2",
    title: "We screen it together",
    body: "Against the qualification standard on this page. If it is not a fit, you hear that fast, with the reasons.",
  },
  {
    num: "3",
    title: "Your client is approached — with you in the room",
    body: "Only then, and the option is presented as what it is: a buyer they already know.",
  },
  {
    num: "4",
    title: "We carry it to close",
    body: "If the founder proceeds, Forhemit structures the transition and carries it toward close in about four months, and you are kept informed at every phase.",
  },
] as const;
