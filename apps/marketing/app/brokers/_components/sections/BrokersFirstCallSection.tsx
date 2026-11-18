export function BrokersFirstCallSection() {
  return (
    <section id="brk-first-call" className="fmp-section" aria-labelledby="brk-first-call-heading">
      <h2 id="brk-first-call-heading" className="fmp-section-title">
        What happens on the first call
      </h2>
      <p className="fmp-section-lead">
        Short, practical, and confidential — and no client name is needed.
      </p>

      <div className="fmp-call-steps">
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>
            1
          </span>
          <div>
            <h3 className="fmp-call-step-title">You describe the business</h3>
            <p>
              The business and the situation — the listing&apos;s history, the buyers the founder
              has refused, where things stand. No name needed, and nothing about your client is
              required for that first conversation.
            </p>
          </div>
        </div>
        <div className="fmp-call-step">
          <span className="fmp-call-step-num" aria-hidden>
            2
          </span>
          <div>
            <h3 className="fmp-call-step-title">We screen it together</h3>
            <p>
              Against the qualification standard on this page — the same 18-point check. If it is
              not a fit, you hear that fast, with the reasons, in terms you can take back to your
              client.
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
              Only then is your client approached — with you in the room, and the option
              presented as what it is: a buyer they already know.
            </p>
          </div>
        </div>
      </div>

      <div className="fmp-call-prepare">
        <p className="fmp-call-prepare-label">Have handy</p>
        <p>
          Nothing formal. If you have already run the business against the 18-point check above,
          bring the result — it is the fastest way into the conversation.
        </p>
      </div>

      <div className="brk-first-call-checklist">
        <p className="brk-first-call-checklist-note">
          Haven&apos;t screened the business yet?
        </p>
        <span className="fmp-cta-shell fmp-cta-shell--block">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <a href="#brk-screening" className="fmp-btn fmp-btn-primary">
            Run the 18-point check
          </a>
        </span>
        <p className="brk-screening-description">
          The same screen we run on a first call — six hard gates plus the two readiness groups.
          Nothing you check is collected or stored.
        </p>
      </div>
    </section>
  );
}
