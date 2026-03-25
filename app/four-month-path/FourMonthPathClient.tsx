"use client";

import { lazy, Suspense, useState } from "react";
import {
  AfterCloseSection,
  CheckpointsSection,
  ConfidentialitySection,
  CostGlanceSection,
  DealComparisonSection,
  EligibilitySection,
  FeeDisclosureSection,
  FinalCtaSection,
  FirstCallSection,
  FloatingNav,
  FourPhaseTimeline,
  HowMoneyMovesSection,
  RoadmapPanel,
  TaxChecklistSection,
  TimelineRealismSection,
  WhatsMyJobSection,
  WhyForhemitSection,
} from "./components";
import { FOUR_CHECKPOINTS, FOUR_PHASE_BLOCKS } from "./constants";
import { ConfidentialIntakeModal } from "@/app/business-owners/components";
import "@/app/home/intake/styles/classification-intake-modal.css";
import "./styles/four-month-path.css";
import "./styles/fee-transparency.css";
import "./styles/deal-comparison.css";
import "./styles/sections.css";

const TwoMinuteCheckModal = lazy(() =>
  import("@/app/home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

export function FourMonthPathClient() {
  const [showTwoMinuteCheck, setShowTwoMinuteCheck] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intakePath, setIntakePath] = useState<"nda" | "light" | null>(null);

  const openIntake = (path?: "nda" | "light") => {
    setIntakePath(path ?? null);
    setShowIntake(true);
  };

  const handleTwoMinuteCheckPass = () => {
    // User passed the check, stay on this page (already on four-month-path)
    setShowTwoMinuteCheck(false);
  };

  return (
    <main className="fmp-page">
      <div className="fmp-bg" aria-hidden />

      <header className="fmp-hero">
        <p className="fmp-hero-eyebrow">You passed the 2-Minute Check</p>
        <h1 className="fmp-hero-title">Congratulations</h1>
        <p className="fmp-hero-sub">
          Based on your answers, a roughly <strong>four-month path</strong> to close is realistic. Below is the
          same timeline we walk owners through—plain English, no jargon.
        </p>
        <p className="fmp-hero-alternate">
          Haven&apos;t taken the 2-Minute Check yet?{" "}
          <a href="/" className="fmp-hero-alternate-link">Start here</a>{" "}
          — or keep reading to see how the process works.
        </p>
      </header>

      <div className="fmp-layout">
        <div className="fmp-main-col">
          <WhyForhemitSection />

          <EligibilitySection />

          <section id="fmp-timeline" className="fmp-section" aria-labelledby="fmp-timeline-heading">
            <h2 id="fmp-timeline-heading" className="fmp-section-title">
              The 4-Month Path Timeline
            </h2>
            <p className="fmp-section-lead">
              Four phases from first numbers to check in hand. Your team clears a checkpoint at each stage so
              there are no surprises at closing.
            </p>
            <FourPhaseTimeline phases={FOUR_PHASE_BLOCKS} />
          </section>

          <TimelineRealismSection />

          <RoadmapPanel surface="four_month_path_inline" variant="inline" />

          <CheckpointsSection checkpoints={FOUR_CHECKPOINTS} />

          <HowMoneyMovesSection />

          <WhatsMyJobSection />

          <ConfidentialitySection />

          <DealComparisonSection />

          <TaxChecklistSection />

          <CostGlanceSection />

          <FeeDisclosureSection />

          <AfterCloseSection />

          <FirstCallSection />

          <FinalCtaSection
            onStartTwoMinuteCheck={() => setShowTwoMinuteCheck(true)}
            onBeginIntake={() => openIntake("nda")}
          />
        </div>

        <div className="fmp-sidebar-col">
          <FloatingNav />
        </div>
      </div>

      {showTwoMinuteCheck && (
        <Suspense fallback={null}>
          <TwoMinuteCheckModal
            isOpen={showTwoMinuteCheck}
            onClose={() => setShowTwoMinuteCheck(false)}
            onPassProceed={handleTwoMinuteCheckPass}
          />
        </Suspense>
      )}

      <ConfidentialIntakeModal
        isOpen={showIntake}
        onClose={() => setShowIntake(false)}
        defaultPath={intakePath}
      />
    </main>
  );
}
