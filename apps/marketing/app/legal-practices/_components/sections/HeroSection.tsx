"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="legal-hero">
      <div className="container">
        <div className="legal-hero-content">
          <span className="legal-eyebrow" data-animate="fade-up">
            For attorneys
          </span>
          <h1 className="legal-title" data-animate="fade-up" data-delay="100">
            Don&apos;t catch up to your client&apos;s exit.{" "}
            <span className="highlight">Start it.</span>
          </h1>
          <p className="legal-lead" data-animate="fade-up" data-delay="200">
            Traditionally, your client meets a broker, a private equity firm, or a buyer first
            — and you meet the deal after a letter of intent has already set its shape. There
            is another sequence: raise employee ownership first, and your client sells 100% of
            the company to the people who work in it, at full price — and stays your client.
          </p>
          <div className="legal-hero-cta" data-animate="fade-up" data-delay="300">
            <Link
              href="/contact?contactType=partner&interest=legal"
              className="cta-button magnetic"
            >
              Start a Conversation
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
