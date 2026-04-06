import type { GateInfo } from "../types";

/** Hard gates keyed by transaction day (1–120). */
export const GATES: Record<number, GateInfo> = {
  45: {
    name: "Gate 1 — FMV Adequacy Letter",
    desc: "The trustee's appraiser must confirm the purchase price is fair to the ESOP under ERISA. No letter = no LOI. Full stop.",
  },
  60: {
    name: "Gate 2 — SBA Commitment Letter",
    desc: "Lender issues formal commitment defining the capital stack. No legal document drafting begins before this arrives.",
  },
  75: {
    name: "Gate 3 — QofE EBITDA Within 15% of LOI",
    desc: "Adjusted EBITDA must be within 15% of the LOI assumption. Outside that band: stop, renegotiate the structure, then draft.",
  },
  90: {
    name: "Gate 4 — Trustee COOP Sign-off",
    desc: "Forhemit delivers this gate. The trustee formally accepts the COOP, confirming the business is operationally viable post-close.",
  },
};
