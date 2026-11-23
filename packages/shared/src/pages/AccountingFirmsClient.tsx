"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Scroll reveal hook
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const SECTION_1042_CONDITIONS = [
  "The company is a C corporation at the time of the sale",
  "The ESOP owns at least 30% of the company after the sale",
  "The seller has held the stock for at least three years",
  "The seller reinvests the proceeds in qualified replacement property within the statutory replacement window",
  "The seller makes the §1042 election",
];

const SCREEN_CRITERIA = [
  "Annual revenue of $3M or more",
  "20 or more verifiable U.S. employees",
  "Profitable, with a consistent track record",
  "The owner holds 51% or more of the company",
  "The owner can allow the full 120 days for the transition",
  "The owner is willing to be available to the company for a transition period of 4 to 12 months after closing — on call for agreed check-ins, introductions, and questions, not working hands-on",
];

export function AccountingFirmsClient() {
  const { ref: realityRef, isVisible: realityVisible } = useScrollReveal(0.2);

  // Global scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="accounting-wrapper">
      <div className="accounting-background"></div>

      <main className="accounting-main">
        {/* Hero Section */}
        <section className="accounting-hero">
          <div className="container">
            <div className="accounting-hero-content">
              <span className="accounting-eyebrow" data-animate="fade-up">
                For CPAs &amp; accounting firms
              </span>
              <h1 className="accounting-title" data-animate="fade-up" data-delay="100">
                You see the succession problem first.{" "}
                <span className="highlight">Now you can offer the answer.</span>
              </h1>
              <p className="accounting-lead" data-animate="fade-up" data-delay="200">
                You see it in the returns years before anyone says the word exit: an owner in
                their sixties, no successor in the business, no plan on paper. Traditionally, the
                founder then talks to a broker or a buyer, and you are handed a finished deal to
                react to. This page is about a different order — you raise the option while
                the tax planning can still shape it, and the client stays yours.
              </p>
              <div className="accounting-hero-cta" data-animate="fade-up" data-delay="300">
                <Link href="#contact" className="cta-button magnetic">
                  Start a Conversation
                </Link>
              </div>
            </div>

            <div className="scroll-indicator">
              <div className="scroll-mouse">
                <div className="scroll-wheel"></div>
              </div>
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* The way it usually goes */}
        <section className="accounting-section tsunami-section">
          <div className="container">
            <div className="tsunami-grid" data-animate="fade-up">
              <div className="tsunami-text">
                <h2>The call that comes after the letter of intent</h2>
                <p className="tsunami-lead">
                  Traditionally, when a founder is ready to sell, they talk to a broker first
                  — or a private equity firm, or a buyer. The deal takes shape without you.
                  Your phone rings when the terms are already set, and the tax planning that
                  could have changed the outcome is compressed into whatever window is left
                  before closing. You are asked to catch a train that is already leaving the
                  station.
                </p>
                <p className="tsunami-question">
                  And the sale puts your file at risk too. A buyer or a private equity firm
                  arrives with its own accountants, and the client whose returns you have
                  prepared for twenty years can become someone else&apos;s client — not
                  because you failed them, but because you were brought in at the end of a
                  process that was never designed to keep you.
                </p>
                <Link href="#contact" className="tsunami-cta-link">
                  Raise it first — start with a conversation
                </Link>
              </div>
              <div className="tsunami-image">
                <Image
                  src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfD836AM0RQkVahrcQmOXG3UgxiZ2BuI795jYpy"
                  alt="An aerial view of a crosswalk and long shadows"
                  width={4679}
                  height={7019}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Raise it first */}
        <section className="accounting-section reality-section" ref={realityRef}>
          <div className="container">
            <h2 data-animate="fade-up">Raise it first, and the planning is yours to do</h2>
            <p className="section-context" data-animate="fade-up">
              An employee-ownership transition is the one exit where the tax work rewards being
              early. Where Section 1042 applies, the founder&apos;s gain is tax-deferred —
              and whether it applies, and how much it defers, is modelling you do properly when
              the structure is still open, not arithmetic you squeeze in after a broker has set
              the terms.
            </p>

            <div className={`reality-grid ${realityVisible ? "visible" : ""}`}>
              <div className="reality-card" data-animate="fade-up">
                <div className="reality-stat">
                  <span className="stat-number">§1042</span>
                  <span className="stat-label">tax-deferred, never tax-free</span>
                </div>
                <div className="reality-content">
                  <h3>The tax work rewards being early</h3>
                  <p>Bring the option to your client before anyone brings them a buyer, and the timeline works for the planning instead of against it.</p>
                </div>
              </div>

              <div className="reality-card" data-animate="fade-up" data-delay="100">
                <div className="reality-stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">sold to the employees</span>
                </div>
                <div className="reality-content">
                  <h3>The shape of it</h3>
                  <p>Your client sells 100% of the company to their employees, at a full price set by an independent appraiser who works for neither side. The transition closes in 120 days from Documents-Ready.</p>
                </div>
              </div>

              <div className="reality-card" data-animate="fade-up" data-delay="200">
                <div className="reality-stat">
                  <span className="stat-number">4–12 mo</span>
                  <span className="stat-label">on-call transition</span>
                </div>
                <div className="reality-content">
                  <h3>The work stays where it has always been</h3>
                  <p>The founder is available to the company for a transition period of 4 to 12 months after close — on call, not working hands-on — and the company&apos;s tax and accounting work stays where it has always been, because nothing about the company has left.</p>
                </div>
              </div>
            </div>

            <div className="reality-conclusion" data-animate="fade-up">
              <p>Forhemit structures employee-ownership transitions. <strong>We are not an accounting firm, and we do not provide tax or accounting services.</strong></p>
            </div>
          </div>
        </section>

        {/* Section 1042 conditions */}
        <section className="accounting-section multiplier-section">
          <div className="container">
            <div className="multiplier-header" data-animate="fade-up">
              <span className="section-eyebrow">Section 1042</span>
              <h2>What makes the deferral available</h2>
              <p className="multiplier-context">
                Section 1042 deferral is conditional, and the conditions are exactly the kind a
                CPA will want named. In outline:
              </p>
            </div>

            <div className="superior-path-grid" data-animate="fade-up">
              {SECTION_1042_CONDITIONS.map((item) => (
                <div className="path-item" key={item}>
                  <span className="path-check">✓</span>
                  <div>
                    <strong>{item}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="ghost-practice-callout" data-animate="fade-up">
              <div className="callout-icon">§</div>
              <div className="callout-content">
                <h3>Deferral — conditional, and worth modelling early</h3>
                <blockquote>
                  Where those conditions are met and the election is made, the gain on the sale
                  is tax-deferred. Whether they are met in a given case is a determination for
                  you and your client — which is precisely why the conversation has to
                  start while the structure is still open.
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* After the close */}
        <section className="accounting-section moat-section">
          <div className="container">
            <div className="moat-header" data-animate="fade-up">
              <h2>After the close</h2>
              <p>
                A sale to a stranger ends the engagement. An employee-ownership transition does
                the opposite. The founder&apos;s on-call transition availability runs 4 to 12
                months after close, and the company is monitored against agreed warning
                indicators for 24 months — with your firm still in the room, because the
                company is still independent, still local, and still served by the accountants
                it already trusts.
              </p>
            </div>

            <div className="moat-delivers" data-animate="fade-up">
              <p className="delivers-lead">The client who stays — and a company that keeps needing its accountants:</p>
            </div>

            <div className="deliverable-card" data-animate="slide-right">
              <div className="deliverable-number">01</div>
              <div className="deliverable-content">
                <h3>Work that recurs every year</h3>
                <p className="deliverable-hook">
                  An employee-owned company is not a closed file.
                </p>
                <ul className="deliverable-benefits">
                  <li>
                    <strong>Annual independent valuation</strong> and annual plan filings, every
                    year of the company&apos;s life.
                  </li>
                  <li>
                    <strong>A repurchase obligation</strong> that grows as employee-owners vest
                    and eventually retire — forecasting and compliance work that recurs,
                    sitting with the accountants the company already trusts.
                  </li>
                </ul>
              </div>
            </div>

            <div className="deliverable-card" data-animate="slide-left">
              <div className="deliverable-number">02</div>
              <div className="deliverable-content">
                <h3>A stake the employees never had before</h3>
                <p className="deliverable-hook">
                  For the employees themselves, ownership brings a kind of security they never
                  knew was possible.
                </p>
                <ul className="deliverable-benefits">
                  <li>
                    <strong>A stake in the company they work in,</strong> held for their
                    retirement.
                  </li>
                  <li>
                    <strong>One founder brought you this client.</strong> The transition keeps
                    the company — and the recurring work it generates — with the
                    accountants it already trusts.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The qualification standard */}
        <section className="accounting-section window-section">
          <div className="container">
            <h2 data-animate="fade-up">The qualification standard</h2>

            <div className="window-content" data-animate="fade-up">
              <p className="window-warning">
                The standard we screen against on a first call. If a client of yours clears it,
                the conversation is worth having; if they do not, we will tell you quickly and
                say why.
              </p>

              <p className="window-path-intro">The clients this fits:</p>

              <div className="superior-path-grid">
                {SCREEN_CRITERIA.map((item, i) => (
                  <div className="path-item" data-animate="fade-up" data-delay={i * 50} key={item}>
                    <span className="path-check">✓</span>
                    <div>
                      <strong>{item}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <p className="window-path-intro">
                Want the fuller screen?{" "}
                <Link href="/brokers#brk-screening">Run the full 18-point screen</Link> —
                the interactive checklist lives on our Brokers page.
              </p>
            </div>
          </div>
        </section>

        {/* The money, plainly */}
        <section className="accounting-section hooks-section">
          <div className="container">
            <div className="hooks-header" data-animate="fade-up">
              <span className="section-eyebrow">The money, plainly</span>
              <h2>No surprises, and nothing between firms</h2>
            </div>

            <div className="hooks-grid">
              <div className="hook-card" data-animate="slide-right">
                <div className="hook-number">01</div>
                <div className="hook-icon">§</div>
                <h3>No surprises on price.</h3>
                <p>
                  Our fee: 3 to 5% of the valuation, in writing after independent valuation. Professional partners are paid by your client directly, at estimates they approve first.
                </p>
                <div className="hook-difference">
                  <span className="difference-arrow">→</span>
                  <span className="difference-text">The full cost picture is on our <strong>Pricing</strong> page.</span>
                </div>
              </div>

              <div className="hook-card" data-animate="slide-left">
                <div className="hook-number">02</div>
                <div className="hook-icon">0</div>
                <h3>Nothing between firms.</h3>
                <p>
                  We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals.
                </p>
                <div className="hook-benefit">
                  <span className="benefit-tag">No referral fees</span>
                  <span className="benefit-text">Nothing of value moves between firms — in either direction.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How an introduction works */}
        <section className="accounting-section architect-section">
          <div className="container">
            <div className="architect-content" data-animate="fade-up">
              <h2>How an introduction works</h2>
              <p className="architect-choice">
                <strong>Start in the abstract.</strong> A first conversation needs no client
                name, we will not contact or identify your client on the basis of a preliminary
                conversation, and your client stays unidentified until you authorise an
                introduction. <strong>Screen it together.</strong> We screen the business
                against the standard above, together. If it does not fit, you hear that fast,
                with the reasons, in terms you can take back to your client, along with what
                would have to change. A slow yes would spend your credibility; we will not do
                that.
              </p>
              <p className="architect-call">
                <strong>Stay informed at every phase.</strong> Named introductions happen only
                when you are ready, and always with you present. With your client&apos;s
                authorisation, you are told when the introduction lands, when the business is
                screened, when the structure is set, and when it closes. Talk to us first,
                before any client is involved:{" "}
                <span className="highlight">contact@forhemit.com · (510) 405-4330</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Founder block */}
        <section className="accounting-section architect-section">
          <div className="container">
            <div className="architect-content" data-animate="fade-up">
              <h2>Who you are trusting</h2>
              <p className="architect-choice">
                <strong>The person you are trusting with your client.</strong> Stefano Stokes
                — Founder &amp; CEO. I&apos;m the person you speak with first, the person
                who leads your client&apos;s transition, and the person accountable for
                coordinating the work through closing and handover. Forhemit has one principal.
                You work directly with me, supported by independent specialists where the
                transaction requires them.
              </p>
              <p className="architect-choice">
                Forhemit is a California Public Benefit Corporation, based in San Francisco and
                working with founder-led businesses nationally. Every transition is
                stress-tested before it is structured under our Resilience Framework, and
                monitored for 24 months after close under our 24-Month Early Warning System, so
                the client you send us is looked after after the signing, not just up to it.
              </p>
              <p className="architect-call">
                <strong>Forhemit was founded in 2026. We are new, and we say so.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="accounting-section cta-section" id="contact">
          <div className="container">
            <div className="cta-content" data-animate="fade-up">
              <h2>Start with a conversation between professionals</h2>
              <Link
                href="/contact?contactType=partner&interest=accounting"
                className="cta-button magnetic"
              >
                Start a Conversation
              </Link>
              <p className="cta-subtitle">
                Use the contact page and say you are a CPA, not a founder. No client needs to
                be involved, and nothing about your client is needed, for the first call. Talk
                to us first, before any client is involved: contact@forhemit.com · (510)
                405-4330.
              </p>
              <p className="cta-subtitle">
                For the other professionals in your client&apos;s corner:{" "}
                <Link href="/legal-practices">Attorneys</Link> ·{" "}
                <Link href="/brokers">Brokers</Link> ·{" "}
                <Link href="/wealth-managers">Wealth Managers</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
