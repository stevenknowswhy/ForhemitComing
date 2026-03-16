"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="about-section faq-cta-section">
      <div className="container">
        <div className="faq-cta-card">
          <div className="faq-cta-icon">
            <MessageCircle size={32} strokeWidth={1.5} />
          </div>
          <h2>Still have questions?</h2>
          <p>
            We&apos;re here to help. Reach out and our team will get back to you with answers
            tailored to your specific situation.
          </p>
          <Link href="/introduction" className="faq-cta-button">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
