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
        title="What to expect on the way to closing"
        lead="Roughly four months from first numbers to a funded close is realistic for many owners—when you are ready to sell. Here are the questions we hear most before the wire hits."
        faqBodyIdPrefix="bo-path-realism-body"
      />

      <HowMoneyMovesSection />

      <WhatsMyJobSection />
    </div>
  );
}
