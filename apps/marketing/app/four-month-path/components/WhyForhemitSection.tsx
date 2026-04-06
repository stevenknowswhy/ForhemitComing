const PILLARS = [
  {
    id: "post-close",
    icon: "◈",
    title: "Post-close stewardship",
    body: "The only exit advisor that stays after the wire hits. We steward your legacy through the critical first 24 months—not just planning your exit, but ensuring your business survives it.",
  },
  {
    id: "owner-first",
    icon: "◆",
    title: "Owner-first design",
    body: "Every decision is filtered through one question: does this protect the seller? From fair price guarantees to escrow-free closings paired with §1042/§1045 tax advantages, the structure exists to get you paid — fully and on time.",
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
        Beyond the Balance Sheet™: Why owners choose Forhemit
      </h2>
      <p className="fmp-section-lead">
        We don&apos;t just plan your exit. We ensure your business survives it. 
        While others disappear at closing, we steward your legacy through the critical first 24 months.
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
