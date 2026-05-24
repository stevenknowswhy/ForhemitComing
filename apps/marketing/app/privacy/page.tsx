import type { Metadata } from "next";
import { PrivacyPageClient } from "./PrivacyPageClient";

const title = "Privacy Policy | Forhemit";
const description =
  "How Forhemit collects, uses, and protects your personal information. Our commitment to data privacy and confidentiality.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
