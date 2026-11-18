const PILLARS = [
  {
    id: "fit",
    icon: "◈",
    title: "We tell you if it's not a fit.",
    body: "If your business doesn't meet the standard, we say so at the start — and name what would have to change.",
  },
  {
    id: "price",
    icon: "◆",
    title: "The price is set independently.",
    body: "An independent appraiser sets fair market value — one who works for neither side. Neither Forhemit nor the owner sets the price.",
  },
  {
    id: "fee",
    icon: "◇",
    title: "Our fee is agreed in advance.",
    body: "Total transition fees typically run 3–5% of valuation — one figure, covering the whole transition, set in writing before you sign anything.",
  },
  {
    id: "stay",
    icon: "▣",
    title: "We stay after the close.",
    body: "After closing, we're available on call for 4 to 12 months — check-ins, introductions, and questions — while the new employee-owners settle in.",
  },
];

export function WhyForhemitSection() {
  return (
    <section id="fmp-why" className="fmp-section fmp-why" aria-labelledby="fmp-why-heading">
      <h2 id="fmp-why-heading" className="fmp-section-title">
        Why owners choose Forhemit
      </h2>
      <p className="fmp-section-lead">
        Four commitments, each with a cost attached. If we cannot keep one, we
        would rather lose the engagement than break it quietly.
      </p>
      <div className="fmp-pillars-grid">
        {PILLARS.map((p) => (
          <div key={p.id} className="fmp-pillar-shell">
            <div className="fmp-pillar-shell__glow" aria-hidden />
            <div className="fmp-pillar-card">
              <span className="fmp-pillar-icon" aria-hidden>{p.icon}</span>
              <h3 className="fmp-pillar-title">{p.title}</h3>
              <p className="fmp-pillar-body">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
