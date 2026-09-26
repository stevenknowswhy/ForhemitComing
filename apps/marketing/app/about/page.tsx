import type { Metadata } from "next";
import { ogMetadata } from "@/lib/og";
import { AboutPageClient } from "./AboutPageClient";

const title = "About Forhemit | Employee Ownership Succession";
const description =
  "Forhemit is a California Public Benefit Corporation helping founder-led businesses transition to 100% employee ownership through ESOP structuring and post-close stewardship.";

export const metadata: Metadata = {
  title,
  description,
  ...ogMetadata({
    file: "og-about.png",
    title,
    description,
    path: "/about",
  }),
};

export default function AboutPage() {
  return <AboutPageClient />;
}
