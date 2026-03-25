import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Forhemit team about ESOP transitions, partnerships, or general inquiries. We typically respond within 24–48 hours.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
