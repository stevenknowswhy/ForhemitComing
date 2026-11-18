import type { Metadata } from "next";
import { FAQPageClient } from "./FAQPageClient";

const title = "Frequently Asked Questions | ESOP Succession";
const description =
  "Common questions about selling your business to your employees, Section 1042 tax deferral, and how Forhemit works with founders, brokers, and advisors.";

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
