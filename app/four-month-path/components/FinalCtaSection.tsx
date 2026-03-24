"use client";

import { trackScheduleCallClick } from "@/lib/analytics/highIntent";
import { SCHEDULE_20_MIN_HREF } from "../constants";
import { RoadmapLink } from "./RoadmapLink";

export function FinalCtaSection() {
  return (
    <section id="fmp-get-started" className="fmp-section fmp-final-cta" aria-labelledby="fmp-final-cta-heading">
      <h2 id="fmp-final-cta-heading" className="fmp-final-cta-headline">
        Ready to get your Month 1 started?
      </h2>
      <div className="fmp-final-cta-actions">
        <span className="fmp-cta-shell fmp-cta-shell--block">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <a
            href={SCHEDULE_20_MIN_HREF}
            className="fmp-btn fmp-btn-primary"
            onClick={() => trackScheduleCallClick("four_month_path_footer")}
          >
            Get My Price Range — Schedule 20-Minute Call
          </a>
        </span>
        <span className="fmp-cta-shell fmp-cta-shell--block">
          <span className="fmp-cta-shell__glow" aria-hidden />
          <RoadmapLink surface="four_month_path_footer_secondary" className="fmp-btn fmp-btn-secondary">
            Open the Full 120-Day Timeline (HTML) - Share with Your Advisor
          </RoadmapLink>
        </span>
      </div>
    </section>
  );
}
