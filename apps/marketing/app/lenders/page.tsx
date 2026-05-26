import type { Metadata } from "next";
import "@forhemit/shared/styles/lenders.css";
import { LendersPageClient } from "@forhemit/shared/pages/LendersPageClient";

const title = "For Lenders | ESOP Financing Opportunities";
const description =
  "Forhemit connects lenders with qualified ESOP transactions. Independent valuations, lender-ready packaging, and structured financing for employee ownership deals.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function LendersPage() {
  return <LendersPageClient />;
}
