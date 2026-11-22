/**
 * HomePersuasionSections - Below-the-fold psychological trigger sections.
 *
 * Implements:
 * - Decoy Effect (exit-path comparison)
 * - Omission Bias ("Cost of Waiting")
 * - Prattfall Effect ("Who This Is Not For")
 * - Pre-Suasion trust anchors
 * - Enhanced micro-interactions from business-owners patterns
 *
 * Server component: all markup renders on the server. The scroll-reveal
 * behavior lives in the RevealSection client wrapper and the assessment CTAs
 * in the AssessmentCta island — the content itself never hydrates.
 */

import {
  ClipboardCheck,
  Landmark,
  Lock,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { AssessmentCta } from "./AssessmentCta";
import { RevealSection } from "./RevealSection";

/* ── Decoy Effect data ── */
const EXIT_PATHS = [
  {
    id: "liquidation",
    label: "Liquidation",
    tag: "The wind-down",
    tagClass: "hps-tag-red",
    featured: false,
    points: [
      "Price: whatever the assets bring at sale — the business itself is gone",
      "Team: your employees lose their jobs",
      "Name: the business name and legacy end",
      "Your role: you run the wind-down, then you're done",
      "Timeline: months to sell assets and close the doors",
    ],
    summary: "An ending, not a succession.",
  },
  {
    id: "pe",
    label: "Private Equity",
    tag: "The outside buyer",
    tagClass: "hps-tag-amber",
    featured: false,
    points: [
      "Price: set by the buyer's model — often with part of it deferred or contingent",
      "Team: the buyer decides who stays and how the place runs",
      "Name: usually kept, but under the buyer's direction",
      "Your role: you answer to the buyer through the transition, then exit on their timetable",
      "Timeline: a brokered sale typically takes 12–18 months, and many never close",
    ],
    summary: "A real path — if a buyer appears, and the deal holds together.",
  },
  {
    id: "esop",
    label: "Employee Ownership via Forhemit",
    tag: "The continuity path",
    tagClass: "hps-tag-brass",
    featured: true,
    points: [
      "Price: a full-price exit at independent fair market value",
      "Team: your employees buy 100% of the business",
      "Name: the business and its name carry on",
      "Your role: available on call for 4 to 12 months after close — not hands-on — then you leave on your own timing",
      "Timeline: 120 days from Documents-Ready — the clock starts when your documents are complete and accepted",
    ],
    summary: "Continuity for the business, ownership for your people, a full-price exit for you.",
  },
] as const;

/* ── Cost of Waiting stats ── */
const WAITING_STATS = [
  {
    figure: "92%",
    label: "of U.S. business exits in 2022 closed without a sale",
    detail: "Of roughly 510,000 exits that year, 92% closed and only 5% sold. (McKinsey Institute for Economic Mobility.)",
  },
  {
    figure: "20–30%",
    label: "of businesses taken to market actually sell",
    detail: "The rest never close. (Exit Planning Institute.)",
  },
  {
    figure: "120 days",
    label: "for a Forhemit transition, vs. 12–18 months brokered",
    detail: "Most brokered sales take 12–18 months, and many never close. A Forhemit transition is structured to close in 120 days from Documents-Ready.",
  },
] as const;

/* ── Not-For-You qualifiers (Prattfall) ── */
const NOT_FOR_YOU = [
  { text: "Revenue under $3M annually", delay: 0 },
  { text: "Pre-profit or revenue declining", delay: 1 },
  { text: "Fewer than 20 employees", delay: 2 },
  { text: "You need cash within 30 days", delay: 3 },
  { text: "You hold less than 51% of the company", delay: 4 },
  { text: "You can't be available at all after closing — not even on call", delay: 5 },
] as const;

/* ── Trust anchors (Pre-Suasion) — single-stroke Lucide icons in the
      manuscript gold (audit P2-1: platform emoji render off-palette) ── */
const TRUST_ANCHORS: ReadonlyArray<{ icon: LucideIcon; text: string }> = [
  { icon: Lock, text: "Secure & Confidential" },
  { icon: ClipboardCheck, text: "Structured for Department of Labor and IRS compliance" },
  { icon: Scale, text: "Independent valuation at fair market value" },
  { icon: Landmark, text: "Packaged so lenders can say yes" },
];

export function HomePersuasionSections() {
  return (
    <div className="hps-wrap">
      {/* ── 1. Trust Anchors (Pre-Suasion) ── */}
      <RevealSection className="hps-trust" ariaLabel="Trust indicators">
        <div className="hps-trust-row">
          {TRUST_ANCHORS.map((a, i) => {
            const Icon = a.icon;
            return (
              <span
                key={a.text}
                className="hps-trust-badge"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="hps-trust-icon" aria-hidden>
                  <Icon size={14} strokeWidth={1.5} aria-hidden />
                </span>
                <span className="hps-trust-label">{a.text}</span>
              </span>
            );
          })}
        </div>
      </RevealSection>

      {/* ── 2. Decoy Effect - Exit Path Comparison ── */}
      <RevealSection className="hps-compare" ariaLabel="Compare your exit options">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">01 - Compare</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Exit Options
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">Three Paths. Three Different Outcomes.</h2>
          <p className="hps-sub">
            The right path depends on your goals, but employee ownership can preserve continuity
            in a way liquidation or a conventional outside sale often cannot.
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
      </RevealSection>

      {/* ── 3. Omission Bias - Cost of Waiting ── */}
      <RevealSection className="hps-waiting" ariaLabel="Cost of waiting">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">02 - Urgency</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Cost of Waiting
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">
            What does another year of waiting cost?
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
            <AssessmentCta className="hps-cta">
              Start Your Free Assessment →
            </AssessmentCta>
          </span>
        </div>
      </RevealSection>

      {/* ── 4. Prattfall Effect - "Who This Is NOT For" ── */}
      <RevealSection className="hps-prattfall" ariaLabel="Who this is not for">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">03 - Filter</span>
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
            The free assessment applies these same six questions to your numbers. If it&apos;s not
            yet a fit, it tells you so directly, and names what would have to change.
          </p>

          <span className="hps-cta-shell">
            <span className="hps-cta-shell__glow" aria-hidden />
            <AssessmentCta className="hps-cta hps-cta-outline">
              Start Your Free Assessment →
            </AssessmentCta>
          </span>
        </div>
      </RevealSection>
      {/* ── 5. Final CTA Banner ── */}
      <section className="hps-final-cta" aria-label="Get started">
        <div className="hps-inner">
          <h2 className="hps-final-cta-headline">Ready to explore employee ownership?</h2>
          <p className="hps-final-cta-sub">
            Five Yes/No questions. Two minutes. Free and confidential — we only ask for your
            contact details at the end if you want your results. Stefano reviews every assessment
            personally: if your business fits, he&apos;ll reach out to schedule a first
            conversation; if it doesn&apos;t, you&apos;ll hear exactly why, and what would have
            to change.
          </p>
          <span className="hps-cta-shell">
            <span className="hps-cta-shell__glow" aria-hidden />
            <AssessmentCta className="hps-cta">
              Start Your Free Assessment →
            </AssessmentCta>
          </span>
        </div>
      </section>
    </div>
  );
}
