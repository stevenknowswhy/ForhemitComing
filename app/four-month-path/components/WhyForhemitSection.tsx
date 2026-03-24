const PILLARS = [
  {
    id: "owner-first",
    icon: "◆",
    title: "Owner-first design",
    body: "Every decision is filtered through one question: does this protect the seller? From fair price guarantees to escrow-free closings, the structure exists to get you paid — fully and on time.",
  },
  {
    id: "transparency",
    icon: "◇",
    title: "Full transparency",
    body: "No hidden fees, no surprise retainers, no jargon. You see every cost, every timeline, and every risk before you sign anything. This page is proof of that philosophy.",
  },
  {
    id: "one-team",
    icon: "▣",
    title: "One coordinated team",
    body: "Instead of hiring five separate firms and hoping they talk to each other, Forhemit quarterbacks the entire deal — bank, attorney, trustee, appraiser, and operations plan — so you have one point of contact.",
  },
];

export function WhyForhemitSection() {
  return (
    <section id="fmp-why" className="fmp-section fmp-why" aria-labelledby="fmp-why-heading">
      <h2 id="fmp-why-heading" className="fmp-section-title">
        Why owners choose Forhemit
      </h2>
      <p className="fmp-section-lead">
        We built Forhemit because most ESOP advisors make this harder than it needs to be.
        Here&apos;s what makes us different.
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
