import type { Metadata } from "next";
import { LegalPracticesClient } from "./LegalPracticesClient";

const title = "For Legal Practices | ESOP Advisory Partnership";
const description =
  "Partner with Forhemit to offer ESOP succession services to your clients. Legal expertise meets structured employee ownership transitions.";

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
