const WHERE_THE_TOTAL_GOES = [
  "Transition oversight across the 120 days",
  "ESOP implementation and coordination of counsel, trustee, and appraiser",
  "Coordination of the third-party professionals the transaction requires \u2014 valuation, trustee, and ESOP counsel \u2014 whose fees you agree with them directly, after a written estimate you approve",
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
          Forhemit&rsquo;s Custom Services fee is 3&ndash;5% of the independent valuation, set in a written fee document after that valuation. It is our fee for running your transition. The independent professionals your transition needs &mdash; attorney, valuation firm, trustee, lender, administrator &mdash; are engaged by you directly and paid by you directly, each after a written estimate you approve. Their fees are not included in our 3&ndash;5%, and we publish what they typically add on our Pricing page, because you should see the whole cost before you start, not after.
        </p>
      </div>

      <div className="ft-phases">
        <div className="ft-phase ft-phase--open">
          <div className="ft-phase-hd-text">
            <span className="ft-phase-label">Where our fee goes</span>
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
          <strong>The 120-Day Roadmap.</strong> The week-by-week version of the 120-day path, with owners named for every step, is likewise
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
