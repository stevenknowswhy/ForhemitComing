import { BROKER_NEEDS_FROM_YOU, BROKER_WORKLOAD_MEANING_ROWS } from "../../constants";

export function BrokersWorkloadSection() {
  return (
    <section id="brk-workload" className="fmp-section" aria-labelledby="brk-workload-heading">
      <h2 id="brk-workload-heading" className="fmp-section-title">
        Will this be more work for you?
      </h2>
      <p className="fmp-section-lead">
        You should know upfront how we use your time—before you screen a listing for fit.
      </p>

      <div
        className="brk-workload-answer-group"
        role="region"
        aria-label="Answer, process shape, and what it means for you"
      >
        <div className="brk-workload-answer-row">
          <p className="fmp-call-prepare-label">Answer</p>
          <p className="brk-workload-answer-p">
            <strong>No.</strong> We are not asking you to run two separate sell-side processes. You keep
            marketing the business your way; we build and run the ESOP track—lender, trustee, appraiser, ESOP
            counsel, and document flow—alongside what you already do. Most incremental effort sits with our
            team and the seller&apos;s advisors, not with re-inventing your book.
          </p>
        </div>
        <div className="brk-workload-answer-row">
          <p className="brk-workload-answer-p">
            <strong>No duplicate auction.</strong> Same data room discipline, aligned timelines, and one story
            to the seller. The ESOP path is parallel execution, not a competing broker process.
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
        What we need from you
      </h3>
      <p className="fmp-section-lead">
        Mostly coordination and access—not a second book of work:
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
