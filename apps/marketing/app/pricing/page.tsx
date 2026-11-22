import type { Metadata } from "next";
import { PricingPageClient } from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Self Guided Transition Service is $3,000 one-time — the complete toolkit for running your own transition. Custom Services run 3–5% of valuation, with a dedicated lead. The guarantee, the gates, and how we make money, in the open.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
