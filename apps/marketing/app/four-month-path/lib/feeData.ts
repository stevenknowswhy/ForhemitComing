export type FeeTag = "esop-specific" | "universal" | "varies";
export type StateKey = "florida" | "texas" | "tennessee" | "other";

export type FeeRow = {
  name: string;
  range: string;
  tag: FeeTag;
  note: string;
};

export type FeePhase = {
  id: string;
  label: string;
  subtitle: string;
  rows: FeeRow[];
};

export type StateNote = {
  headline: string;
  body: string;
};

export const STATES: { value: StateKey; label: string }[] = [
  { value: "florida", label: "Florida" },
  { value: "texas", label: "Texas" },
  { value: "tennessee", label: "Tennessee" },
  { value: "other", label: "Other State" },
];

export const STATE_NOTES: Record<StateKey, StateNote> = {
  florida: {
    headline: "Florida considerations",
    body:
      "Florida has no state income tax, which can be favorable for 1042 rollover elections. If the business owns real property, Florida documentary stamp taxes on deed transfers may apply. Standard ESOP structure and fee ranges apply.",
  },
  texas: {
    headline: "Texas considerations",
    body:
      "Texas has no state personal income tax, making 1042 capital-gains deferral even more attractive. No state-level ESOP-specific regulations beyond federal ERISA. Texas franchise tax may apply to the company post-close. Standard fee ranges apply.",
  },
  tennessee: {
    headline: "Tennessee considerations",
    body:
      "Tennessee eliminated its Hall income tax; there is no state income tax on wages or capital gains. Standard ESOP structure applies with no additional state-level ESOP complexity. Corporate franchise and excise taxes apply to the company and should be reviewed by your advisor.",
  },
  other: {
    headline: "General U.S. ranges shown",
    body:
      "Fee ranges reflect national averages. State-specific corporate attorney fees, filing costs, and any state income tax on the sale proceeds may vary significantly. Consult a local ESOP advisor and tax counsel for state-specific planning.",
  },
};

export const FEE_PHASES: FeePhase[] = [
  {
    id: "phase1",
    label: "Within the first 30 days",
    subtitle: "Feasibility & initial engagement — low commitment, high information",
    rows: [
      {
        name: "Feasibility Study + Preliminary Valuation",
        range: "$10k – $40k",
        tag: "universal",
        note:
          "Non-binding range estimate done before any commitment. Directly reusable in an M&A marketing process (CIM, buyer discussions).",
      },
      {
        name: "ESOP Advisor / Quarterback — initial engagement",
        range: "$15k – $50k",
        tag: "universal",
        note:
          "Coordinates the full transaction. If running a dual-track process (ESOP + private buyer in parallel), success fees can be structured so M&A and ESOP portions are credited against each other.",
      },
    ],
  },
  {
    id: "phase2",
    label: "Days 31 – 60",
    subtitle: "LOI stage, bank engagement & legal kick-off",
    rows: [
      {
        name: "Quality of Earnings (QofE) + Financial Due Diligence",
        range: "$20k – $50k",
        tag: "universal",
        note:
          "Required by both lenders and ESOP trustees. 100% reusable if the deal moves to a private buyer. One of the most leveraged investments in the process.",
      },
      {
        name: "Company Corporate Attorney",
        range: "$20k – $50k",
        tag: "universal",
        note:
          "Sale agreement drafting, data room setup, governance cleanup. Work product transfers directly to any buyer — ESOP or private.",
      },
      {
        name: "Independent Transaction Appraisal (FMV)",
        range: "$15k – $35k",
        tag: "esop-specific",
        note:
          "Commissioned by the ESOP trustee as a fiduciary requirement. More rigorous than the feasibility estimate (discounts for key-person risk, customer concentration, illiquidity). Not required in a private sale.",
      },
      {
        name: "ERISA / ESOP Specialist Attorney",
        range: "$30k – $75k",
        tag: "esop-specific",
        note:
          "Drafts the ESOP plan, trust documents, and fiduciary process agreements. Critical for DOL compliance. Not applicable in a private buyer transaction.",
      },
    ],
  },
  {
    id: "phase3",
    label: "Days 61 – 120 (through closing)",
    subtitle: "Trustee engagement, final approvals & close",
    rows: [
      {
        name: "Independent ESOP Trustee + Trustee's Separate Counsel",
        range: "$35k – $130k",
        tag: "esop-specific",
        note:
          "Trustee must independently approve the price and terms on behalf of employees. Institutional trustees (e.g., GreatBanc, Reliance) are now standard for leveraged deals and significantly reduce DOL audit risk. Trustee's own attorney adds another $10k–$30k.",
      },
      {
        name: "Third-Party Administrator (TPA) — setup + first year",
        range: "$10k – $25k",
        tag: "esop-specific",
        note:
          "Sets up participant accounts, vesting schedules, Form 5500 filing, and repurchase obligation modeling. Ongoing annual TPA cost of $20k–$40k begins in Year 2.",
      },
      {
        name: "Other: financing fees, SBA packaging, escrow, misc.",
        range: "$10k – $50k",
        tag: "varies",
        note:
          "Bank commitment fees, legal opinions, SBA 7(a) packaging (if used), escrow, and miscellaneous closing costs. SBA financing adds minor packaging fees but eliminates the equity injection requirement common in conventional loans.",
      },
    ],
  },
];

export const FEE_TOTALS = {
  low: "$150,000",
  high: "$400,000+",
  typical: "$200,000 – $350,000",
  note:
    "All fees are borne by the company (or financed through the ESOP loan)—not paid personally by the seller. The company's future profits service any debt used to finance the buyout.",
};

export const DUAL_TRACK_NOTE = {
  headline: "Running a dual-track process (ESOP + private buyer in parallel)?",
  universal:
    "Feasibility study, QofE, corporate legal work, and data room costs are 80–100% reusable regardless of which path closes. No double-spend.",
  esopSunk:
    "If a private buyer wins the deal, ESOP-specific costs (trustee, FMV appraisal, ERISA attorney, TPA) are not recovered. Estimate $75k–$200k in sunk costs — but M&A broker success fees alone (1–3%+ of enterprise value) frequently exceed the entire ESOP setup cost. More importantly, having an active ESOP track is insurance: if a private buyer walks away at the last minute, you have a fully-developed closing option ready rather than starting over. It also strengthens your negotiating position with private buyers — they know you have a credible, funded alternative, which limits lowball offers and last-minute price reductions.",
  offset:
    "Real-world data: One dual-track case (PCE Companies) showed the ESOP path delivered 89% of the after-tax value of a rejected strategic offer — while avoiding broker fees and capital gains tax.",
};

export const TAG_LABELS: Record<FeeTag, string> = {
  "esop-specific": "ESOP Only",
  universal: "Universal",
  varies: "Varies",
};

export const TAG_DESCRIPTIONS: Record<FeeTag, string> = {
  "esop-specific": "Required only for an ESOP transaction. Not applicable to a private buyer sale.",
  universal: "Applicable to both ESOP and private buyer transactions. Work product is reusable.",
  varies: "Applies to both paths but amount depends on financing structure chosen.",
};
