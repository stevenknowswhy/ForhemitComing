import { BROKER_OUTCOME_CARDS } from "../../constants";

export function DualTrackOutcomesSection() {
  return (
    <section id="brk-outcomes" className="fmp-section fmp-why" aria-labelledby="brk-outcomes-heading">
      <h2 id="brk-outcomes-heading" className="fmp-section-title">
        The choice
      </h2>
      <p className="fmp-section-lead">
        Waiting, or making it happen.
      </p>
      <div className="fmp-pillars-grid">
        {BROKER_OUTCOME_CARDS.map((card) => (
          <div key={card.id} className="fmp-pillar-shell">
            <div className="fmp-pillar-shell__glow" aria-hidden />
            <div className="fmp-pillar-card">
              <span className="fmp-pillar-icon" aria-hidden>
                {card.icon}
              </span>
              <h3 className="fmp-pillar-title">{card.title}</h3>
              <p className="fmp-pillar-body">{card.subtitle}</p>
              <ul className="brk-outcome-bullets">
                {card.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="fmp-section-lead">
        You cannot manufacture a buyer the founder will accept. But you can be the broker who
        stopped waiting for one.
      </p>
    </section>
  );
}
