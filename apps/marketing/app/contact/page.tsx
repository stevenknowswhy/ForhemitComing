import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact | Forhemit",
  description:
    "Start the free assessment or send a message. Your answers are confidential, saved for review by Stefano Stokes, and never shared.",
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
