"use client";

import { lazy, Suspense, useState } from "react";
import {
  AfterCloseSection,
  CheckpointsSection,
  ClockDefinitionSection,
  ConfidentialitySection,
  CostGlanceSection,
  DealComparisonSection,
  EligibilitySection,
  FeeDisclosureSection,
  FinalCtaSection,
  FirstCallSection,
  FloatingNav,
  FourPhaseTimeline,
  TaxChecklistSection,
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
        <p className="fmp-hero-eyebrow">How it works</p>
        <h1 className="fmp-hero-title">The Four-Month Path</h1>
        <p className="fmp-hero-sub">
          This is the whole route from first review to a company your
          employees own outright: 120 days from Documents-Ready, in four defined stages, with the fee and the tax treatment stated in writing before you commit. The clock starts when your documents are complete and accepted — what that means, and when the clock pauses, is set out in the clock section below.
        </p>
        <p className="fmp-hero-alternate">
          Haven&apos;t taken the 2-Minute Check yet?{" "}
          <a href="/" className="fmp-hero-alternate-link">Start here</a>{" "}
          — or keep reading to see how the process works.
        </p>
      </header>

      <div className="fmp-layout">
        <div className="fmp-main-col">
          <section id="fmp-owners" className="fmp-section" aria-labelledby="fmp-owners-heading">
            <h2 id="fmp-owners-heading" className="fmp-section-title">
              The owner&apos;s view, kept in one place
            </h2>
            <p className="fmp-section-lead">
              Why owners choose Forhemit, what to realistically expect, how the money moves,
              and what your own job is across the 120 days — that material lives on the
              Business Owners page, so it stays in one place and says one thing.
            </p>
            <p className="fmp-section-lead">
              <a href="/business-owners" className="fmp-hero-alternate-link">
                Read it on the Business Owners page →
              </a>
            </p>
          </section>

          <EligibilitySection />

          <section id="fmp-timeline" className="fmp-section" aria-labelledby="fmp-timeline-heading">
            <h2 id="fmp-timeline-heading" className="fmp-section-title">
              Four phases, from first review to the closing table.
            </h2>
            <p className="fmp-section-lead">
              A traditional sale commonly takes 12–18 months. This path is
              deliberately shorter, because the buyer is already inside the
              building and the structure is decided before the clock starts,
              not negotiated while it runs.
            </p>
            <FourPhaseTimeline phases={FOUR_PHASE_BLOCKS} />
          </section>

          <ClockDefinitionSection />

          <CheckpointsSection checkpoints={FOUR_CHECKPOINTS} />

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
