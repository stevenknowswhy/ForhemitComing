import type { Metadata } from "next";
import "@forhemit/shared/styles/wealth-managers.css";
import { WealthManagersPageClient } from "@forhemit/shared/pages/WealthManagersPageClient";

const title = "For Wealth Managers | Forhemit";
const description =
  "For wealth managers: raise succession before someone else sets the terms. How Forhemit works with the advisor who makes the introduction.";

export const metadata: Metadata = {
  title: "For Wealth Managers",
  description,
  openGraph: {
    title,
    description,
  },
};

export default function WealthManagersPage() {
  return <WealthManagersPageClient />;
}
