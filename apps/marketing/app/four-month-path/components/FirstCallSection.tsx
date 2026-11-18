export function FirstCallSection() {
  return (
    <section id="fmp-first-call" className="fmp-section" aria-labelledby="fmp-call-heading">
      <h2 id="fmp-call-heading" className="fmp-section-title">
        What happens first
      </h2>
      <p className="fmp-section-lead">
        No sales pitch. The path starts with the free assessment &mdash;
        here&apos;s exactly what happens.
      </p>

      <div className="fmp-call-steps">
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>1</span>
          <div>
            <h3 className="fmp-call-step-title">Start with the free assessment</h3>
            <p>
              Five yes/no questions against the standard &mdash; the same
              screen we apply to every business. Two minutes, and an honest
              answer about whether your business fits the path.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>2</span>
          <div>
            <h3 className="fmp-call-step-title">See the documents before you sign anything</h3>
            <p>
              Our one-page fee document &mdash; every charge, who receives
              it, and when &mdash; and the 120-Day Roadmap are provided at
              assessment, so you can hold us to both.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>3</span>
          <div>
            <h3 className="fmp-call-step-title">Month 1 tells you if the fit is real</h3>
            <p>
              A confidential review of financials, headcount, and ownership
              structure, ending in a plain-language feasibility summary you
              can share with your own advisors. If the fit is wrong, we say
              so now, not in month three.
            </p>
          </div>
        </div>
      </div>

      <div className="fmp-call-prepare">
        <p className="fmp-call-prepare-label">What to have ready</p>
        <p>
          Nothing for the assessment. For Month 1: your financials, headcount,
          and ownership structure &mdash; shared under NDA, in a confidential
          review.
        </p>
      </div>
    </section>
  );
}
