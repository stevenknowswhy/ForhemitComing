import type { Metadata } from "next";
import "./wealth-managers.css";
import { WealthManagersPageClient } from "@forhemit/shared/pages/WealthManagersPageClient";

const title = "For Wealth Managers | ESOP Client Opportunities";
const description =
  "Help your business-owner clients explore 100% employee ownership as a tax-advantaged exit strategy with Forhemit's ESOP structuring and stewardship.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function WealthManagersPage() {
  return <WealthManagersPageClient />;
}
