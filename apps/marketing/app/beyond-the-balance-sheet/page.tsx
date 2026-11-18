import type { Metadata } from "next";
import { BeyondBalanceSheetPageClient } from "./BeyondBalanceSheetPageClient";

const title = "Beyond the Balance Sheet | Forhemit";
const description =
  "The most valuable things in a founder-led company — trust, craft, reputation, the people themselves — appear nowhere in its financial statements. The right exit is the one that prices them anyway.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function BeyondBalanceSheetPage() {
  return <BeyondBalanceSheetPageClient />;
}
