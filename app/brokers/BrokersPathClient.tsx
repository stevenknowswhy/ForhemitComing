"use client";

import { CheckpointsSection } from "@/app/four-month-path/components/CheckpointsSection";
import { FourPhaseTimeline } from "@/app/four-month-path/components/FourPhaseTimeline";
import { RoadmapPdfPanel } from "@/app/four-month-path/components/RoadmapPdfPanel";
import { TimelineRealismSection } from "@/app/four-month-path/components/TimelineRealismSection";
import "@/app/home/intake/styles/classification-intake-modal.css";
import "@/app/four-month-path/styles/four-month-path.css";
import "@/app/four-month-path/styles/sections.css";
import "./brokers.css";
import { BrokersFloatingNav } from "./_components/BrokersFloatingNav";
import { BrokersFinalCtaSection } from "./_components/sections/BrokersFinalCtaSection";
import { BrokersFirstCallSection } from "./_components/sections/BrokersFirstCallSection";
import { BrokersHeroSection } from "./_components/sections/BrokersHeroSection";
import { BrokersInsuranceSection } from "./_components/sections/BrokersInsuranceSection";
import { BrokersProcessSection } from "./_components/sections/BrokersProcessSection";
import { BrokersQualificationSection } from "./_components/sections/BrokersQualificationSection";
import { BrokersWorkloadSection } from "./_components/sections/BrokersWorkloadSection";
import { BrokersWhySection } from "./_components/sections/BrokersWhySection";
import { DualTrackOutcomesSection } from "./_components/sections/DualTrackOutcomesSection";
import { EmployeesAreTheBuyerSection } from "./_components/sections/EmployeesAreTheBuyerSection";
import { BROKER_CHECKPOINTS, BROKER_PHASE_BLOCKS, BROKER_REALISM_FAQ } from "./constants";

export function BrokersPathClient() {
  return (
    <main className="fmp-page brk-page">
      <div className="fmp-bg" aria-hidden />

      <BrokersHeroSection />

      <div className="fmp-layout">
        <div className="fmp-main-col">
          <BrokersWhySection />

          <BrokersWorkloadSection />

          <BrokersQualificationSection />

          <EmployeesAreTheBuyerSection />

          <DualTrackOutcomesSection />

          <section id="brk-timeline" className="fmp-section" aria-labelledby="brk-timeline-heading">
            <h2 id="brk-timeline-heading" className="fmp-section-title">
              The four-month path (broker view)
            </h2>
            <p className="fmp-section-lead">
              Same phased rhythm we use with sellers—written so you can see where your listing sits relative
              to lender, trustee, and documentation work.
            </p>
            <FourPhaseTimeline phases={BROKER_PHASE_BLOCKS} />
          </section>

          <TimelineRealismSection
            sectionId="brk-realism"
            headingId="brk-realism-heading"
            title="What brokers ask about parallel tracks"
            lead="Dual-track should make you faster and safer—not add chaos. Here is how we talk about it with intermediaries."
            faqItems={BROKER_REALISM_FAQ}
            faqBodyIdPrefix="brk-faq-body"
          />

          <section id="brk-pdf" className="fmp-section" aria-labelledby="brk-pdf-heading">
            <h2 id="brk-pdf-heading" className="fmp-section-title">
              Share the roadmap with your seller
            </h2>
            <p className="fmp-section-lead">
              One PDF your client (and their attorney or CPA) can read offline—milestones, checkpoints, and
              professional roles spelled out.
            </p>
            <RoadmapPdfPanel
              surface="brokers_inline"
              ariaLabel="Download ESOP roadmap PDF"
              eyebrow="For your seller & advisors"
              question="Want the same 120-day timeline we use on the owner page?"
              bullets={[
                "Month-by-month milestones and checkpoints",
                "How bank, trustee, and appraiser sequence",
                "Plain-English glossary for non-ESOP counsel",
                "Print or forward under your cover email",
              ]}
              filenameNote="Opens in a new tab. Save or print from there—rename if you want a dated copy for your file."
              ctaLabel="View: Complete 120-Day ESOP Roadmap (PDF)"
            />
          </section>

          <CheckpointsSection
            checkpoints={BROKER_CHECKPOINTS}
            sectionId="brk-checkpoints"
            headingId="brk-checkpoints-heading"
            title="Four checkpoints before a clean close"
            lead="No surprises at the wire: these are the same gates we use with sellers—expressed for how you manage buyer expectations in parallel."
          />

          <BrokersProcessSection />

          <BrokersInsuranceSection />

          <BrokersFirstCallSection />

          <BrokersFinalCtaSection />
        </div>

        <div className="fmp-sidebar-col">
          <BrokersFloatingNav />
        </div>
      </div>
    </main>
  );
}
