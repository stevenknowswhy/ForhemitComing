import type { Metadata } from "next";
import { BeyondBalanceSheetPageClient } from "./BeyondBalanceSheetPageClient";

const title = "Beyond the Balance Sheet | Employee Ownership Transitions";
const description =
  "Forhemit's approach to employee ownership goes beyond financial structuring. Post-close stewardship ensures continuity for founders, employees, and communities.";

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
