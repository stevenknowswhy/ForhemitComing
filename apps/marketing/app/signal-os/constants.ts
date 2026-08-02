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
  },
  {
    id: "agency",
    name: "Agency",
    price: "$349",
    priceAmount: "349",
    fit: "For consultants delivering the work commercially to clients.",
  },
  {
    id: "studio",
    name: "Studio",
    price: "$749",
    priceAmount: "749",
    fit: "For teams standardizing delivery, training, and operations.",
  },
];
