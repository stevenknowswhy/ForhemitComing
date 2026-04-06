import { BROKER_OUTCOME_CARDS } from "../../constants";

export function DualTrackOutcomesSection() {
  return (
    <section id="brk-outcomes" className="fmp-section fmp-why" aria-labelledby="brk-outcomes-heading">
      <h2 id="brk-outcomes-heading" className="fmp-section-title">
        Three outcomes you can explain to your seller
      </h2>
      <p className="fmp-section-lead">
        Dual-track is not “pick ESOP or M&amp;A.” It is <strong>run the market</strong> while{" "}
        <strong>a financed employee purchase is ready</strong> if the market disappoints—or while you use it
        as leverage while buyers behave.
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
    </section>
  );
}
