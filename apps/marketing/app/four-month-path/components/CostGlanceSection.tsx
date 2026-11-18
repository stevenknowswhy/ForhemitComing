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
          <p className="fmp-cost-of">of valuation</p>
          <p className="fmp-cost-note">Total transition fees</p>
          <ul className="fmp-cost-points">
            <li>One figure, covering the whole transition, set in writing before you sign anything</li>
            <li>That is the all-in total: Forhemit&apos;s work plus the third-party charges the transaction requires</li>
            <li>Itemized in the fee document, with who receives each charge</li>
          </ul>
          <span className="fmp-cta-shell fmp-cta-shell--inline">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <a href="#fmp-fees" className="fmp-cost-detail-link" onClick={scrollToFees}>
              See what the total covers &rarr;
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
