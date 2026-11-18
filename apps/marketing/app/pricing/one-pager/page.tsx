import type { Metadata } from "next";
import { OnePagerClient } from "./OnePagerClient";

export const metadata: Metadata = {
  title: "Pricing One-Pager | Forhemit",
  description:
    "Both Forhemit offers, the guarantee, and the gates on a single printable page — for a spouse, a CPA, or a co-owner.",
};

export default function PricingOnePagerPage() {
  return <OnePagerClient />;
}
