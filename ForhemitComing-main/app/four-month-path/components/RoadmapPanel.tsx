import { RoadmapLink } from "./RoadmapLink";

const DEFAULT_BULLETS = [
  "Exact dates and legal milestones",
  "The 9 team seats you need to fill",
  "Technical requirements for lenders",
  "For professional advisors",
];

type Props = {
  surface: string;
  variant?: "inline" | "sticky";
  ariaLabel?: string;
  eyebrow?: string;
  question?: string;
  bullets?: string[];
  filenameNote?: string;
  ctaLabel?: string;
};

export function RoadmapPanel({
  surface,
  variant = "inline",
  ariaLabel = "Open roadmap HTML in new tab",
  eyebrow = "For your attorney or CPA",
  question = "Need the detailed timeline for your attorney or CPA?",
  bullets = DEFAULT_BULLETS,
  filenameNote = "Opens in a new tab as an interactive HTML roadmap. Use your browser print dialog to save a PDF copy if needed.",
  ctaLabel = "Open: Complete 120-Day ESOP Roadmap (HTML)",
}: Props) {
  return (
    <aside
      className={`fmp-pdf-panel ${variant === "sticky" ? "fmp-pdf-panel--sticky" : "fmp-pdf-panel--inline"}`}
      aria-label={ariaLabel}
    >
      <p className="fmp-pdf-panel-eyebrow">{eyebrow}</p>
      <p className="fmp-pdf-panel-q">{question}</p>
      <span className="fmp-cta-shell fmp-cta-shell--block fmp-cta-shell--mb-pdf">
        <span className="fmp-cta-shell__glow" aria-hidden />
        <RoadmapLink surface={surface} className="fmp-pdf-panel-cta">
          {ctaLabel}
        </RoadmapLink>
      </span>
      <ul className="fmp-pdf-panel-bullets">
        {bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="fmp-pdf-panel-filename-note">{filenameNote}</p>
    </aside>
  );
}
