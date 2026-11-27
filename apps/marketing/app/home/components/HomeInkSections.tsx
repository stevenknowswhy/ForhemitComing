import Link from "next/link";
import { HomeInkClosing } from "./HomeInkClosing";

/**
 * Ink homepage body sections, translated 1:1 from the approved prototype:
 * counters band → third-option comparison → proof cards → how it works →
 * leave on your own terms → founder statement (three blocks, one row) →
 * closing CTA. Copy is verbatim from the prototype, including Stefano's
 * 2026-11-27 edits ("Four steps. Four Months.", "You keep control", the
 * terms lede, and the three-block founder statement).
 */
export function HomeInkSections() {
  return (
    <>
      {/* Counters band — only the four ruled numbers */}
      <div className="ink-counters">
        <div className="ink-wrap">
          <div className="ink-counters-grid">
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="120">120</span>
              </div>
              <p className="ink-lbl">days, start to close — the transition clock</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="4">4</span>
              </div>
              <p className="ink-lbl">gates, each one verified before the next begins</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span data-count="100">100</span>
                <span className="ink-unit">%</span>
              </div>
              <p className="ink-lbl">employee-owned at close — your people own it all</p>
            </div>
            <div className="ink-counter ink-reveal">
              <div className="ink-num">
                <span className="ink-unit">$</span>
                <span data-count="3000" data-format="comma">
                  3,000
                </span>
              </div>
              <p className="ink-lbl">Self Guided, flat — the map, the documents, the support</p>
            </div>
          </div>
        </div>
      </div>

      {/* The third option */}
      <section className="ink-light ink-section-pad" id="options">
        <div className="ink-wrap">
          <p className="ink-kicker ink-reveal">Your options</p>
          <h2 className="ink-reveal">Every owner hears two options. There are three.</h2>
          <p className="ink-section-lede ink-reveal">
            Selling a business you built is not only a financial decision. Here is what each path
            actually does — to the company, to the people, and to you.
          </p>
          <div className="ink-compare-grid">
            <article className="ink-compare-card ink-reveal">
              <h3>Sell to a broker or stranger</h3>
              <ul>
                <li>
                  <b>The business</b>Listed on the open market. The buyer is whoever bids — often a
                  competitor, sometimes nobody.
                </li>
                <li>
                  <b>The people</b>Your employees find out late, if at all. Key people often leave.
                </li>
                <li>
                  <b>Your role</b>You negotiate against a stranger, then you are out — name, culture,
                  and all.
                </li>
              </ul>
            </article>
            <article className="ink-compare-card ink-reveal">
              <h3>Sell to private equity</h3>
              <ul>
                <li>
                  <b>The business</b>Bought to be improved and resold, usually within a few years.
                  Costs are cut to fit the model.
                </li>
                <li>
                  <b>The people</b>Jobs and locations are line items. Some stay; the plan rarely
                  starts with them.
                </li>
                <li>
                  <b>Your role</b>You may be asked to stay on, roll equity, or sign a personal
                  guarantee.
                </li>
              </ul>
            </article>
            <article className="ink-compare-card ink-featured ink-reveal">
              <span className="ink-tag">The third option</span>
              <h3>Sell to your employees</h3>
              <ul>
                <li>
                  <b>The business</b>Becomes 100% employee-owned through an ESOP. The name on the
                  door stays.
                </li>
                <li>
                  <b>The people</b>The people who built it with you own it — and stay to run it.
                </li>
                <li>
                  <b>Your role</b>You sell at a fair price, on a 120-day plan, with no personal
                  guarantee.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Proof, not promises */}
      <section className="ink-light ink-section-pad" id="proof" style={{ paddingTop: 0 }}>
        <div className="ink-wrap">
          <p className="ink-kicker ink-reveal">Evidence</p>
          <h2 className="ink-reveal">Proof, not promises</h2>
          <p className="ink-section-lede ink-reveal">
            Don&rsquo;t take our word for any of it. The numbers, the definitions, and the record
            are published — check them before you ever talk to us.
          </p>
          <div className="ink-proof-grid">
            <a className="ink-proof-card ink-reveal" href="#cost-test">
              <h3>The cost test</h3>
              <p>
                See exactly what a transition costs — every fee, in the open, before you commit to
                anything.
              </p>
              <span className="ink-go">Run the cost test</span>
            </a>
            <a className="ink-proof-card ink-reveal" href="#documents-ready">
              <h3>Documents-Ready, defined</h3>
              <p>
                The published definition of the milestone that starts the 120-day clock. No fine
                print, no moving goalposts.
              </p>
              <span className="ink-go">Read the definition</span>
            </a>
            <a className="ink-proof-card ink-reveal" href="#evidence">
              <h3>The Evidence Register</h3>
              <p>
                What we&rsquo;ve verified, in the open — claims, sources, and dates, kept where
                anyone can check them.
              </p>
              <span className="ink-go">Open the register</span>
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="ink-dark ink-section-pad ink-on-ink" id="how">
        <div className="ink-wrap">
          <p className="ink-kicker ink-reveal">How it works</p>
          <h2 className="ink-reveal">Four steps. Four Months.</h2>
          <div className="ink-steps">
            <div className="ink-step ink-reveal">
              <div className="ink-n">01</div>
              <h3>2-Minute Check</h3>
              <p>
                Answer a few questions and see whether your business fits — anonymously, in your
                browser.
              </p>
            </div>
            <div className="ink-step ink-reveal">
              <div className="ink-n">02</div>
              <h3>Company Fit</h3>
              <p>
                A deeper look, together. Revenue, people, and readiness — and a straight answer
                either way.
              </p>
            </div>
            <div className="ink-step ink-reveal">
              <div className="ink-n">03</div>
              <h3>Application</h3>
              <p>Formal application and approval. Only now does any real information change hands.</p>
            </div>
            <div className="ink-step ink-reveal">
              <div className="ink-n">04</div>
              <h3>120-day transition</h3>
              <p>
                Documents, financing, and the ESOP itself — four gates, each verified, closing on
                day 120.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leave on your own terms */}
      <section className="ink-light ink-section-pad" id="terms">
        <div className="ink-wrap">
          <p className="ink-kicker ink-reveal">After the sale</p>
          <h2 className="ink-reveal">Leave on your own terms, in your own time.</h2>
          <p className="ink-section-lede ink-reveal">
            Leave now or 5 years from now. It&rsquo;s your decision and you have a plan in place
            for your business to continue being successful after you decide to step away from the
            chair.
          </p>
          <div className="ink-compare-grid">
            <article className="ink-compare-card ink-reveal">
              <h3>You keep control</h3>
              <ul>
                <li>
                  On closing day, your title does not change: you remain{" "}
                  <b className="ink-inline">CEO and Chairman of the Board</b> — of a company now
                  owned by the people who work in it.
                </li>
              </ul>
            </article>
            <article className="ink-compare-card ink-reveal">
              <h3>A roadmap you approve</h3>
              <ul>
                <li>
                  The handover follows a <b className="ink-inline">written roadmap</b>:
                  responsibilities move one by one, each step at a pace you set and sign off on.
                  Nothing transfers by surprise.
                </li>
              </ul>
            </article>
            <article className="ink-compare-card ink-reveal">
              <h3>A timeline you choose</h3>
              <ul>
                <li>
                  Months or years — you step back when you are ready, staying{" "}
                  <b className="ink-inline">on call, not on duty</b>, while the employee-owners take
                  the reins.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Founder statement — three blocks, one row */}
      <section className="ink-statement" id="about">
        <div className="ink-wrap">
          <div className="ink-statement-grid">
            <p className="ink-st-block ink-reveal">Forhemit was founded in 2026.</p>
            <p className="ink-st-block ink-reveal">
              We are disrupting an industry of <span className="ink-accent">gatekeepers</span>.
            </p>
            <div className="ink-reveal">
              <p className="ink-st-block ink-st-body">
                We started in 2026 because we saw how the process was long, disjointed, and
                expensive because of delays and avoidable complications.
              </p>
              <Link className="ink-st-link" href="/how-we-do-it-differently">
                Find Out How We&rsquo;re Different &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA — shared pattern, see HomeInkClosing */}
      <HomeInkClosing />
    </>
  );
}
