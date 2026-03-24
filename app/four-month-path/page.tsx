import type { Metadata } from "next";
import { FourMonthPathClient } from "./FourMonthPathClient";

const title = "Your 4-Month ESOP Path";
const description =
  "Month-by-month timeline from fair price to close: checkpoints, what you do vs Forhemit, and a downloadable 120-day roadmap for advisors.";

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
