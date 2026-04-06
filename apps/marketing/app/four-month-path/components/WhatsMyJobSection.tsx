export function WhatsMyJobSection() {
  return (
    <section id="fmp-roles" className="fmp-section fmp-roles" aria-labelledby="fmp-roles-heading">
      <h2 id="fmp-roles-heading" className="fmp-section-title">
        What&apos;s my job in all of this?
      </h2>
      <p className="fmp-section-lead">
        A simple split so you know what you&apos;re signing up for—and what you&apos;re not.
      </p>

      <div className="fmp-roles-grid">
        <div className="fmp-role-shell">
          <div className="fmp-role-shell__glow" aria-hidden />
          <div className="fmp-role-card">
            <div className="fmp-role-card__head">
              <h3 className="fmp-role-title">What you do</h3>
            </div>
            <ul className="fmp-role-list">
              <li>Answer questions about your business (2–3 meetings, ~30 minutes each)</li>
              <li>Provide last 3 years of financials (tax returns, P&amp;Ls)</li>
              <li>Keep running the business normally (don&apos;t let it slide)</li>
              <li>Be willing to offer guidance for 6 - 12 months</li>
            </ul>
          </div>
        </div>
        <div className="fmp-role-shell">
          <div className="fmp-role-shell__glow" aria-hidden />
          <div className="fmp-role-card fmp-role-card--brand">
            <div className="fmp-role-card__head">
              <h3 className="fmp-role-title">What Forhemit does</h3>
              <p className="fmp-role-kicker">Everything else.</p>
            </div>
            <ul className="fmp-role-list fmp-role-list--forhemit">
              <li>Coordinate with banks and lenders on your behalf</li>
              <li>Run employee training and readiness</li>
              <li>Manage legal documents end to end</li>
              <li>Build the operations plan that shows the business can run without you</li>
            </ul>
          </div>
        </div>
        <div className="fmp-role-shell">
          <div className="fmp-role-shell__glow" aria-hidden />
          <div className="fmp-role-card">
            <div className="fmp-role-card__head">
              <h3 className="fmp-role-title">What the employees do</h3>
            </div>
            <ul className="fmp-role-list">
              <li>Keep working (their job doesn&apos;t change day-to-day)</li>
            </ul>
            <div className="fmp-role-subsection">
              <p className="fmp-role-after-setup" id="fmp-role-employees-after-label">
                After everything is set up:
              </p>
              <ul className="fmp-role-list" aria-labelledby="fmp-role-employees-after-label">
                <li>Attend 2 training sessions on how their ownership works</li>
                <li>Elect a trustee to represent them in the deal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
