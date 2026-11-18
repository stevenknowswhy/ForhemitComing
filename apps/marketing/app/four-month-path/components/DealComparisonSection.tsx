const SECTION_1042_CHECKLIST = [
  "Your company is a closely held C corporation. S corporation stock does not qualify under current law.",
  "The ESOP owns at least 30% of the company immediately after the sale. Every Forhemit transition is 100%, so this condition is met by design.",
  "You have held your stock for at least three years.",
  "You reinvest the proceeds within the window, which opens three months before the sale and closes twelve months after it.",
];

export function DealComparisonSection() {
  return (
    <section id="fmp-comparison" className="fmp-section dc-section" aria-labelledby="dc-heading">
      <h2 id="dc-heading" className="fmp-section-title">
        The tax piece: Section 1042, in plain terms
      </h2>
      <p className="fmp-section-lead">
        When you sell to an ESOP, federal law may let you defer the capital
        gains tax on the sale. That provision is Section 1042. Deferral is not
        forgiveness, and it is not automatic. You sell your stock to the
        employee trust, then reinvest the proceeds in qualified replacement
        property, meaning securities of U.S. operating companies, inside a set
        window. The tax stays deferred for as long as you hold that property.
        The deferral is not forgiveness: the deferred gain reduces your basis
        in the qualified replacement property, and tax comes due when you sell
        that property. It applies only when every one of these holds:
      </p>
      <ul className="fmp-elig-list" aria-label="Section 1042 conditions">
        {SECTION_1042_CHECKLIST.map((item) => (
          <li key={item} className="fmp-elig-item">
            <span className="fmp-elig-label">{item}</span>
          </li>
        ))}
      </ul>
      <p className="fmp-section-lead">
        Whether Section 1042 fits your situation is a Month 2 question,
        settled with your own tax advisor, not on a website. What we will
        never call it is tax-free.
      </p>
    </section>
  );
}
