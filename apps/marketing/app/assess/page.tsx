import type { Metadata } from "next";
import { AssessPageClient } from "./AssessPageClient";

const title = "ESOP Feasibility Assessment | Free 2-Minute Check";
const description =
  "Take Forhemit's free ESOP feasibility assessment. Find out if your business qualifies for a tax-free employee ownership transition in 2 minutes.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function AssessPage() {
  return <AssessPageClient />;
}
