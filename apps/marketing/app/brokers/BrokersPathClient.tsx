"use client";

import { CheckpointsSection } from "@/app/four-month-path/components/CheckpointsSection";
import { RoadmapPanel } from "@/app/four-month-path/components/RoadmapPanel";
import { TimelineRealismSection } from "@/app/four-month-path/components/TimelineRealismSection";
import { BrokerScreeningChecklist } from "./_components/BrokerScreeningChecklist";
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

          <section id="brk-screening" className="fmp-section" aria-labelledby="brk-screening-heading">
            <h2 id="brk-screening-heading" className="fmp-section-title">
              Broker screening: the 18-point check
            </h2>
            <p className="fmp-section-lead">
              Screen the business before you bring it. Run the business you have in mind against
              the same standard we apply on a first call. If a business you bring us is not a fit,
              we say so quickly and say why, in terms you can take back to your client, along with
              what would have to change.
            </p>
            <BrokerScreeningChecklist />
          </section>

          <TimelineRealismSection
            sectionId="brk-realism"
            headingId="brk-realism-heading"
            title="What to realistically expect"
            lead="The questions brokers ask us most, answered straight."
            faqItems={BROKER_REALISM_FAQ}
            faqBodyIdPrefix="brk-faq-body"
          />

          <section id="brk-pdf" className="fmp-section" aria-labelledby="brk-pdf-heading">
            <h2 id="brk-pdf-heading" className="fmp-section-title">
              Share the roadmap with your seller
            </h2>
            <p className="fmp-section-lead">
              The same 120-Day Roadmap your client receives at the assessment — the four months,
              phase by phase, in one document you can forward.
            </p>
            <RoadmapPanel
              surface="brokers_inline"
              ariaLabel="Open ESOP roadmap HTML"
              eyebrow="For your seller & advisors"
              question="Want the four months in one document?"
              bullets={[
                "Month 1: readiness review and independent valuation",
                "Month 2: structure designed and financing placed",
                "Month 3: legal documents and compliance completed",
                "Month 4: closing executed and handover begun",
              ]}
              filenameNote="Opens in a new tab as HTML. Use browser print to save a PDF copy if needed."
              ctaLabel="Open the 120-Day Roadmap (HTML)"
            />
          </section>

          <CheckpointsSection
            checkpoints={BROKER_CHECKPOINTS}
            sectionId="brk-checkpoints"
            headingId="brk-checkpoints-heading"
            title="The checkpoints on the path"
            lead="Four checkpoints, one per month — the same ones we commit to with the founder."
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
