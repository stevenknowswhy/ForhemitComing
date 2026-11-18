"use client";

export function FitSection() {
  return (
    <section className="legal-section fit-section">
      <div className="container">
        <h2 data-animate="fade-up">Who you are trusting</h2>

        <div className="fit-grid">
          <div className="fit-column good-fit" data-animate="slide-right">
            <h3>The person you are trusting with your client</h3>
            <p>
              Stefano Stokes — Founder &amp; CEO. I&apos;m the person you speak with first, the
              person who leads your client&apos;s transition, and the person accountable for
              coordinating the work through closing and handover. Forhemit has one principal.
              You work directly with me, supported by independent specialists where the
              transaction requires them.
            </p>
          </div>

          <div className="fit-column not-fit" data-animate="slide-left">
            <h3>A California Public Benefit Corporation</h3>
            <p>
              Forhemit is a California Public Benefit Corporation, based in San Francisco and
              working with founder-led businesses nationally. Every transition is stress-tested
              before it is structured under our Resilience Framework, and monitored for 24
              months after close under our 24-Month Early Warning System, so the client you
              send us is looked after after the signing, not just up to it.
            </p>
          </div>
        </div>

        <div className="limited-partnerships" data-animate="fade-up">
          <p>
            <strong>Forhemit was founded in 2026. We are new, and we say so.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
