"use client";

/**
 * HomePersuasionSections — Below-the-fold psychological trigger sections.
 *
 * Implements:
 * - Decoy Effect (exit-path comparison)
 * - Omission Bias ("Cost of Waiting")
 * - Prattfall Effect ("Who This Is Not For")
 * - Pre-Suasion trust anchors
 * - Enhanced micro-interactions from business-owners patterns
 */

import { useEffect, useRef, useState } from "react";

export type HomePersuasionSectionsProps = {
  onStartTwoMinuteCheck?: () => void;
};

/* ── Decoy Effect data ── */
const EXIT_PATHS = [
  {
    id: "liquidation",
    label: "Complete Liquidation",
    tag: "Worst outcome",
    tagClass: "hps-tag-red",
    featured: false,
    points: [
      "Fire sale of assets",
      "Employees lose jobs",
      "Massive capital gains tax hit",
      "Legacy destroyed",
      "3–6 months to wind down",
    ],
    summary: "Walk away with the least. Pay the most in taxes.",
  },
  {
    id: "pe",
    label: "Private Equity Sale",
    tag: "Uncertain",
    tagClass: "hps-tag-amber",
    featured: false,
    points: [
      "Loss of operational control",
      "Culture gutted in 12–18 months",
      "Buyer can walk at any time",
      "Financial contingencies",
      "Reps & warranties exposure",
    ],
    summary: "Highest risk. No guarantees.",
  },
  {
    id: "esop",
    label: "Forhemit ESOP Exit",
    tag: "Recommended",
    tagClass: "hps-tag-brass",
    featured: true,
    points: [
      "Fair market value — full price",
      "Up to 100% tax-free proceeds",
      "Employees keep their jobs",
      "Your legacy lives on",
      "Close in as little as four months",
    ],
    summary: "Fair price. Best terms. Most certainty.",
  },
] as const;

/* ── Cost of Waiting stats ── */
const WAITING_STATS = [
  {
    figure: "10,000+",
    label: "businesses hit the market every day",
    detail: "The Silver Tsunami is here — boomer owners are exiting en masse.",
  },
  {
    figure: "30–40%",
    label: "of listed businesses never sell",
    detail: "Oversupply compresses valuations and kills deals.",
  },
  {
    figure: "$0",
    label: "in tax savings while you wait",
    detail: "Every year you delay, you pay taxes an ESOP could eliminate.",
  },
] as const;

/* ── Not-For-You qualifiers (Prattfall) ── */
const NOT_FOR_YOU = [
  { text: "Revenue under $3M annually", delay: 0 },
  { text: "Pre-profit or revenue declining", delay: 1 },
  { text: "Fewer than 15 employees", delay: 2 },
  { text: "Need cash within 30 days", delay: 3 },
  { text: "Unwilling to stay 12 months post-close", delay: 4 },
] as const;

/* ── Trust anchors (Pre-Suasion) ── */
const TRUST_ANCHORS = [
  { icon: "🔒", text: "Secure & Confidential" },
  { icon: "📋", text: "DOL / IRS Compliant" },
  { icon: "⚖️", text: "Independent Valuation" },
  { icon: "🏦", text: "Lender-Ready Packaging" },
] as const;

/* ── Intersection Observer hook for reveal animations ── */
function useRevealObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isRevealed };
}

