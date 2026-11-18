import type { Metadata } from "next";
import { LegalPracticesClient } from "./LegalPracticesClient";

const title = "For Attorneys | Forhemit";
const description =
  "For attorneys: raise employee ownership before a broker or buyer sets the terms. How Forhemit works with the attorney who makes the introduction.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function LegalPracticesPage() {
  return <LegalPracticesClient />;
}
