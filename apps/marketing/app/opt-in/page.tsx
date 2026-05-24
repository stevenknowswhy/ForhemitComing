import type { Metadata } from "next";
import { OptInPageClient } from "./OptInPageClient";

const title = "Opt In | Forhemit Updates";
const description =
  "Stay informed about employee ownership trends, ESOP news, and Forhemit updates.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

export default function OptInPage() {
  return <OptInPageClient />;
}
