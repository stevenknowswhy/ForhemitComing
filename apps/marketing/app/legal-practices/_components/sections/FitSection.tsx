"use client";

export function FitSection() {
  return (
    <section className="legal-section fit-section">
      <div className="container">
        <h2 data-animate="fade-up">Is this right for your firm?</h2>

        <div className="fit-grid">
          <div className="fit-column good-fit" data-animate="slide-right">
            <h3>You&apos;re likely a strong fit if:</h3>
            <ul>
              <li>
                You have <strong>10+ closely held business clients</strong> whose owners are 55+ and
                important to your firm&apos;s economics
              </li>
              <li>
                You worry that a traditional sale would lead to{" "}
                <strong>significant loss of work</strong>
              </li>
              <li>
                You value your clients&apos; <strong>employees and communities</strong>, not just their
                deal size
              </li>
              <li>
                You&apos;re open to a <strong>strategic, long-term partnership</strong>, not a one-off
                transaction
              </li>
            </ul>
          </div>

          <div className="fit-column not-fit" data-animate="slide-left">
            <h3>You&apos;re probably not a fit if:</h3>
            <ul>
              <li>
                Your focus is mainly <strong>one-off, high-volume deal execution</strong>
              </li>
              <li>
                You see clients purely as <strong>files and matters</strong>, not people whose
                legacies you&apos;re helping shape
              </li>
              <li>
                You&apos;re looking for <strong>immediate, high-volume referrals</strong> rather than
                carefully curated high-impact engagements
              </li>
            </ul>
          </div>
        </div>

        <div className="limited-partnerships" data-animate="fade-up">
          <p>
            Because our stewardship model is hands-on and resource-intensive, we{" "}
            <strong>intentionally partner with only a small number of law firms</strong> each year.
          </p>
        </div>
      </div>
    </section>
  );
}
