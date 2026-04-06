import type { Metadata } from "next";
import { FourMonthPathClient } from "./FourMonthPathClient";

const title = "Your 4-Month ESOP Path | Beyond the Balance Sheet™";
const description =
  "Traditional sale: 12-18 months. Forhemit ESOP: 4 months. Month-by-month timeline from fair price to close with post-close stewardship built in. The fastest path to a funded exit that preserves your legacy.;";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function FourMonthPathPage() {
  return <FourMonthPathClient />;
}
