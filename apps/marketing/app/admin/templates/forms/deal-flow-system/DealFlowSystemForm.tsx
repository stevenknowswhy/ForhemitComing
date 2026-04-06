// ── ESOP DEAL FLOW SYSTEM FORM ───────────────────────────────────────────────
//
// A three-stage form for ESOP deal intake, feasibility study, and due diligence.
//
// Stages:
//   1. First Contact (Intake & Qualification)
//   2. Feasibility Study (Analysis & Scoring)
//   3. Due Diligence (Document Review)
//
// ──────────────────────────────────────────────────────────────────────────────

"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { TemplateFormHandle } from "../../registry";

// Hooks
import { useDealFlowForm } from "./hooks/useDealFlowForm";

// Constants
import { STAGES, DEAL_STATUS_OPTIONS } from "./constants";

// Input Components
import { StageIndicator } from "./components/inputs";

// Section Components - Stage 1
import {
  SourceReferralSection,
  BusinessIdentitySection,
  KeyContactsSection,
  QuickQualifiersSection,
  MotivationSection,
  NextStepsSection,
} from "./components/sections";

// Section Components - Stage 2
import {
  OwnerObjectivesSection,
  ValuationSection,
  EmployeePopulationSection,
  ESOPStructureSection,
  FeasibilityFlagsSection,
  ScoringSection,
  GoNoGoSection,
} from "./components/sections";

// Section Components - Stage 3
import {
  LegalDocumentsSection,
  HRDocumentsSection,
  FinancialDocumentsSection,
  LiabilitiesSection,
  InsuranceGovernanceSection,
  Rollover1042Section,
  GapItemsSection,
} from "./components/sections";

// Output
import { DealFlowOutput } from "./components/sections";

// ── PROGRESS BAR COMPONENT ───────────────────────────────────────────────────

function ProgressBar({ currentStage }: { currentStage: number }) {
  const progress = Math.round((currentStage / 3) * 100);
  return (
    <div className="dfs-progress-strip">
      <span>Stage {currentStage} of 3</span>
      <div className="dfs-progress-track">
        <div className="dfs-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span>{progress}%</span>
    </div>
  );
}

// ── NAVIGATION BUTTONS COMPONENT ──────────────────────────────────────────────

interface NavButtonsProps {
  currentStage: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStage: boolean;
  canProceed?: boolean;
}

function NavButtons({
  currentStage,
  onNext,
  onPrev,
  isLastStage,
  canProceed = true,
}: NavButtonsProps) {
  return (
    <div className="dfs-form-actions">
      <div className="dfs-form-actions-left">
        <strong>Stage {currentStage} Complete?</strong>
        <span>
          {isLastStage
            ? "Review all sections before finalizing."
            : `Complete all fields and continue to ${STAGES[currentStage]?.label || "next stage"}.`}
        </span>
      </div>
      <div className="dfs-btn-group">
        {currentStage > 1 && (
          <button type="button" className="dfs-btn-secondary" onClick={onPrev}>
            ← Back to Stage {currentStage - 1}
          </button>
        )}
        <button
          type="button"
          className="dfs-btn-secondary"
          onClick={() => window.print()}
        >
          🖨 Print / Save PDF
        </button>
        <button
          type="button"
          className={isLastStage ? "dfs-btn-generate" : "dfs-btn-nav"}
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLastStage ? "Review Summary →" : `Continue to Stage ${currentStage + 1} →`}
        </button>
      </div>
    </div>
  );
}

// ── MASTHEAD COMPONENT ───────────────────────────────────────────────────────

import type { DealFlowMeta } from "./types";

interface MastheadProps {
  meta: DealFlowMeta;
  onUpdateMeta: (updates: Partial<DealFlowMeta>) => void;
}

