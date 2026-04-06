import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Forhemit team about ESOP transitions, partnerships, or general inquiries. We typically respond within 24–48 hours.",
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="contact-page-outer" style={{ minHeight: "40vh" }} aria-busy="true" />
      }
    >
      <ContactPageClient />
    </Suspense>
  );
}
