"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="legal-hero">
      <div className="container">
        <div className="legal-hero-content">
          <span className="legal-eyebrow" data-animate="fade-up">
            For Legal Practices
          </span>
          <h1 className="legal-title" data-animate="fade-up" data-delay="100">
            Turn the Great Wealth Transfer into Your Firm&apos;s{" "}
            <span className="highlight">Most Defensible Advantage</span>
          </h1>
          <p className="legal-lead" data-animate="fade-up" data-delay="200">
            Protect the clients you&apos;ve spent a career winning — before someone else owns the relationship
          </p>
          <div className="legal-hero-cta" data-animate="fade-up" data-delay="300">
            <Link href="#consultation" className="cta-button magnetic">
              Schedule a Confidential Consultation
            </Link>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
