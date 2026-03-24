import type { Metadata } from "next";
import { BrokersPathClient } from "./BrokersPathClient";

const title = "For Brokers & M&A Advisors | Dual-Track ESOP | Forhemit";
const description =
  "Parallel ESOP path for your listings: more assured closings, full fair value at funding, negotiating leverage with private buyers, and ~90–120 day execution when the file is clean. Employees are the buyer—we facilitate.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function BrokersPage() {
  return <BrokersPathClient />;
}
