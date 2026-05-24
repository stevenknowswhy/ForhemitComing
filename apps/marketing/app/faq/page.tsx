import type { Metadata } from "next";
import { FAQPageClient } from "./FAQPageClient";

const title = "Frequently Asked Questions | ESOP Succession";
const description =
  "Common questions about ESOP structuring, employee ownership transitions, Section 1042 tax deferral, and Forhemit's post-close stewardship model.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
