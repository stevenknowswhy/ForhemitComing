const WHERE_THE_TOTAL_GOES = [
  "Transition oversight across all four months",
  "ESOP implementation and coordination of counsel, trustee, and appraiser",
  "The third-party charges the transaction requires \u2014 valuation, trustee, and ESOP counsel \u2014 itemized in the same figure, with who receives each one",
  "Fiduciary governance setup for the new ownership structure",
  "Ownership culture \u2014 helping employees understand and value what they own",
  "Repurchase planning so future obligations never surprise the company",
];

const PARTNER_COMPENSATION_DISCLAIMER =
  "We do not receive any money or anything else of value \u2014 monetary or non-monetary \u2014 from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals.";

export function FeeTransparencyContent() {
  return (
    <div className="ft-wrap">
      <div className="ft-context">
        <h3 className="ft-context-title">What it costs, said plainly.</h3>
        <p className="ft-context-body">
          Total transition fees typically run 3&ndash;5% of valuation &mdash;
          one figure, covering the whole transition, set in writing before you
          sign anything. That is the all-in total: Forhemit&rsquo;s work plus
          the third-party charges the transaction requires, itemized in the
          fee document with who receives each charge.
        </p>
      </div>

      <div className="ft-phases">
        <div className="ft-phase ft-phase--open">
          <div className="ft-phase-hd-text">
            <span className="ft-phase-label">Where the total goes</span>
          </div>
          <div className="ft-phase-body">
            {WHERE_THE_TOTAL_GOES.map((item) => (
              <div key={item} className="ft-fee-row">
                <div className="ft-fee-row-top">
                  <span className="ft-fee-name">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ft-totals">
        <p className="ft-totals-typical">
          <strong>ESOP Fee Transparency.</strong> Our one-page fee document
          &mdash; every charge, who receives it, and when &mdash; is shared in
          full during the first assessment call, before you sign anything.
        </p>
        <p className="ft-totals-note">
          <strong>The 120-Day Roadmap.</strong> The week-by-week version of
          the four-month path, with owners named for every step, is likewise
          provided at assessment &mdash; so you can hold us to it.
        </p>
      </div>

      <p className="ft-footer-note">
        {PARTNER_COMPENSATION_DISCLAIMER} The professionals a transition
        requires &mdash; appraiser, trustee, counsel, lenders &mdash; are
        recommendations, not requirements: you are free to use your own
        professionals, or change any professional we recommend, at any time.
      </p>
    </div>
  );
}
