"use client";

import { trackBeginIntakeClick, trackTwoMinuteCheckClick } from "@/lib/analytics/highIntent";
import { RoadmapLink } from "./RoadmapLink";

interface FinalCtaSectionProps {
  onStartTwoMinuteCheck: () => void;
  onBeginIntake: () => void;
}

export function FinalCtaSection({ onStartTwoMinuteCheck, onBeginIntake }: FinalCtaSectionProps) {
  return (
    <section id="fmp-get-started" className="fmp-section fmp-final-cta" aria-labelledby="fmp-final-cta-heading">
      <h2 id="fmp-final-cta-heading" className="fmp-final-cta-headline">
        Four months from now, this could be finished.
      </h2>
      <div className="fmp-final-cta-actions fmp-final-cta-actions--row">
        <span className="fmp-cta-shell">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <button
            type="button"
            className="fmp-btn fmp-btn-primary"
            onClick={() => {
              trackTwoMinuteCheckClick("four_month_path_footer");
              onStartTwoMinuteCheck();
            }}
          >
            See If You Qualify →
          </button>
        </span>
        <span className="fmp-cta-shell">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <button
            type="button"
            className="fmp-btn fmp-btn-secondary"
            onClick={() => {
              trackBeginIntakeClick("four_month_path_footer", "nda");
              onBeginIntake();
            }}
          >
            Begin Confidential Intake
          </button>
        </span>
      </div>
      <div className="fmp-final-cta-actions fmp-final-cta-actions--secondary">
        <span className="fmp-cta-shell fmp-cta-shell--block">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <RoadmapLink surface="four_month_path_footer_secondary" className="fmp-btn fmp-btn-secondary">
            Open the 120-Day Roadmap (HTML)
          </RoadmapLink>
        </span>
      </div>
    </section>
  );
}
