"use client";

import { useState } from "react";
import { trackScheduleCallClick } from "@/lib/analytics/highIntent";
import { RoadmapLink } from "@/app/four-month-path/components/RoadmapLink";
import { BrokersContactModal } from "../BrokersContactModal";

export function BrokersFinalCtaSection() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section
        id="brk-get-started"
        className="fmp-section fmp-final-cta"
        aria-labelledby="brk-final-cta-heading"
      >
        <h2 id="brk-final-cta-heading" className="fmp-final-cta-headline">
          Introduce a listing or get a confidential read on fit
        </h2>
        <div className="fmp-final-cta-actions">
          <span className="fmp-cta-shell fmp-cta-shell--block">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <button
              type="button"
              className="fmp-btn fmp-btn-primary"
              onClick={() => {
                trackScheduleCallClick("brokers_footer");
                setIsContactOpen(true);
              }}
            >
              Message Forhemit brokers
            </button>
          </span>
          <span className="fmp-cta-shell fmp-cta-shell--block">
            <span className="fmp-cta-shell__glow" aria-hidden />
            <RoadmapLink surface="brokers_footer_secondary" className="fmp-btn fmp-btn-secondary">
              Open the 120-day roadmap (HTML) for your seller
            </RoadmapLink>
          </span>
        </div>
      </section>

      <BrokersContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
