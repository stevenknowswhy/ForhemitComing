"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="legal-section cta-section" id="consultation">
      <div className="container">
        <div className="cta-content" data-animate="fade-up">
          <h2>Start with a conversation between professionals</h2>

          <div className="cta-options">
            <div className="cta-option primary" data-animate="slide-right">
              <h3>Talk to us first</h3>
              <p>
                If you are an attorney, the first step is a direct conversation:
                contact@forhemit.com, (510) 768-7588, or the contact page. No client needs to
                be involved, and nothing about your client is needed, for that first call.
              </p>
              <Link
                href="/contact?contactType=partner&interest=legal"
                className="cta-button magnetic"
              >
                Start a Conversation
              </Link>
            </div>
          </div>

          <div className="cta-bottom-row">
            <div className="who-we-are-card" data-animate="slide-right">
              <h3>Who we are</h3>
              <p className="pbc-badge">California Public Benefit Corporation</p>
              <p className="stewardship-desc">
                Forhemit structures 100% employee-ownership transitions for founder-led
                businesses — and coordinates the work around your counsel, never instead of
                it.
              </p>
              <div className="key-points">
                <span className="key-point">Not a law firm</span>
                <span className="key-point">No legal services</span>
                <span className="key-point accent">No referral-fee or fee-splitting arrangements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
