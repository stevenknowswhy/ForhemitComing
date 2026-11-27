import type { Metadata } from "next";
import { HomeModalProvider } from "../home/components/HomeModalProvider";
import {
  HomeInkClosing,
  HomeInkEffects,
  HomeInkFooter,
  HomeInkHeader,
} from "../home";
import "../home/styles/home-ink.css";

export const metadata: Metadata = {
  title: "How We Do It Differently | Forhemit",
  description:
    "No gatekeepers: published fees ($3,000 Self Guided; Managed by tier), a 120-day clock with four verified gates, a published Documents-Ready definition, an Evidence Register, and a cost test you can run yourself.",
};

/**
 * /how-we-do-it-differently — v1 (2026-11-27 fix pass). The homepage
 * founder statement ("Find Out How We're Different") links here; the
 * route did not exist and 404'd. Built only from canonical site facts:
 * the published fee model, the 120-day / four-gate clock, the published
 * Documents-Ready definition, the Evidence Register, the cost test.
 * Section 1042 is a deferral, never "tax-free". DRAFT for Stefano's
 * copy review. Chrome: the ink header/footer (global chrome hides on
 * this path).
 */
export default function HowWeDoItDifferentlyPage() {
  return (
    <HomeModalProvider>
      <div className="home-ink">
        <HomeInkHeader />

        <section className="ink-page-hero">
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">How we do it differently</p>
            <h1 className="ink-reveal">No gatekeepers. Everything in the open.</h1>
            <p className="ink-section-lede ink-reveal">
              We started in 2026 because we saw how the process was long, disjointed, and expensive
              because of delays and avoidable complications. Selling a business to your employees
              should not work that way. Here is the difference, in the open — the same standard we
              hold ourselves to on this page.
            </p>
          </div>
        </section>

        <section className="ink-light ink-section-pad">
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">The contrast</p>
            <h2 className="ink-reveal">Two ways to run a transition</h2>
            <div className="ink-compare-grid">
              <article className="ink-compare-card ink-reveal">
                <h3>The gatekeeper way</h3>
                <ul>
                  <li>
                    <b>The fees</b>Quoted as a percentage, revealed late, and hard to compare —
                    every professional bills on their own clock.
                  </li>
                  <li>
                    <b>The process</b>A chain of separate gatekeepers — broker, lender, attorney,
                    appraiser — each with their own queue, and no one owning the whole road.
                  </li>
                  <li>
                    <b>The timeline</b>Open-ended. Delays compound, complications multiply, and
                    the bill grows with both.
                  </li>
                </ul>
              </article>
              <article className="ink-compare-card ink-featured ink-reveal">
                <span className="ink-tag">The Forhemit way</span>
                <h3>One roadmap, in the open</h3>
                <ul>
                  <li>
                    <b>The fees</b>Published, flat, and fixed before you commit — the same numbers
                    for everyone, printed on our pricing page.
                  </li>
                  <li>
                    <b>The process</b>One roadmap from the 2-Minute Check to closing, with every
                    step, document, and definition published in advance.
                  </li>
                  <li>
                    <b>The timeline</b>A 120-day clock with four gates, each verified before the
                    next begins — so a delay is visible the week it happens, not the month after.
                  </li>
                </ul>
              </article>
              <article className="ink-compare-card ink-reveal">
                <h3>What you can check yourself</h3>
                <ul>
                  <li>
                    <b>The cost test</b>Run the numbers on your own transition before you ever
                    talk to us.
                  </li>
                  <li>
                    <b>The Evidence Register</b>Our claims, sources, and dates — published, so
                    anyone can verify them.
                  </li>
                  <li>
                    <b>The definitions</b>Documents-Ready — the milestone that starts the 120-day
                    clock — is defined in writing, in public, before you sign anything.
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="ink-light ink-section-pad" style={{ paddingTop: 0 }}>
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">The fees, published</p>
            <h2 className="ink-reveal">The same numbers, for everyone</h2>
            <p className="ink-section-lede ink-reveal">
              Self Guided is $3,000, one time — the map, the documents, and the support to run your
              own transition. Managed engagements are tiered by earnings — $75K, $100K, or $125K —
              paid at roadmap gates as work is verified, never as a percentage of your sale. And
              for qualifying sellers, Section 1042 tax-deferred treatment may be available — a
              deferral, explained plainly, never dressed up as anything else.
            </p>
          </div>
        </section>

        <HomeInkClosing />
        <HomeInkFooter />
        <HomeInkEffects />
      </div>
    </HomeModalProvider>
  );
}
