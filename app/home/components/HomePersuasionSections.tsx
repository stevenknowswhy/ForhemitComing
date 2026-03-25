"use client";

/**
 * HomePersuasionSections — Below-the-fold psychological trigger sections.
 *
 * Implements:
 * - Decoy Effect (exit-path comparison)
 * - Omission Bias ("Cost of Waiting")
 * - Prattfall Effect ("Who This Is Not For")
 * - Pre-Suasion trust anchors
 *
 * Max ~380 lines (fits within 400-line component target)
 */

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
      "9–12 months due diligence",
      "Buyer can walk at any time",
      "Reps & warranties exposure",
    ],
    summary: "Highest risk. Longest timeline. No guarantees.",
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
      "Close in ~4 months",
    ],
    summary: "Best price. Best terms. Most certainty.",
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
  "Revenue under $3M annually",
  "Pre-profit or revenue declining",
  "Fewer than 15 employees",
  "Need cash within 30 days",
  "Unwilling to stay 12 months post-close",
] as const;

/* ── Trust anchors (Pre-Suasion) ── */
const TRUST_ANCHORS = [
  { icon: "🔒", text: "Secure & Confidential" },
  { icon: "📋", text: "DOL / IRS Compliant" },
  { icon: "⚖️", text: "Independent Valuation" },
  { icon: "🏦", text: "Lender-Ready Packaging" },
] as const;

export function HomePersuasionSections({ onStartTwoMinuteCheck }: HomePersuasionSectionsProps) {
  return (
    <div className="hps-wrap">
      {/* ── 1. Trust Anchors (Pre-Suasion) ── */}
      <section className="hps-trust" aria-label="Trust indicators">
        <div className="hps-trust-row">
          {TRUST_ANCHORS.map((a) => (
            <span key={a.text} className="hps-trust-badge">
              <span className="hps-trust-icon" aria-hidden>
                {a.icon}
              </span>
              <span className="hps-trust-label">{a.text}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── 2. Decoy Effect — Exit Path Comparison ── */}
      <section className="hps-compare" aria-label="Compare your exit options">
        <div className="hps-inner">
          <p className="hps-eyebrow">
            <span className="hps-eyebrow-line" aria-hidden />
            Compare your options
          </p>
          <h2 className="hps-headline">Three ways out. Only one that works.</h2>
          <p className="hps-sub">
            Most owners don&apos;t realize there&apos;s a path that preserves their legacy, pays fair
            market value, and closes in months — not years.
          </p>

          <div className="hps-cards">
            {EXIT_PATHS.map((path) => (
              <div
                key={path.id}
                className={`hps-card ${path.featured ? "hps-card-featured" : ""}`}
              >
                <span className={`hps-card-tag ${path.tagClass}`}>{path.tag}</span>
                <h3 className="hps-card-title">{path.label}</h3>
                <ul className="hps-card-list">
                  {path.points.map((p) => (
                    <li key={p} className="hps-card-item">
                      <span className="hps-card-bullet" aria-hidden>
                        {path.featured ? "✓" : "✗"}
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="hps-card-summary">{path.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Omission Bias — Cost of Waiting ── */}
      <section className="hps-waiting" aria-label="Cost of waiting">
        <div className="hps-inner">
          <p className="hps-eyebrow">
            <span className="hps-eyebrow-line" aria-hidden />
            The cost of waiting
          </p>
          <h2 className="hps-headline">
            Every month you delay, the market gets harder.
          </h2>

          <div className="hps-stats">
            {WAITING_STATS.map((s) => (
              <div key={s.figure} className="hps-stat">
                <span className="hps-stat-figure">{s.figure}</span>
                <span className="hps-stat-label">{s.label}</span>
                <span className="hps-stat-detail">{s.detail}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="hps-cta"
            onClick={onStartTwoMinuteCheck}
          >
            Claim Your Free Assessment →
          </button>
        </div>
      </section>

      {/* ── 4. Prattfall Effect — "Who This Is NOT For" ── */}
      <section className="hps-prattfall" aria-label="Who this is not for">
        <div className="hps-inner">
          <p className="hps-eyebrow">
            <span className="hps-eyebrow-line" aria-hidden />
            Full transparency
          </p>
          <h2 className="hps-headline">This path isn&apos;t for everyone.</h2>
          <p className="hps-sub">
            An ESOP isn&apos;t a magic wand. To be honest about who we can help, here&apos;s who
            this process is <em>not</em> designed for:
          </p>

          <ul className="hps-nfy-list">
            {NOT_FOR_YOU.map((item) => (
              <li key={item} className="hps-nfy-item">
                <span className="hps-nfy-x" aria-hidden>
                  ✗
                </span>
                {item}
              </li>
            ))}
          </ul>

          <p className="hps-nfy-coda">
            If none of that describes you, you&apos;re likely an excellent fit. Start with our free
            2-minute assessment to find out.
          </p>

          <button
            type="button"
            className="hps-cta hps-cta-outline"
            onClick={onStartTwoMinuteCheck}
          >
            Take the 2-Minute Check →
          </button>
        </div>
      </section>
    </div>
  );
}
