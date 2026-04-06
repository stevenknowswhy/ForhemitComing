"use client";

import Link from "next/link";
import { ContactFormExperience } from "../components/contact/ContactFormExperience";
import "./contact-page.css";

export function ContactPageClient() {
  return (
    <div className="contact-page-outer">
      <div className="contact-page-shell">
        <ContactFormExperience source="contact-page" variant="page" />
      </div>
      <p className="contact-page-footnote">
        Prefer the guided menu?{" "}
        <Link href="/introduction">Visit the introduction hub</Link>.
      </p>
    </div>
  );
}
