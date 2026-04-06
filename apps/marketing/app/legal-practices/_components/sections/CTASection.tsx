"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="legal-section cta-section" id="consultation">
      <div className="container">
        <div className="cta-content" data-animate="fade-up">
          <h2>Take the next step</h2>

          <div className="cta-options">
            <div className="cta-option primary" data-animate="slide-right">
              <div className="cta-option-badge">Recommended</div>
              <h3>Schedule a confidential Stewardship consultation</h3>
              <p>
                Spend 60–90 minutes with us mapping which of your clients are most vulnerable to
                transition risk and where a stewardship ESOP could be realistic.
              </p>
              <Link href="/introduction" className="cta-button magnetic">
                Request a Stewardship Consultation
              </Link>
              <span className="cta-note">Limited new firm partnerships each quarter</span>
            </div>

            <div className="cta-option secondary" data-animate="slide-left">
              <h3>Get your Client Transition Risk Snapshot</h3>
              <p>
                Start with a brief framework to categorize your top clients by age, intent, and
                vulnerability — and identify where you face the greatest concentration and exit risk.
              </p>
              <Link href="/introduction" className="cta-button outline magnetic">
                Request a Client Risk Snapshot
              </Link>
            </div>
          </div>

          <div className="cta-bottom-row">
            <div className="who-we-are-card" data-animate="slide-right">
              <h3>Who we are</h3>
              <p className="pbc-badge">California Public Benefit Corporation</p>
              <p className="stewardship-desc">
                We partner with law firms to convert closely held businesses into employee-owned
                companies, providing stewardship management and expertise as a{" "}
                <strong>long-term fiduciary partner, not a short-term flipper</strong>.
              </p>
              <div className="key-points">
                <span className="key-point">Not a law firm</span>
                <span className="key-point">Don&apos;t compete for legal work</span>
                <span className="key-point accent">Your role is protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
