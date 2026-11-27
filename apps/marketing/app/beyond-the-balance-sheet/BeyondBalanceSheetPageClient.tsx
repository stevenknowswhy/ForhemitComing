"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "@forhemit/shared/styles/beyond-balance-sheet.css";
import { ClosingCheck } from "../blog/_components/ClosingCheck";

export function BeyondBalanceSheetPageClient() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".bbs-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bbs-wrapper">
      <div className="bbs-background"></div>

      <main className="bbs-main">
        {/* ① Hero Section */}
        <section id="hero" className={`bbs-section bbs-hero ${visibleSections.has("hero") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-eyebrow">Essay</div>
            <h1 className="bbs-title">Beyond the Balance Sheet</h1>
            <p className="bbs-subhead">
              The most valuable things in a founder-led company — trust, craft,
              reputation, the people themselves — appear nowhere in its financial
              statements. The right exit is the one that prices them anyway.
            </p>
            <p className="bbs-subhead" style={{ fontSize: "1rem", marginTop: "1rem" }}>
              By Stefano Stokes, Founder &amp; CEO of Forhemit
            </p>
          </div>
        </section>

        {/* ② What the statements cannot hold */}
        <section id="framing" className={`bbs-section bbs-framing ${visibleSections.has("framing") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The question</div>
            <h2 className="bbs-section-title">What the statements cannot hold</h2>
            <div className="bbs-content">
              <p>
                Ask an accountant what a company is worth and you will get a
                careful, defensible answer built from its statements: earnings,
                assets, comparables. Ask the company&apos;s longest-serving
                employee the same question and you will get a different list
                entirely — the customers who call and ask for someone by name,
                the supplier who extends terms on a handshake, the apprentice
                who now trains other apprentices. Both answers are true. Only
                one of them shows up in a sale.
              </p>
              <p>
                Financial statements are a record of what can be counted, and
                they are honest about their limits: goodwill appears on them
                only after someone has paid for it. Trust, craft, reputation,
                institutional memory, the culture that makes good people stay —
                none of it has a line. Yet in a founder-led business, those
                uncounted things are frequently the majority of the real value.
                An exit that prices only the statements is an exit that gives
                the rest away.
              </p>
            </div>
            <blockquote className="bbs-pull-quote">
              Both answers are true. Only one of them shows up in a sale.
            </blockquote>
          </div>
        </section>

        {/* ③ How each exit treats the uncounted value */}
        <section id="comparison" className={`bbs-section bbs-comparison ${visibleSections.has("comparison") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The contrast</div>
            <h2 className="bbs-section-title">How each exit treats the uncounted value</h2>
            <p className="bbs-lead">
              Liquidation prices the counted assets and discards the rest — the
              uncounted value is simply destroyed. A financial buyer prices the
              statements and treats the uncounted value as a risk to be managed:
              key people get retention contracts, the culture gets a rebrand, the
              founder&apos;s name comes off the door on a schedule.
            </p>
            <div className="bbs-content">
              <p>
                Employee ownership is the one structure that prices the
                uncounted value as an asset — because the people who embody it
                are the buyers, and its preservation is in their direct
                financial interest.
              </p>
            </div>
          </div>
        </section>

        {/* ④ Ownership changes the daily arithmetic + the founder's real question */}
        <section id="audience" className={`bbs-section bbs-audience ${visibleSections.has("audience") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">After the sale</div>
            <h2 className="bbs-section-title">Ownership changes the daily arithmetic</h2>
            <div className="bbs-content">
              <p>
                There is a quieter effect, visible within a year or two of a
                transition. When the people doing the work own the outcome, the
                daily arithmetic of a company changes: waste gets noticed by the
                people who pay for it, improvements get suggested by the people
                who live with them, and the long term stops being an abstraction.
                That is why stewardship after close matters, and why Forhemit
                stays: ownership is a beginning, not a finish line.
              </p>
            </div>
            <h2 className="bbs-section-title">The founder&apos;s real question</h2>
            <div className="bbs-content">
              <p>
                So the founder&apos;s real question is not &quot;what is my
                business worth?&quot; It is &quot;worth to whom — and what
                happens to the worth I built that never made it onto the
                statements?&quot; Employee ownership is the exit that answers
                both halves of that question at once: full price for the counted
                value, and a future for the uncounted.
              </p>
            </div>
          </div>
        </section>

        {/* ⑤ Read next + author block */}
        <section id="closer" className={`bbs-section bbs-closer ${visibleSections.has("closer") ? "visible" : ""}`}>
          <div className="container">
            <div className="closer-box">
              <h2 className="closer-headline">Read next</h2>
              <p className="closer-sub">
                If you have not read it yet, The Exit Crisis lays out the market
                failure this philosophy answers — in the arithmetic nobody shows
                founders.
              </p>
              <Link href="/the-exit-crisis" className="bbs-cta-btn">
                Read The Exit Crisis →
              </Link>
              <p className="closer-sub" style={{ marginTop: "2rem" }}>
                Stefano Stokes is the Founder &amp; CEO of Forhemit, an
                employee-ownership succession firm in San Francisco. He leads
                every engagement personally.{" "}
                <Link href="/about">More about Stefano and Forhemit →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ⑥ Single closing action at the foot (ruling D2 A, 2026-11-27) */}
        <section className="bbs-section">
          <div className="container">
            <ClosingCheck />
          </div>
        </section>
      </main>
    </div>
  );
}
