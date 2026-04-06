export function FirstCallSection() {
  return (
    <section id="fmp-first-call" className="fmp-section" aria-labelledby="fmp-call-heading">
      <h2 id="fmp-call-heading" className="fmp-section-title">
        What happens on your first call
      </h2>
      <p className="fmp-section-lead">
        The 20-minute call isn&apos;t a sales pitch. Here&apos;s exactly what happens.
      </p>

      <div className="fmp-call-steps">
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>1</span>
          <div>
            <h3 className="fmp-call-step-title">We ask about your business</h3>
            <p>
              Revenue range, employee count, ownership structure, and your timeline for selling.
              About 5 minutes.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>2</span>
          <div>
            <h3 className="fmp-call-step-title">We share a preliminary price range</h3>
            <p>
              Based on comparable ESOP transactions, we give you a realistic range &mdash; not a
              promise, but a grounded starting point.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>3</span>
          <div>
            <h3 className="fmp-call-step-title">You decide if it&apos;s worth exploring</h3>
            <p>
              No commitment, no retainer, no follow-up pressure. If the numbers make sense, we
              discuss next steps. If not, we&apos;ll tell you why and what alternatives exist.
            </p>
          </div>
        </div>
      </div>

      <div className="fmp-call-prepare">
        <p className="fmp-call-prepare-label">What to have ready</p>
        <p>
          Last year&apos;s revenue, approximate EBITDA or net income, employee count, and your
          ownership percentage. That&apos;s all we need for the first conversation.
        </p>
      </div>
    </section>
  );
}
