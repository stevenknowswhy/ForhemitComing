import type { Metadata } from "next";
import { BrokersPathClient } from "./BrokersPathClient";

const title = "For Brokers: Close More ESOP Deals with Forhemit | Beyond the Balance Sheet™";
const description =
  "The only exit advisor that stays after the wire hits. Parallel ESOP path for your listings: more assured closings, full fair value at funding, negotiating leverage with private buyers, and ~90–120 day execution when the file is clean. Employees are the buyer—we facilitate with post-close stewardship built in.";

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
