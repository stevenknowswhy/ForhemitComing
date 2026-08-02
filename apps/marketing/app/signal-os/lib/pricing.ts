import {
  canonicalUrl,
  FOUNDING_DEADLINE_MS,
  FOUNDING_PRICE_VALID_UNTIL,
  tiers,
} from "../constants";

export function isFoundingPricingActive(nowMs: number) {
  return nowMs < FOUNDING_DEADLINE_MS;
}

export function buildProductJsonLd(foundingActive: boolean) {
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Signal OS",
    description:
      "A downloadable, local-first workstation for evidence-based AI visibility audits and client delivery.",
    brand: { "@type": "Brand", name: "Forhemit" },
    url: canonicalUrl,
  };

  if (!foundingActive) return product;
  return {
    ...product,
    offers: tiers.map((tier) => ({
      "@type": "Offer",
      name: `Signal OS ${tier.name}`,
      price: tier.priceAmount,
      priceCurrency: "USD",
      priceValidUntil: FOUNDING_PRICE_VALID_UNTIL,
      availability: "https://schema.org/InStock",
      url: `${canonicalUrl}#signal-editions`,
    })),
  };
}
