"use client";

const milestones = [
  {
    period: "2023–2024",
    description:
      "Built AI and digital workforce solutions for government agencies—roots in operational excellence and continuity under pressure.",
  },
  {
    period: "2025",
    description:
      "Strategic pivot toward private markets with a deliberate focus on employee ownership and long-horizon stewardship.",
  },
  {
    period: "March 2026",
    description:
      "Launched Forhemit with an ESOP-centered transition and operating strategy.",
  },
] as const;

export function EvolutionSection() {
  return (
    <section
      className="about-section about-section-evolution about-section-alt"
      aria-labelledby="evolution-heading"
    >
      <div className="container">
        <div className="evolution-inner">
          <header className="evolution-header">
            <span className="about-eyebrow">Our evolution</span>
            <h2 id="evolution-heading">From then to now</h2>
            <p className="evolution-lead">
              Forhemit began with a focus on AI technology and digital infrastructure for municipal
              disaster response. Through that work, we gained deep operational expertise and saw
              firsthand how employee ownership drives better outcomes. Today, as{" "}
              <strong>Forhemit</strong>, we&apos;ve evolved to apply that same stewardship
              mindset to stewarding ESOP transitions and post-close operations.
            </p>
          </header>

          <div className="evolution-timeline-wrap">
            <h3 className="evolution-timeline-title">How we got here</h3>
            <ol className="evolution-timeline" aria-label="Forhemit company milestones">
              {milestones.map((item) => (
                <li key={item.period} className="evolution-milestone">
                  <div className="evolution-milestone-axis">
                    <span className="evolution-dot" aria-hidden />
                    <span className="evolution-period">{item.period}</span>
                  </div>
                  <p className="evolution-milestone-copy">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
