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
          <p className="fmp-cost-note">Forhemit&apos;s Custom Services fee</p>
          <ul className="fmp-cost-points">
            <li>Our fee for running the transition, set in a written fee document after independent valuation</li>
            <li>Professional partners are engaged and paid by you directly, at written estimates you approve first</li>
            <li>The full cost picture — our fee plus typical partner costs — is on our Pricing page</li>
          </ul>
          <span className="fmp-cta-shell fmp-cta-shell--inline">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <a href="#fmp-fees" className="fmp-cost-detail-link" onClick={scrollToFees}>
              See the full cost picture &rarr;
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