function Masthead({ meta, onUpdateMeta }: MastheadProps) {
  return (
    <div className="dfs-masthead">
      <p className="dfs-masthead-eyebrow">Confidential · Internal Advisory Use</p>
      <h1>ESOP Deal Flow System</h1>
      <p className="dfs-masthead-sub">
        Integrated three-stage intake, feasibility study, and due diligence checklist.
      </p>
      <div className="dfs-masthead-meta">
        <div className="dfs-meta-field">
          <span className="dfs-meta-label">Project Code</span>
          <input
            type="text"
            value={meta.projectCode}
            onChange={(e) => onUpdateMeta({ projectCode: e.target.value })}
            placeholder="ESOP-2025-001"
            className="dfs-meta-input"
          />
        </div>
        <div className="dfs-meta-field">
          <span className="dfs-meta-label">Engagement Date</span>
          <input
            type="date"
            value={meta.engagementDate}
            onChange={(e) => onUpdateMeta({ engagementDate: e.target.value })}
            className="dfs-meta-input"
          />
        </div>
        <div className="dfs-meta-field">
          <span className="dfs-meta-label">Lead Advisor</span>
          <input
            type="text"
            value={meta.leadAdvisor}
            onChange={(e) => onUpdateMeta({ leadAdvisor: e.target.value })}
            placeholder="Name"
            className="dfs-meta-input"
          />
        </div>
        <div className="dfs-meta-field">
          <span className="dfs-meta-label">Status</span>
          <select
            value={meta.status}
            onChange={(e) => onUpdateMeta({ status: e.target.value as DealFlowMeta["status"] })}
            className="dfs-meta-input"
          >
            <option value="">Select stage...</option>
            {DEAL_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── STAGE RENDERERS ───────────────────────────────────────────────────────────

function Stage1Sections({
  inputs,
  errors,
  updateSourceReferral,
  updateBusinessIdentity,
  updateKeyContact,
  updateQuickQualifiers,
  updateOwnership,
  updateMotivation,
  updateRedFlags,
  updateNextSteps,
  updateStage1Notes,
}: {
  inputs: ReturnType<typeof useDealFlowForm>["inputs"]["stage1"];
  errors: ReturnType<typeof useDealFlowForm>["errors"];
} & Pick<
  ReturnType<typeof useDealFlowForm>,
  | "updateSourceReferral"
  | "updateBusinessIdentity"
  | "updateKeyContact"
  | "updateQuickQualifiers"
  | "updateOwnership"
  | "updateMotivation"
  | "updateRedFlags"
  | "updateNextSteps"
  | "updateStage1Notes"
>) {
  return (
    <>
      <SourceReferralSection
        data={inputs.sourceReferral}
        updateSourceReferral={updateSourceReferral}
      />
      <BusinessIdentitySection
        data={inputs.businessIdentity}
        errors={errors}
        updateBusinessIdentity={updateBusinessIdentity}
      />
      <KeyContactsSection
        data={inputs.keyContacts}
        updateKeyContact={updateKeyContact}
      />
      <QuickQualifiersSection
        data={inputs.quickQualifiers}
        updateQuickQualifiers={updateQuickQualifiers}
        updateOwnership={updateOwnership}
      />
      <MotivationSection
        data={inputs.motivation}
        redFlags={inputs.redFlags}
        updateMotivation={updateMotivation}
        updateRedFlags={updateRedFlags}
      />
      <NextStepsSection
        nextSteps={inputs.nextSteps}
        internalNotes={inputs.internalNotes}
        updateNextSteps={updateNextSteps}
        updateStage1Notes={updateStage1Notes}
      />
    </>
  );
}

function Stage2Sections({
  inputs,
  updateOwnerObjectives,
  updateValuation,
  updateValuationScenario,
  updateEmployeeCategory,
  updateEmployeePopulation,
  updateESOPStructure,
  updateFeasibilityRedFlags,
  updateScores,
  updateGoNoGo,
  updateSignOff,
}: {
  inputs: ReturnType<typeof useDealFlowForm>["inputs"]["stage2"];
} & Pick<
  ReturnType<typeof useDealFlowForm>,
  | "updateOwnerObjectives"
  | "updateValuation"
  | "updateValuationScenario"
  | "updateEmployeeCategory"
  | "updateEmployeePopulation"
  | "updateESOPStructure"
  | "updateFeasibilityRedFlags"
  | "updateScores"
  | "updateGoNoGo"
  | "updateSignOff"
>) {
  return (
    <>
      <OwnerObjectivesSection
        data={inputs.ownerObjectives}
        updateOwnerObjectives={updateOwnerObjectives}
      />
      <ValuationSection
        data={inputs.valuation}
        updateValuation={updateValuation}
        updateValuationScenario={updateValuationScenario}
      />
      <EmployeePopulationSection
        data={inputs.employeePopulation}
        updateEmployeeCategory={updateEmployeeCategory}
        updateEmployeePopulation={updateEmployeePopulation}
      />
      <ESOPStructureSection
        data={inputs.esopStructure}
        updateESOPStructure={updateESOPStructure}
      />
      <FeasibilityFlagsSection
        data={inputs.redFlags}
        updateFeasibilityRedFlags={updateFeasibilityRedFlags}
      />
      <ScoringSection data={inputs.scores} updateScores={updateScores} />
      <GoNoGoSection
        data={inputs.goNoGo}
        updateGoNoGo={updateGoNoGo}
        updateSignOff={updateSignOff}
      />
    </>
  );
}

function Stage3Sections({
  inputs,
  updateDDDocument,
  updateLiability,
  updateGovernance,
  updateRollover1042,
  updateGapItem,
  updateStage3Notes,
}: {
  inputs: ReturnType<typeof useDealFlowForm>["inputs"]["stage3"];
} & Pick<
  ReturnType<typeof useDealFlowForm>,
  | "updateDDDocument"
  | "updateLiability"
  | "updateGovernance"
  | "updateRollover1042"
  | "updateGapItem"
  | "updateStage3Notes"
>) {
  return (
    <>
      <LegalDocumentsSection
        data={inputs.legalCorporate}
        materialContracts={inputs.materialContracts}
        litigation={inputs.litigation}
        updateDDDocument={updateDDDocument}
      />
      <HRDocumentsSection
        planDocs={inputs.hrPlanDocs}
        participantData={inputs.hrParticipant}
        compensation={inputs.hrCompensation}
        updateDDDocument={updateDDDocument}
      />
      <FinancialDocumentsSection
        financials={inputs.financials}
        tax={inputs.tax}
        dealFinancials={inputs.dealFinancials}
        updateDDDocument={updateDDDocument}
      />
      <LiabilitiesSection
        data={inputs.liabilities}
        updateLiability={updateLiability}
      />
      <InsuranceGovernanceSection
        insurance={inputs.insurance}
        governance={inputs.governance}
        updateDDDocument={updateDDDocument}
        updateGovernance={updateGovernance}
      />
      <Rollover1042Section
        data={inputs.rollover1042}
        updateRollover1042={updateRollover1042}
      />
      <GapItemsSection
        gapItems={inputs.gapItems}
        advisorNotes={inputs.advisorNotes}
        updateGapItem={updateGapItem}
        updateStage3Notes={updateStage3Notes}
      />
    </>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

const DealFlowSystemForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function DealFlowSystemForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [showOutput, setShowOutput] = useState(false);

  const {
    inputs,
    errors,
    feasibilityScore,
    canProceedToStage3,
    updateMeta,
    // Stage 1
    updateSourceReferral,
    updateBusinessIdentity,
    updateKeyContact,
    updateQuickQualifiers,
    updateOwnership,
    updateMotivation,
    updateRedFlags,
    updateNextSteps,
    updateStage1Notes,
    // Stage 2
    updateOwnerObjectives,
    updateValuation,
    updateValuationScenario,
    updateEmployeeCategory,
    updateEmployeePopulation,
    updateESOPStructure,
    updateFeasibilityRedFlags,
    updateScores,
    updateGoNoGo,
    updateSignOff,
    // Stage 3
    updateDDDocument,
    updateLiability,
    updateGovernance,
    updateRollover1042,
    updateGapItem,
    updateStage3Notes,
    // Validation
    validateStage,
  } = useDealFlowForm(initialData as Partial<typeof inputs>);

  // Navigation
  const nextStage = () => {
    if (!validateStage(currentStage as 1 | 2 | 3)) return;

    // Special check for Stage 2 → 3
    if (currentStage === 2 && !canProceedToStage3) {
      // Allow proceeding but show warning - user can still continue
    }

    if (currentStage < 3) {
      setCurrentStage(currentStage + 1);
    } else {
      setShowOutput(true);
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const goToStage = (stage: number) => {
    if (stage <= currentStage) {
      setCurrentStage(stage);
      setShowOutput(false);
    }
  };

  // Render current stage content
  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <Stage1Sections
            inputs={inputs.stage1}
            errors={errors}
            updateSourceReferral={updateSourceReferral}
            updateBusinessIdentity={updateBusinessIdentity}
            updateKeyContact={updateKeyContact}
            updateQuickQualifiers={updateQuickQualifiers}
            updateOwnership={updateOwnership}
            updateMotivation={updateMotivation}
            updateRedFlags={updateRedFlags}
            updateNextSteps={updateNextSteps}
            updateStage1Notes={updateStage1Notes}
          />
        );
      case 2:
        return (
          <Stage2Sections
            inputs={inputs.stage2}
            updateOwnerObjectives={updateOwnerObjectives}
            updateValuation={updateValuation}
            updateValuationScenario={updateValuationScenario}
            updateEmployeeCategory={updateEmployeeCategory}
            updateEmployeePopulation={updateEmployeePopulation}
            updateESOPStructure={updateESOPStructure}
            updateFeasibilityRedFlags={updateFeasibilityRedFlags}
            updateScores={updateScores}
            updateGoNoGo={updateGoNoGo}
            updateSignOff={updateSignOff}
          />
        );
      case 3:
        return (
          <Stage3Sections
            inputs={inputs.stage3}
            updateDDDocument={updateDDDocument}
            updateLiability={updateLiability}
            updateGovernance={updateGovernance}
            updateRollover1042={updateRollover1042}
            updateGapItem={updateGapItem}
            updateStage3Notes={updateStage3Notes}
          />
        );
      default:
        return null;
    }
  };

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    getFormData: () =>
      showOutput
        ? { stage: currentStage, inputs, generated: true }
        : { stage: currentStage, inputs, generated: false },
    getContainerRef: () => containerRef.current,
  }));

  return (
    <div ref={containerRef} className="dfs-container">
      {showOutput ? (
        <DealFlowOutput inputs={inputs} onBack={() => setShowOutput(false)} />
      ) : (
        <>
          <Masthead meta={inputs.meta} onUpdateMeta={updateMeta} />
          <StageIndicator
            currentStage={currentStage}
            onStageClick={goToStage}
          />
          <ProgressBar currentStage={currentStage} />
          <div className="dfs-page-wrapper">
            {renderStage()}
            <NavButtons
              currentStage={currentStage}
              onNext={nextStage}
              onPrev={prevStage}
              isLastStage={currentStage === 3}
              canProceed={true}
            />
          </div>
        </>
      )}
    </div>
  );
});

export { DealFlowSystemForm };
export default DealFlowSystemForm;
