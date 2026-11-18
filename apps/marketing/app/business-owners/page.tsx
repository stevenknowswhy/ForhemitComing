import type { Metadata } from "next";
import { ogMetadata } from "@/lib/og";
import { BusinessOwnersPageClient } from "./BusinessOwnersPageClient";

const title = "For Business Owners | 100% Employee Ownership Succession";
const description =
  "For founders weighing what comes next: who qualifies, how the Section 1042 tax-deferred treatment works, what you risk, and what your life looks like after close.";

export const metadata: Metadata = {
  title,
  description,
  ...ogMetadata({
    file: "og-business-owners.png",
    title,
    description,
    path: "/business-owners",
  }),
};

export default function BusinessOwnersPage() {
  return <BusinessOwnersPageClient />;
}
