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
  title: "For the Employees | Forhemit",
  description:
    "What becoming an employee-owner actually means: an ownership stake in the company you work for, retirement wealth built through the ESOP on top of regular pay, and a company that stays local and independent.",
};

/**
 * /benefits — v1 (2026-11-27 fix pass). The homepage banner ("See why
 * employees love us!") links here; the route did not exist and 404'd.
 * Conservative educational copy only: no statistics, no percentages, no
 * testimonials, no promised amounts. DRAFT for Stefano's copy review.
 * Chrome: the ink header/footer (global chrome hides on this path), so
 * the page reads as part of the ink homepage family.
 */
export default function BenefitsPage() {
  return (
    <HomeModalProvider>
      <div className="home-ink">
        <HomeInkHeader />

        <section className="ink-page-hero">
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">For the employees</p>
            <h1 className="ink-reveal">See why employees love us</h1>
            <p className="ink-section-lede ink-reveal">
              When a company&rsquo;s owner retires, the usual buyers are strangers — a broker&rsquo;s
              highest bidder, or a fund that plans to resell. There is a third option: the business
              is sold to the people who work in it, through an employee stock ownership plan — an
              ESOP. If that happens at your company, here is what it means for you.
            </p>
          </div>
        </section>

        <section className="ink-light ink-section-pad">
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">What changes for you</p>
            <h2 className="ink-reveal">You stop working for the owner. You become one.</h2>
            <div className="ink-compare-grid ink-grid-2">
              <article className="ink-compare-card ink-reveal">
                <h3>An ownership stake in the company you work for</h3>
                <ul>
                  <li>
                    The shares are held in a trust for the employees. As an eligible employee, you
                    build an account in that trust over time — a real stake in the business your
                    work makes valuable.
                  </li>
                </ul>
              </article>
              <article className="ink-compare-card ink-reveal">
                <h3>Retirement wealth, built at work</h3>
                <ul>
                  <li>
                    The ESOP is a retirement plan, funded by the company — not deducted from your
                    pay. It builds on top of your regular wages, as a long-term benefit of staying
                    and building the company.
                  </li>
                </ul>
              </article>
              <article className="ink-compare-card ink-reveal">
                <h3>The company stays local and independent</h3>
                <ul>
                  <li>
                    No distant buyer, no relocation plan, no new name on the door. The business
                    stays where it was built, run by the people who know it — including you.
                  </li>
                </ul>
              </article>
              <article className="ink-compare-card ink-reveal">
                <h3>A voice in its future</h3>
                <ul>
                  <li>
                    Owners are kept informed, and on the biggest decisions a company can make —
                    like selling or merging it — employee-owners get a vote. You are treated as
                    what you are: an owner.
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="ink-light ink-section-pad" style={{ paddingTop: 0 }}>
          <div className="ink-wrap">
            <p className="ink-kicker ink-reveal">What does not change</p>
            <h2 className="ink-reveal">Same job. Same pay. Same Monday morning.</h2>
            <p className="ink-section-lede ink-reveal">
              Ownership changes who holds the shares — not how the work gets done. Your role, your
              pay, and your day-to-day stay the same. What changes is where the value of the
              company goes over the years ahead: to the people who create it.
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
