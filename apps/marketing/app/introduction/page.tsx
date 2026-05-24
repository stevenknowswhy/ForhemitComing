import type { Metadata } from "next";
import { IntroductionClient } from "./IntroductionClient";

const title = "Introduction to Forhemit | Employee Ownership Succession";
const description =
  "Learn how Forhemit helps founder-led businesses transition to 100% employee ownership with ESOP structuring and post-close stewardship.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function IntroductionPage() {
  return <IntroductionClient />;
}
