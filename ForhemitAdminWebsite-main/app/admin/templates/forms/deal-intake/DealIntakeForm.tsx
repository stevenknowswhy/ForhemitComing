"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import type { TemplateFormHandle } from "../../registry";

// Types & Constants
import { DealInputs, BusinessInfo, FinancialInputs, CapitalStack, DSCRInputs, OpenItem } from "./types";
import { DEFAULT_INPUTS, OPEN_ITEM_DEFINITIONS } from "./constants";

// Hooks
import { useDealCalculations } from "./hooks/useDealCalculations";

// Components
import { StepIndicator } from "./components/inputs";
import {
  DealBasicsStep,
  CapitalStackStep,
  DSCRScenarioStep,
  OpenItemsStep,
  CreditMemoOutput,
} from "./components/sections";

// ── NAVIGATION BUTTONS ────────────────────────────────────────────────────────

interface NavButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
}

function NavButtons({ currentStep, onNext, onPrev, isLastStep }: NavButtonsProps) {
  return (
    <div className="di-nav-row">
      {currentStep > 0 ? (
        <button className="di-btn-back" onClick={onPrev}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        className={isLastStep ? "di-btn-generate" : "di-btn-next"}
        onClick={onNext}
      >
        {isLastStep ? "Generate credit memo preview →" : "Continue →"}
      </button>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

const DealIntakeForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function DealIntakeForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize state with defaults and open items
  const [inputs, setInputs] = useState<DealInputs>(() => {
    const base = { ...DEFAULT_INPUTS, ...initialData } as DealInputs;
    // Initialize open items if empty
    if (!base.openItems || base.openItems.length === 0) {
      base.openItems = OPEN_ITEM_DEFINITIONS.map((def) => ({
        ...def,
        resolved: false,
      }));
    }
    return base;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [errors, setErrors] = useState<{ purchasePrice?: string; ebitda?: string }>({});

  // Calculations
  const { calculated, dscr, activeEbitda } = useDealCalculations(inputs);

  // Initialize open items on mount if needed
  useEffect(() => {
    if (inputs.openItems.length === 0) {
      setInputs((prev) => ({
        ...prev,
        openItems: OPEN_ITEM_DEFINITIONS.map((def) => ({
          ...def,
          resolved: false,
        })),
      }));
    }
  }, []);

  // Update handlers
  const updateBusiness = (updates: Partial<BusinessInfo>) => {
    setInputs((prev) => ({
      ...prev,
      business: { ...prev.business, ...updates },
    }));
  };

  const updateFinancial = (updates: Partial<FinancialInputs>) => {
    setInputs((prev) => ({
      ...prev,
      financial: { ...prev.financial, ...updates },
    }));
    // Clear errors when user updates
    if (updates.purchasePrice) setErrors((e) => ({ ...e, purchasePrice: undefined }));
    if (updates.ebitda) setErrors((e) => ({ ...e, ebitda: undefined }));
  };

  const updateCapital = (updates: Partial<CapitalStack>) => {
    setInputs((prev) => ({
      ...prev,
      capital: { ...prev.capital, ...updates },
    }));
  };

  const updateDscr = (updates: Partial<DSCRInputs>) => {
    setInputs((prev) => ({
      ...prev,
      dscr: { ...prev.dscr, ...updates },
    }));
  };

  const updateOpenItem = (index: number, resolved: boolean) => {
    setInputs((prev) => {
      const newItems = [...prev.openItems];
      newItems[index] = { ...newItems[index], resolved };
      return { ...prev, openItems: newItems };
    });
  };

  const updateNotes = (notes: string) => {
    setInputs((prev) => ({ ...prev, lenderNotes: notes }));
  };

  // Navigation
  const validateStep = (step: number): boolean => {
    if (step === 0) {
      const newErrors: typeof errors = {};
      if (!inputs.financial.purchasePrice) {
        newErrors.purchasePrice = "Purchase price is required.";
      }
      if (!inputs.financial.ebitda) {
        newErrors.ebitda = "EBITDA is required.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 3) {
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
    if (step <= currentStep) {
      setCurrentStep(step);
      setShowOutput(false);
    }
  };

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    getFormData: () =>
      showOutput
        ? { step: currentStep, inputs, calculated, dscr }
        : { step: currentStep, inputs },
    getContainerRef: () => containerRef.current,
  }));

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DealBasicsStep
            inputs={inputs}
            onUpdateBusiness={updateBusiness}
            onUpdateFinancial={updateFinancial}
            errors={errors}
          />
        );
      case 1:
        return (
          <CapitalStackStep
            inputs={inputs}
            onUpdateCapital={updateCapital}
            calculated={calculated}
          />
        );
      case 2:
        return (
          <DSCRScenarioStep
            inputs={inputs}
            onUpdateDscr={updateDscr}
            dscr={dscr}
            activeEbitda={activeEbitda}
          />
        );
      case 3:
        return (
          <OpenItemsStep
            inputs={inputs}
            onUpdateOpenItem={updateOpenItem}
            onUpdateNotes={updateNotes}
          />
        );
      default:
        return null;
    }
  };

  // Credit memo data
  const creditMemoData = {
    inputs,
    calculated,
    dscr,
    activeEbitda,
    resolvedCount: inputs.openItems.filter((i) => i.resolved).length,
    unresolvedItems: inputs.openItems.filter((i) => !i.resolved).map((i) => i.title),
  };

  return (
    <div ref={containerRef} className="di-container">
      {showOutput ? (
        <CreditMemoOutput
          data={creditMemoData}
          onBack={() => setShowOutput(false)}
        />
      ) : (
        <div className="di-form-wrap">
          {/* Header */}
          <div className="di-header">
            <div className="di-header-label">
              Forhemit Transition Stewardship Co.
            </div>
            <h1>Deal intake — illustrative credit memo</h1>
            <p>
              Transaction manager & post-close stewardship provider. Forhemit does
              not appear in the capital stack.
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <NavButtons
            currentStep={currentStep}
            totalSteps={4}
            onNext={nextStep}
            onPrev={prevStep}
            isLastStep={currentStep === 3}
          />
        </div>
      )}
    </div>
  );
});

export { DealIntakeForm };
export default DealIntakeForm;
