import type { Metadata } from "next";
import { TermsPageClient } from "./TermsPageClient";

const title = "Terms of Use | Forhemit";
const description =
  "The terms governing use of the Forhemit website.";

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
