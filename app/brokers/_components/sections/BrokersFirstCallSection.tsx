import { BrokerFirstCallChecklistPdfLink } from "../BrokerFirstCallChecklistPdfLink";

export function BrokersFirstCallSection() {
  return (
    <section id="brk-first-call" className="fmp-section" aria-labelledby="brk-first-call-heading">
      <h2 id="brk-first-call-heading" className="fmp-section-title">
        What happens on the first call
      </h2>
      <p className="fmp-section-lead">
        Short, practical, and confidential. We are not here to pitch your listing to “our buyers.”
      </p>

      <div className="fmp-call-steps">
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>
            1
          </span>
          <div>
            <h3 className="fmp-call-step-title">You describe the deal</h3>
            <p>
              Revenue band, EBITDA or net income range, employee count, entity type, and where you are in
              market. If you already have a data room, we align on what we need in parallel.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>
            2
          </span>
          <div>
            <h3 className="fmp-call-step-title">We sanity-check ESOP fit</h3>
            <p>
              Bankability, timing, and whether dual-track is worth the effort for this seller. If it is not,
              we will say so—your credibility with the client matters.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>
            3
          </span>
          <div>
            <h3 className="fmp-call-step-title">Clear next steps</h3>
            <p>
              NDAs, who joins the next call (owner, CFO), and how we keep your buyer process and our ESOP
              build from stepping on each other.
            </p>
          </div>
        </div>
      </div>

      <div className="fmp-call-prepare">
        <p className="fmp-call-prepare-label">Have handy</p>
        <p>
          High-level financials, headcount, ownership cap table summary, and your timeline with buyers—if
          any.
        </p>
      </div>

      <div className="brk-first-call-checklist">
        <p className="brk-first-call-checklist-note">
          Want a prep list you can forward to your seller before the call?
        </p>
        <span className="fmp-cta-shell fmp-cta-shell--block">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <BrokerFirstCallChecklistPdfLink
            surface="brokers_first_call_checklist"
            className="fmp-btn fmp-btn-secondary"
          >
            Open first-call preparation checklist (PDF)
          </BrokerFirstCallChecklistPdfLink>
        </span>
      </div>
    </section>
  );
}
