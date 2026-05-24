import type { Metadata } from "next";
import { TheExitCrisisPageClient } from "./TheExitCrisisPageClient";

const title = "The Exit Crisis | Why Founders Need a Succession Plan";
const description =
  "With 50 sellers for every qualified buyer and 30-40% of businesses never selling, founders need a real succession path. Explore the exit crisis and employee ownership alternative.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function TheExitCrisisPage() {
  return <TheExitCrisisPageClient />;
}
