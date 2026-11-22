import type { Metadata } from "next";
import { BrokersPathClient } from "./BrokersPathClient";

const title = "For Brokers | Forhemit";
const description =
  "For business brokers: waiting for a buyer is one strategy. Making one is another. How Forhemit builds the buyer your founder will accept — the employees.";

export const metadata: Metadata = {
  title: "For Brokers",
  description,
  openGraph: {
    title,
    description,
  },
};

export default function BrokersPage() {
  return <BrokersPathClient />;
}
