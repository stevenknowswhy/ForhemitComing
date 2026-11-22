/**
 * HomePersuasionSections - Below-the-fold psychological trigger sections.
 *
 * Implements:
 * - Decoy Effect (exit-path comparison)
 * - Omission Bias ("Cost of Waiting")
 * - Prattfall Effect ("Who This Is Not For")
 * - Pre-Suasion trust anchors
 * - Enhanced micro-interactions from business-owners patterns
 * - Panel rulings 2026-11-22: Candour section (D1/D8), Process section
 *   and per-section visuals (D7), Pricing section (D5), and no mid-page
 *   CTAs — nav + closing only (D6)
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
      "Your role: 4–12 months on call post-close (not hands-on)",
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

/* ── Candour cards (D1/D8, panel rulings 2026-11-22) — Section 01 is
      reframed around new-firm candour; no borrowed track record ── */
const CANDOUR_CARDS = [
  {
    title: "100% employee ownership",
    text: "A Forhemit transition puts 100% of your business in the hands of your employees. They don't need the cash — the purchase is structured and financed for them.",
    featured: false,
  },
  {
    title: "120 days from Documents-Ready",
    text: "A Forhemit transition is structured to complete in 120 days from Documents-Ready — the clock starts when your documents are complete and accepted.",
    featured: false,
  },
  {
    title: "Founded in 2026. Built for employee ownership.",
    text: "Forhemit is a new firm. We believe business succession should create lasting ownership opportunities for the employees who helped build the business.",
    featured: true,
  },
] as const;

/* ── Process steps (D7, panel rulings 2026-11-22) ── */
const PROCESS_STEPS = [
  {
    title: "Free assessment",
    text: "Five Yes/No questions. Two minutes. Free and confidential.",
  },
  {
    title: "First conversation",
    text: "If your business fits, we schedule a first conversation. If it doesn't, you hear exactly why.",
  },
  {
    title: "Documents-Ready",
    text: "Your documents are completed and accepted. The 120-day clock starts here.",
  },
  {
    title: "Structure & close",
    text: "An independent valuation, a financed purchase, and a close to 100% employee ownership in 120 days.",
  },
  {
    title: "On call",
    text: "You remain available on call for 4–12 months after close — not hands-on — to support continuity.",
  },
] as const;

/* ── Fee cards (D5, panel rulings 2026-11-22) ── */
const FEE_CARDS = [
  {
    title: "Self Guided Transition Service",
    text: "$3,000, one time.",
  },
  {
    title: "Custom Services",
    text: "Forhemit's fee is 3–5% of valuation. Fees charged by independent transaction professionals and other partners are separate.",
  },
] as const;

/* ── Section visuals (D7, panel rulings 2026-11-22) — one inline SVG
      illustration panel per major section, in the site's brass/ink
      palette. Decorative; each carries an accessible label. ── */
