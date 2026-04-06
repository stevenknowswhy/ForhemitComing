"use client";

import { DealRadar } from "@/components/visualizations/DealRadar";
import { DataTicker } from "@/components/visualizations/DataTicker";

export function HeroSection() {
  return (
    <>
      <section className="brokers-hero">
        <div className="hero-grid">
          <div className="hero-content" data-animate="fade-up">
            <div className="hero-eyebrow">
              <span className="eyebrow-pulse" />
              <span>For Business Brokers & M&A Advisors</span>
            </div>
            <h1 className="hero-title">
              Stop Losing Commissions in the <span className="highlight">$3M–$15M &quot;Dead Zone&quot;</span>
            </h1>
            <p className="hero-subtitle">
              We provide a fully financed, 90-day ESOP exit for your stalled 20+ employee listings.
              You keep 100% of your commission.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Commission Kept</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">90-120</span>
                <span className="stat-label">Days to Close</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">20+</span>
                <span className="stat-label">Employee Threshold</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" data-animate="fade-in">
            <DealRadar />
          </div>
        </div>

        <DataTicker />

        <div className="scroll-indicator" data-animate="fade-up">
          <div className="indicator-line" />
          <span>The Bottom Line</span>
        </div>
      </section>
    </>
  );
}
