"use client";

import {
  HowMoneyMovesSection,
  TimelineRealismSection,
  WhatsMyJobSection,
  WhyForhemitSection,
} from "@/app/four-month-path/components";
import "@/app/four-month-path/styles/four-month-path.css";
import "@/app/four-month-path/styles/sections.css";

export function BusinessOwnersClosingSections() {
  return (
    <div className="bo-fmp-sections">
      <WhyForhemitSection />

      <TimelineRealismSection
        sectionId="bo-path-realism"
        headingId="bo-path-realism-heading"
        title="What to realistically expect"
        lead="120 days from Documents-Ready is the plan, not a guarantee — here is what the timeline honestly depends on."
        faqBodyIdPrefix="bo-path-realism-body"
      />

      <HowMoneyMovesSection />

      <WhatsMyJobSection />
    </div>
  );
}
