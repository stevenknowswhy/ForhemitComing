"use client";

export function UrgencySection() {
  return (
    <section className="legal-section urgency-section">
      <div className="container">
        <h2 data-animate="fade-up">
          The window is open — but it is not open indefinitely
        </h2>

        <div className="demographic-wave" data-animate="fade-up">
          <p className="wave-intro">The demographic wave is not theoretical:</p>
          <div className="wave-points">
            <div className="wave-point">
              <span className="wave-age">Early 60s</span>
              <span className="wave-status">In the decision zone right now</span>
            </div>
            <div className="wave-point">
              <span className="wave-age">3–5 years</span>
              <span className="wave-status">
                Most valuable owner-founders will have exited or drifted into reactive decisions
              </span>
            </div>
          </div>
        </div>

        <div className="urgency-factors" data-animate="fade-up">
          <p>Meanwhile:</p>
          <ul>
            <li>
              Private equity and consolidators are <strong>systematically courting</strong> them
            </li>
            <li>
              ESOPs are getting more attention — often from people who <strong>don&apos;t</strong>{" "}
              care about preserving your role
            </li>
            <li>
              The number of businesses that can sustainably support a stewardship ESOP is{" "}
              <strong>finite</strong>
            </li>
          </ul>
        </div>

        <div className="the-choice" data-animate="fade-up">
          <p>
            If you want to be the advisor who <strong>brings</strong> a credible, resilient option —
            not the one who finds out about the sale after it&apos;s signed — this is the time to
            act.
          </p>
        </div>
      </div>
    </section>
  );
}