export function HomePersuasionSections({ onStartTwoMinuteCheck }: HomePersuasionSectionsProps) {
  const trustRef = useRevealObserver();
  const compareRef = useRevealObserver();
  const waitingRef = useRevealObserver();
  const prattfallRef = useRevealObserver();

  return (
    <div className="hps-wrap">
      {/* ── 1. Trust Anchors (Pre-Suasion) ── */}
      <section 
        ref={trustRef.ref}
        className={`hps-trust ${trustRef.isRevealed ? "hps-revealed" : ""}`} 
        aria-label="Trust indicators"
      >
        <div className="hps-trust-row">
          {TRUST_ANCHORS.map((a, i) => (
            <span 
              key={a.text} 
              className="hps-trust-badge"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="hps-trust-icon" aria-hidden>
                {a.icon}
              </span>
              <span className="hps-trust-label">{a.text}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── 2. Decoy Effect — Exit Path Comparison ── */}
      <section 
        ref={compareRef.ref}
        className={`hps-compare ${compareRef.isRevealed ? "hps-revealed" : ""}`} 
        aria-label="Compare your exit options"
      >
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">01 — Compare</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Exit Options
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">Three ways out. Only one that works.</h2>
          <p className="hps-sub">
            Most owners don&apos;t realize there&apos;s a path that preserves their legacy, pays fair
            market value, and closes in months — not years.
          </p>

          <div className="hps-cards">
            {EXIT_PATHS.map((path, i) => (
              <div
                key={path.id}
                className={`hps-glow-shell ${path.featured ? "hps-glow-shell--featured" : ""}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="hps-glow-shell__glow" aria-hidden />
                <div className={`hps-card ${path.featured ? "hps-card-featured" : ""}`}>
                  <span className={`hps-card-tag ${path.tagClass} ${path.featured ? "hps-tag-green-pill" : ""}`}>{path.tag}</span>
                  <h3 className="hps-card-title">{path.label}</h3>
                  <ul className="hps-card-list">
                    {path.points.map((p) => (
                      <li key={p} className="hps-card-item">
                        <span className={`hps-card-bullet ${path.featured ? "hps-card-bullet--green" : ""}`} aria-hidden>
                          {path.featured ? "✓" : "✗"}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="hps-card-summary">{path.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Omission Bias — Cost of Waiting ── */}
      <section 
        ref={waitingRef.ref}
        className={`hps-waiting ${waitingRef.isRevealed ? "hps-revealed" : ""}`} 
        aria-label="Cost of waiting"
      >
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">02 — Urgency</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Cost of Waiting
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">
            Every month you delay, the market gets harder.
          </h2>

          <div className="hps-stats">
            {WAITING_STATS.map((s, i) => (
              <div 
                key={s.figure} 
                className="hps-stat"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="hps-stat-figure">{s.figure}</span>
                <span className="hps-stat-label">{s.label}</span>
                <span className="hps-stat-detail">{s.detail}</span>
              </div>
            ))}
          </div>

          <span className="hps-cta-shell">
            <span className="hps-cta-shell__glow" aria-hidden />
            <button
              type="button"
              className="hps-cta"
              onClick={onStartTwoMinuteCheck}
            >
              Claim Your Free Assessment →
            </button>
          </span>
        </div>
      </section>

      {/* ── 4. Prattfall Effect — "Who This Is NOT For" ── */}
      <section 
        ref={prattfallRef.ref}
        className={`hps-prattfall ${prattfallRef.isRevealed ? "hps-revealed" : ""}`} 
        aria-label="Who this is not for"
      >
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">03 — Filter</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Full Transparency
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">This path isn&apos;t for everyone.</h2>
          <p className="hps-sub">
            An ESOP isn&apos;t a magic wand. To be honest about who we can help, here&apos;s who
            this process is <em>not</em> designed for:
          </p>

          <div className="hps-nfy-glow-shell">
            <div className="hps-nfy-glow-shell__glow" aria-hidden />
            <ul className="hps-nfy-list">
              {NOT_FOR_YOU.map((item) => (
                <li 
                  key={item.text} 
                  className="hps-nfy-item"
                  style={{ animationDelay: `${item.delay * 0.1}s` }}
                >
                  <span className="hps-nfy-x" aria-hidden>
                    ✗
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="hps-nfy-coda">
            If none of that describes you, you&apos;re likely an excellent fit. Start with our free
            2-minute assessment to find out.
          </p>

          <span className="hps-cta-shell">
            <span className="hps-cta-shell__glow" aria-hidden />
            <button
              type="button"
              className="hps-cta hps-cta-outline"
              onClick={onStartTwoMinuteCheck}
            >
              Take the 2-Minute Check →
            </button>
          </span>
        </div>
      </section>
    </div>
  );
}
