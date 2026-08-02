import type { SignalOsTier } from "./types";

export const canonicalUrl = "https://www.forhemit.com/signal-os";
export const FOUNDING_DEADLINE_MS = Date.parse("2026-08-03T21:22:00Z");
export const FOUNDING_PRICE_VALID_UNTIL = "2026-08-03";

export const tiers: SignalOsTier[] = [
  {
    id: "solo",
    name: "Solo",
    price: "$99",
    priceAmount: "99",
    fit: "For one operator running a rigorous audit workflow.",
    features: [
      "Offline evidence workstation",
      "Prompt and citation register",
      "Action prioritization board",
      "Client-ready report builder",
      "Filled fictional sample audit",
      "Solo field manual",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "$349",
    priceAmount: "349",
    fit: "For consultants delivering the work commercially to clients.",
    features: [
      "Everything in Solo",
      "Commercial client-use license",
      "Pricing and margin calculator",
      "30-day client roadmap",
      "Monthly reporting workbook",
      "QA and delivery checklists",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: "$749",
    priceAmount: "749",
    fit: "For teams standardizing delivery, training, and operations.",
    features: [
      "Everything in Agency",
      "Up to 5 internal team users",
      "Editable team training deck",
      "Facilitator talk track",
      "Roles and handoff model",
      "Team QA operating manual",
    ],
  },
];
