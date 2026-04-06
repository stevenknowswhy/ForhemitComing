"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="brokers-cta" id="contact">
      <div className="container">
        <div className="cta-content" data-animate="fade-up">
          <span className="cta-eyebrow">Next Steps</span>
          <h2>Clearing Your Pipeline</h2>
          <p className="cta-subtitle">
            Your time is your inventory. Every month spent on a dead deal is a month you can&apos;t
            spend closing new ones. Scan your CRM right now. Do you have a listing with $750K–$3M
            EBITDA, 20 to 75 employees, and strong recurring cash flow that has been stalled for more
            than 6 months?
          </p>
          <p className="cta-lead">
            Let&apos;s schedule a brief call. I will provide a complimentary ESOP feasibility screen
            for your stalled listing. We don&apos;t need a commitment today; we just need a
            conversation about how to turn your unsellable inventory into closed commissions.
          </p>

          <div className="cta-actions">
            <Link href="/introduction?join=true" className="cta-button primary">
              <span className="btn-icon">📅</span>
              <span>Schedule a 15-Minute Pipeline Review</span>
            </Link>
          </div>

          <div className="cta-contact">
            <span>Or reach us directly:</span>
            <a href="mailto:brokers@forhemit.com">brokers@forhemit.com</a>
          </div>
        </div>
      </div>
    </section>
  );
}
