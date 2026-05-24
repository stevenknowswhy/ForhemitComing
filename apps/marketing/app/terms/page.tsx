import type { Metadata } from "next";
import { TermsPageClient } from "./TermsPageClient";

const title = "Terms of Service | Forhemit";
const description =
  "Forhemit's terms of service governing the use of our website and employee ownership succession services.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
