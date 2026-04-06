import { BROKER_PROCESS_STEPS } from "../../constants";

export function BrokersProcessSection() {
  return (
    <section id="brk-process" className="fmp-section" aria-labelledby="brk-process-heading">
      <h2 id="brk-process-heading" className="fmp-section-title">
        How the parallel process runs
      </h2>
      <p className="fmp-section-lead">
        We are not asking you to pause marketing. We ask for coordination—shared NDAs, aligned data
        requests, and one honest timeline so your seller is not torn between two sloppy processes.
      </p>
      <div className="fmp-call-steps">
        {BROKER_PROCESS_STEPS.map((s) => (
          <div key={s.num} className="fmp-call-step">
            <span className="fmp-call-step-num" aria-hidden>
              {s.num}
            </span>
            <div>
              <h3 className="fmp-call-step-title">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