function SectionVisual({
  variant,
  label,
}: {
  variant: "sunrise" | "paths" | "steps" | "decline" | "checklist" | "tag";
  label: string;
}) {
  return (
    <figure className="hps-visual" role="img" aria-label={label}>
      {variant === "sunrise" ? (
        <svg width="320" height="110" viewBox="0 0 320 110" aria-hidden>
          <circle cx="160" cy="78" r="30" className="v-brass-fill" />
          <line x1="20" y1="82" x2="300" y2="82" className="v-ink-line" />
          <line x1="160" y1="18" x2="160" y2="34" className="v-brass-line" />
          <line x1="105" y1="32" x2="116" y2="44" className="v-brass-line" />
          <line x1="215" y1="32" x2="204" y2="44" className="v-brass-line" />
        </svg>
      ) : null}
      {variant === "paths" ? (
        <svg width="320" height="110" viewBox="0 0 320 110" aria-hidden>
          <circle cx="35" cy="55" r="9" className="v-ink-fill" />
          <path d="M44 55 L290 15" className="v-faint-line" />
          <path d="M44 55 L290 55" className="v-brass-line v-line-wide" />
          <path d="M44 55 L290 95" className="v-faint-line" />
          <circle cx="295" cy="15" r="6" className="v-faint-fill" />
          <circle cx="295" cy="55" r="6" className="v-brass-fill" />
          <circle cx="295" cy="95" r="6" className="v-faint-fill" />
        </svg>
      ) : null}
      {variant === "steps" ? (
        <svg width="320" height="110" viewBox="0 0 320 110" aria-hidden>
          <polyline points="25,90 90,72 155,54 220,36 290,18" className="v-brass-line v-line-wide" />
          <circle cx="25" cy="90" r="7" className="v-ink-fill" />
          <circle cx="90" cy="72" r="7" className="v-ink-fill" />
          <circle cx="155" cy="54" r="7" className="v-ink-fill" />
          <circle cx="220" cy="36" r="7" className="v-ink-fill" />
          <circle cx="290" cy="18" r="7" className="v-brass-fill" />
        </svg>
      ) : null}
      {variant === "decline" ? (
        <svg width="320" height="110" viewBox="0 0 320 110" aria-hidden>
          <polyline points="25,20 110,38 195,58 290,88" className="v-red-line v-line-wide" />
          <line x1="20" y1="100" x2="300" y2="100" className="v-faint-line" />
        </svg>
      ) : null}
      {variant === "checklist" ? (
        <svg width="320" height="110" viewBox="0 0 320 110" aria-hidden>
          <g className="v-ink-boxes">
            <rect x="60" y="15" width="18" height="18" />
            <rect x="60" y="46" width="18" height="18" />
            <rect x="60" y="77" width="18" height="18" />
            <rect x="190" y="15" width="18" height="18" />
            <rect x="190" y="46" width="18" height="18" />
            <rect x="190" y="77" width="18" height="18" />
          </g>
          <g className="v-brass-line">
            <line x1="90" y1="24" x2="150" y2="24" />
            <line x1="90" y1="55" x2="150" y2="55" />
            <line x1="90" y1="86" x2="150" y2="86" />
            <line x1="220" y1="24" x2="280" y2="24" />
            <line x1="220" y1="55" x2="280" y2="55" />
            <line x1="220" y1="86" x2="280" y2="86" />
          </g>
        </svg>
      ) : null}
      {variant === "tag" ? (
        <svg width="320" height="100" viewBox="0 0 320 100" aria-hidden>
          <path d="M110 20 h70 l45 30 -45 30 h-70 z" className="v-tag-shape" />
          <circle cx="132" cy="50" r="7" className="v-tag-hole" />
        </svg>
      ) : null}
    </figure>
  );
}

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

      {/* ── 2. Candour (D1/D8, panel rulings 2026-11-22) ── */}
      <RevealSection className="hps-candour" ariaLabel="A new firm, and we say so">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">01 - Candour</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Who We Are
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">A new firm, and we say so</h2>
          <p className="hps-sub">
            Forhemit was founded in 2026. We are new, and we say so. What we offer is not a track
            record — it is a structured process, an independent valuation, and candour about who
            this works for.
          </p>

          <SectionVisual variant="sunrise" label="A sunrise over a horizon line" />

          <div className="hps-cards">
            {CANDOUR_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`hps-glow-shell ${card.featured ? "hps-glow-shell--featured" : ""}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="hps-glow-shell__glow" aria-hidden />
                <div className={`hps-card ${card.featured ? "hps-card-featured" : ""}`}>
                  <h3 className="hps-card-title">{card.title}</h3>
                  <p className="hps-card-summary">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 3. Decoy Effect - Exit Path Comparison ── */}
      <RevealSection className="hps-compare" ariaLabel="Compare your exit options">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">02 - Compare</span>
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

          <SectionVisual variant="paths" label="Three paths diverging from one starting point" />

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

      {/* ── 4. Process (D7, panel rulings 2026-11-22) ── */}
      <RevealSection className="hps-process" ariaLabel="How employee ownership works">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">03 - Process</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              How It Works
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">How employee ownership works</h2>

          <SectionVisual variant="steps" label="A five-step path rising left to right" />

          <div className="hps-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="hps-step">
                <span className="hps-step-number">Step {i + 1}</span>
                <h3 className="hps-step-title">{step.title}</h3>
                <p className="hps-step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 5. Omission Bias - Cost of Waiting ── */}
      <RevealSection className="hps-waiting" ariaLabel="Cost of waiting">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">04 - Urgency</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Cost of Waiting
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">
            What does another year of waiting cost?
          </h2>

          <SectionVisual variant="decline" label="A value line declining over time" />

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

          {/* D6 (panel rulings 2026-11-22): no mid-page CTA — nav + closing only. */}
        </div>
      </RevealSection>

      {/* ── 6. Prattfall Effect - "Who This Is NOT For" ── */}
      <RevealSection className="hps-prattfall" ariaLabel="Who this is not for">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">05 - Filter</span>
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

          <SectionVisual variant="checklist" label="A checklist with six boxes" />

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

          {/* D6 (panel rulings 2026-11-22): no mid-page CTA — nav + closing only. */}
        </div>
      </RevealSection>

      {/* ── 7. Pricing (D5, panel rulings 2026-11-22) ── */}
      <RevealSection className="hps-pricing" ariaLabel="Service pricing">
        <div className="hps-inner">
          <div className="hps-section-header">
            <span className="hps-section-number">06 - Pricing</span>
            <p className="hps-eyebrow">
              <span className="hps-eyebrow-line" aria-hidden />
              Fees
            </p>
            <div className="hps-section-divider" />
          </div>
          <h2 className="hps-headline">Straightforward service pricing</h2>

          <SectionVisual variant="tag" label="A price tag" />

          <div className="hps-cards">
            {FEE_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="hps-glow-shell"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="hps-glow-shell__glow" aria-hidden />
                <div className="hps-card">
                  <h3 className="hps-card-title">{card.title}</h3>
                  <p className="hps-card-summary">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="hps-sub">
            We&apos;ll explain the applicable service and fee structure before you proceed.
          </p>
        </div>
      </RevealSection>

      {/* ── 8. Final CTA Banner ── */}
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
