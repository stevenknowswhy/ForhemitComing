import { BROKER_NEEDS_FROM_YOU, BROKER_WORKLOAD_MEANING_ROWS } from "../../constants";

export function BrokersWorkloadSection() {
  return (
    <section id="brk-workload" className="fmp-section" aria-labelledby="brk-workload-heading">
      <h2 id="brk-workload-heading" className="fmp-section-title">
        You bring the founder. We build the buyer.
      </h2>
      <p className="fmp-section-lead">
        The division of work is the whole offer: your relationship and your knowledge of the
        business, our structure and execution.
      </p>

      <div
        className="brk-workload-answer-group"
        role="region"
        aria-label="What Forhemit does"
      >
        <div className="brk-workload-answer-row">
          <p className="fmp-call-prepare-label">What Forhemit does</p>
          <p className="brk-workload-answer-p">
            Forhemit structures the employee-ownership transition end to end: readiness first,
            where every transition is stress-tested under our Resilience Framework before the
            transaction is structured and the founder sees the results in writing; the
            independent valuation the price rests on; the structure and its financing; and the
            path to close in about four months.
          </p>
        </div>
        {BROKER_WORKLOAD_MEANING_ROWS.map((row) => (
          <div key={row.lead} className="brk-workload-answer-row">
            <p className="brk-workload-answer-p">
              <strong>{row.lead}</strong> {row.body}
            </p>
          </div>
        ))}
      </div>

      <h3 className="fmp-section-title brk-workload-needs-heading" id="brk-workload-needs">
        What you do
      </h3>
      <p className="fmp-section-lead">
        The part only you can do:
      </p>
      <div className="fmp-call-steps">
        {BROKER_NEEDS_FROM_YOU.map((line, i) => (
          <div key={`brk-need-${i}`} className="fmp-call-step">
            <span className="fmp-call-step-num" aria-hidden>
              {i + 1}
            </span>
            <div>
              <p>{line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
