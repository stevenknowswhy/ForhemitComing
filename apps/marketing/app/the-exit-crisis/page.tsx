import type { Metadata } from "next";
import { TheExitCrisisPageClient } from "./TheExitCrisisPageClient";

const title = "The Exit Crisis | Forhemit";
const description =
  "A generation of founders is reaching retirement with no successor and too few buyers. Most businesses taken to market never sell at all — and the founders who learn that late have the fewest options left.";

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
