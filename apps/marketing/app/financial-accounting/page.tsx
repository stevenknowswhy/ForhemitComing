import type { Metadata } from "next";
import "@forhemit/shared/styles/financial-accounting.css";
import { FinancialAccountingClient } from "@forhemit/shared/pages/FinancialAccountingClient";

const title = "For Financial & Accounting Professionals | ESOP Advisory";
const description =
  "Forhemit partners with financial and accounting professionals to deliver ESOP succession services to founder-led businesses.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function FinancialAccountingPage() {
  return <FinancialAccountingClient />;
}
