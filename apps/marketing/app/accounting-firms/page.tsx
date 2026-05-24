import type { Metadata } from "next";
import { AccountingFirmsClient } from "./AccountingFirmsClient";

const title = "For Accounting Firms | ESOP Advisory Services";
const description =
  "Partner with Forhemit to offer ESOP succession planning to your business-owner clients. Tax-advantaged employee ownership transitions with post-close stewardship.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function AccountingFirmsPage() {
  return <AccountingFirmsClient />;
}
