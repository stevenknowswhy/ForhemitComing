"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import type { TemplateFormHandle } from "../../registry";

// Hooks
import { usePackageForm } from "./hooks/usePackageForm";

// Components
import { StepIndicator } from "./components/inputs";
import {
  LenderInfoStep,
  FinancialsStep,
  ManagementStep,
  AdvisoryStep,
  ForhemitTeamStep,
  ChecklistStep,
  ReviewStep,
  GeneratedOutput,
} from "./components/sections";

// Constants
import { STEPS } from "./constants";

// ── NAVIGATION BUTTONS ───────────────────────────────────────────────────────

interface NavButtonsProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  nextDisabled?: boolean;
}

function NavButtons({
  currentStep,
  onNext,
  onPrev,
  isLastStep,
  nextDisabled,
}: NavButtonsProps) {
  return (
    <div className="pkg-nav-row">
      {currentStep > 0 ? (
        <button className="pkg-btn-nav" onClick={onPrev}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        className={isLastStep ? "pkg-btn-generate" : "pkg-btn-next"}
        onClick={onNext}
        disabled={nextDisabled}
      >
        {isLastStep ? "Review & generate →" : "Next →"}
      </button>
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);
  return (
    <div className="pkg-progress-bar">
      <div className="pkg-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

const SBAESOPPackageForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function SBAESOPPackageForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [checklistWarning, setChecklistWarning] = useState(false);

  const {
    inputs,
    errors,
    updateLender,
    updateFinancial,
    updateManagementPerson,
    updateManagementNotes,
    updateAdvisory,
    updateForhemit,
    updateChecklist,
    validateStep,
    allChecklistItemsConfirmed,
  } = usePackageForm(initialData as Partial<typeof inputs>);

  // Initialize on mount
  useEffect(() => {
    // Any initial setup if needed
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const nextStep = () => {
    // Special handling for checklist step
    if (currentStep === 5) {
      if (!allChecklistItemsConfirmed) {
        setChecklistWarning(true);
        return;
      }
      setChecklistWarning(false);
    }

    if (!validateStep(currentStep)) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowOutput(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Only allow going back to completed steps
    if (step < currentStep) {
      setCurrentStep(step);
      setShowOutput(false);
    }
  };

  // ── Render Step ────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LenderInfoStep
            inputs={inputs.lender}
            onUpdate={updateLender}
            errors={errors}
          />
        );
      case 1:
        return (
          <FinancialsStep
            inputs={inputs.financial}
            onUpdate={updateFinancial}
            errors={errors}
          />
        );
      case 2:
        return (
          <ManagementStep
            inputs={inputs.management}
            onUpdatePerson={updateManagementPerson}
            onUpdateNotes={updateManagementNotes}
          />
        );
      case 3:
        return (
          <AdvisoryStep inputs={inputs.advisory} onUpdate={updateAdvisory} />
        );
      case 4:
        return (
          <ForhemitTeamStep
            inputs={inputs.forhemit}
            onUpdate={updateForhemit}
            errors={errors}
          />
        );
      case 5:
        return (
          <ChecklistStep inputs={inputs.checklist} onUpdate={updateChecklist} />
        );
      case 6:
        return (
          <ReviewStep
            inputs={inputs}
            onGenerate={() => setShowOutput(true)}
            canGenerate={allChecklistItemsConfirmed}
          />
        );
      default:
        return null;
    }
  };

  // ── Expose imperative handle ───────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    getFormData: () =>
      showOutput
        ? { step: currentStep, inputs, generated: true }
        : { step: currentStep, inputs, generated: false },
    getContainerRef: () => containerRef.current,
  }));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="pkg-form-container">
      {showOutput ? (
        <GeneratedOutput inputs={inputs} onBack={() => setShowOutput(false)} />
      ) : (
        <div className="pkg-form-wrapper">
          {/* Header */}
          <header className="pkg-page-header">
            <div className="pkg-brand">
              FORHEMIT <span>STEWARDSHIP MANAGEMENT CO.</span>
            </div>
            <div className="pkg-label">SBA ESOP Lender Package · Form</div>
          </header>

          <div className="pkg-layout">
            {/* Sidebar */}
            <nav className="pkg-sidebar">
              <div className="pkg-sidebar-label">Package sections</div>
              <div className="pkg-nav-list">
                {STEPS.map((step, index) => {
                  const isActive = index === currentStep;
                  const isDone = index < currentStep;
                  const isClickable = index <= currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`pkg-nav-item ${isActive ? "active" : ""} ${
                        isDone ? "done" : ""
                      } ${isClickable ? "clickable" : ""}`}
                      onClick={() => isClickable && goToStep(index)}
                    >
                      <div className="pkg-nav-dot" />
                      <span>{step.label}</span>
                      <span className="pkg-nav-num">{step.num}</span>
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Main Panel */}
            <main className="pkg-main-panel">
              <ProgressBar currentStep={currentStep} />
              {renderStep()}
              <NavButtons
                currentStep={currentStep}
                onNext={nextStep}
                onPrev={prevStep}
                isLastStep={currentStep === STEPS.length - 1}
                nextDisabled={currentStep === 5 && !allChecklistItemsConfirmed}
              />
              {currentStep === 5 && checklistWarning && (
                <div className="pkg-warning-box pkg-warning-floating">
                  <strong>All 10 items must be confirmed.</strong>
                  Check each item to confirm it has been addressed before
                  proceeding.
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
});

export { SBAESOPPackageForm };
export default SBAESOPPackageForm;
