import type { Metadata } from "next";
import { AppraisersPageClient } from "./AppraisersPageClient";

const title = "For Appraisers | ESOP Valuation Partnerships";
const description =
  "Forhemit partners with independent appraisers for ESOP valuations. Structured transactions with fair market value assessments for employee ownership deals.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function AppraisersPage() {
  return <AppraisersPageClient />;
}
