import { BROKER_PILLARS } from "../../constants";

export function BrokersWhySection() {
  return (
    <section id="brk-why" className="fmp-section fmp-why" aria-labelledby="brk-why-heading">
      <h2 id="brk-why-heading" className="fmp-section-title">
        What&apos;s in it for you
      </h2>
      <p className="fmp-section-lead">
        You are paid when transactions close. A credible ESOP track reduces last-minute failure, protects
        your fee, and gives your client a fair, bank-backed alternative—not a hollow listing story.
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
    </section>
  );
}
