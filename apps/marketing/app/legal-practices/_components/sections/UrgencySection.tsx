"use client";

import Link from "next/link";

export function UrgencySection() {
  return (
    <section className="legal-section urgency-section">
      <div className="container">
        <p data-animate="fade-up">
          Forhemit is a California Public Benefit Corporation, founded 2026, based at 55 9th
          Street, San Francisco. Stefano Stokes, Founder &amp; CEO.
        </p>

        <p data-animate="fade-up">
          For the other professionals in your client&apos;s corner:{" "}
          <Link href="/brokers">Brokers</Link> · <Link href="/accounting-firms">CPAs</Link> ·{" "}
          <Link href="/wealth-managers">Wealth Managers</Link>
        </p>
      </div>
    </section>
  );
}
