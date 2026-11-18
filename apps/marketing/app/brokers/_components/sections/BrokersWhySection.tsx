import { BROKER_PILLARS } from "../../constants";

export function BrokersWhySection() {
  return (
    <section id="brk-why" className="fmp-section fmp-why" aria-labelledby="brk-why-heading">
      <h2 id="brk-why-heading" className="fmp-section-title">
        The broker&apos;s arithmetic
      </h2>
      <p className="fmp-section-lead">
        You are paid at the closing table, or not at all. That is the structure of your business,
        and it shapes everything.
      </p>
      <div className="fmp-pillars-grid">
        {BROKER_PILLARS.map((p) => (
          <div key={p.id} className="fmp-pillar-shell">
            <div className="fmp-pillar-shell__glow" aria-hidden />
            <div className="fmp-pillar-card">
              <span className="fmp-pillar-icon" aria-hidden>
                {p.icon}
              </span>
              <h3 className="fmp-pillar-title">{p.title}</h3>
              <p className="fmp-pillar-body">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="fmp-section-lead">
        This page is about the listings where that shape is the problem — and the one buyer
        who does not need to be found.
      </p>
    </section>
  );
}
