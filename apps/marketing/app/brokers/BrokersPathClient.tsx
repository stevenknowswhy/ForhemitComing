"use client";

import { CheckpointsSection } from "@/app/four-month-path/components/CheckpointsSection";
import { RoadmapPanel } from "@/app/four-month-path/components/RoadmapPanel";
import { TimelineRealismSection } from "@/app/four-month-path/components/TimelineRealismSection";
import { EsopTransactionCalendar } from "@/app/esop-transaction-calendar";
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
import { BROKER_CHECKPOINTS, BROKER_REALISM_FAQ } from "./constants";

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
            <EsopTransactionCalendar variant="embedded" />
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
              One interactive roadmap your client (and their attorney or CPA) can open in-browser with all
              milestones, checkpoints, and professional roles spelled out.
            </p>
            <RoadmapPanel
              surface="brokers_inline"
              ariaLabel="Open ESOP roadmap HTML"
              eyebrow="For your seller & advisors"
              question="Want the same 120-day timeline we use on the owner page?"
              bullets={[
                "Month-by-month milestones and checkpoints",
                "How bank, trustee, and appraiser sequence",
                "Plain-English glossary for non-ESOP counsel",
                "Print to PDF or forward under your cover email",
              ]}
              filenameNote="Opens in a new tab as HTML. Use browser print to save a PDF copy if needed."
              ctaLabel="Open: Complete 120-Day ESOP Roadmap (HTML)"
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
