"use client";

export function CostGlanceSection() {
  function scrollToFees(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("fmp-fees")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="fmp-cost-glance" className="fmp-section" aria-labelledby="fmp-cost-heading">
      <h2 id="fmp-cost-heading" className="fmp-section-title">
        Cost at a glance
      </h2>
      <p className="fmp-section-lead">
        Before diving into the detailed breakdown, here&apos;s the big picture.
      </p>
      <div className="fmp-cost-card">
        <div className="fmp-cost-card-inner">
          <p className="fmp-cost-range">3&ndash;5%</p>
          <p className="fmp-cost-of">of total deal value</p>
          <p className="fmp-cost-note">Typical total professional fees across all parties</p>
          <ul className="fmp-cost-points">
            <li>Most fees are paid by the company or trust &mdash; not you personally</li>
            <li>Your direct cost as seller: a fixed advisory fee agreed upfront</li>
            <li>No success fee, no percentage of the purchase price from your pocket</li>
          </ul>
          <span className="fmp-cta-shell fmp-cta-shell--inline">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <a href="#fmp-fees" className="fmp-cost-detail-link" onClick={scrollToFees}>
              See detailed fee breakdown &rarr;
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
