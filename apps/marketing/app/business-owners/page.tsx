import type { Metadata } from "next";
import { BusinessOwnersPageClient } from "./BusinessOwnersPageClient";

const title = "For Business Owners | 100% Employee Ownership Succession";
const description =
  "Transition your business to 100% employee ownership. Preserve your legacy, unlock Section 1042 tax benefits, and steward your company's future with Forhemit.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function BusinessOwnersPage() {
  return <BusinessOwnersPageClient />;
}
