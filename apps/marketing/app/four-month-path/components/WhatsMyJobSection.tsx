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
              <li>Share your financials, headcount, and ownership structure for a confidential review</li>
              <li>Work through the tax treatment with your own tax advisor before anything is signed</li>
              <li>Keep running the business while the structure is built</li>
              <li>Be available on call for 4 to 12 months after close — check-ins, introductions, and questions, not working hands-on</li>
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
              <li>Commission the independent valuation from a qualified third-party appraiser</li>
              <li>Design the ESOP structure with ERISA counsel</li>
              <li>Prepare and place the lender-ready financing package</li>
              <li>Coordinate counsel, trustee, and appraiser through closing</li>
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
                <li>Become owners — shares are held in the ESOP trust and allocated to their individual accounts over time</li>
                <li>Receive a clear explanation of what they now hold, at closing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
