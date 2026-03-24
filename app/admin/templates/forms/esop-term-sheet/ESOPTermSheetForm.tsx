"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../../registry";

// Types & Constants
import { UserInputs, Scenario } from "./types";
import { DEFAULT_INPUTS, NAVY } from "./constants";

// Hooks
import { useTermSheetCalculations } from "./hooks/useTermSheetCalculations";

// Formatters
import { fmt } from "./lib/formatters";

// Form Input Components
import { StepIndicator, NumInput, RadioSelect, FormStep } from "./components/inputs";

// Tab Content Components
import {
  TermSheetTab,
  SourcesUsesTab,
  DebtServiceTab,
  SellerEconomicsTab,
  OpenItemsTab,
} from "./components/sections";

// ── TERM SHEET DISPLAY COMPONENT ─────────────────────────────────────────────

interface TermSheetDisplayProps {
  inputs: UserInputs;
  scenarios: { A: Scenario; B: Scenario };
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  onBack: () => void;
}

const TAB_DEFINITIONS = [
  { id: "termsheet", label: "Term Sheet" },
  { id: "stack", label: "Sources & Uses" },
  { id: "dscr", label: "Debt Service" },
  { id: "seller", label: "Seller Economics" },
  { id: "open", label: "Open Items" },
];

function TermSheetDisplay({
  inputs,
  scenarios,
  activeScenario,
  onScenarioChange,
  onBack,
}: TermSheetDisplayProps) {
  const [activeTab, setActiveTab] = useState("termsheet");
  const scenario = scenarios[activeScenario as keyof typeof scenarios];

  const renderTabContent = () => {
    const tabProps = {
      scenario,
      scenarios,
      activeScenario,
      onScenarioChange,
      inputs,
    };

    switch (activeTab) {
      case "termsheet":
        return <TermSheetTab {...tabProps} />;
      case "stack":
        return <SourcesUsesTab {...tabProps} />;
      case "dscr":
        return <DebtServiceTab {...tabProps} />;
      case "seller":
        return <SellerEconomicsTab {...tabProps} />;
      case "open":
        return <OpenItemsTab scenario={scenario} inputs={inputs} />;
      default:
        return <TermSheetTab {...tabProps} />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="term-header">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "#7dd3fc",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Presented by
            </div>
            <div
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: 21,
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              Forhemit Stewardship Management Co.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: "#7dd3fc",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Customized Term Sheet
            </div>
            <div
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {fmt(inputs.purchasePrice)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="term-tabs">
          {TAB_DEFINITIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`term-tab ${activeTab === t.id ? "active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="term-content">{renderTabContent()}</div>

        {/* Footer */}
        <div className="term-footer">
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#9ca3af",
            }}
          >
            Forhemit Stewardship Management Co. · California PBC · San
            Francisco, CA
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#9ca3af",
            }}
          >
            CUSTOMIZED CALCULATION — NOT A COMMITMENT TO LEND ·{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {/* Back Button */}
        <div className="term-back-btn-container">
          <button className="term-back-btn" onClick={onBack}>
            ← Edit Inputs
          </button>
        </div>
      </div>
    </div>
  );
}

// ── INPUT FORM COMPONENT ─────────────────────────────────────────────────────

interface InputFormProps {
  inputs: UserInputs;
  currentStep: number;
  onUpdateInput: (field: keyof UserInputs, value: UserInputs[keyof UserInputs]) => void;
  onNext: () => void;
  onPrev: () => void;
}

function InputForm({
  inputs,
  currentStep,
  onUpdateInput,
  onNext,
  onPrev,
}: InputFormProps) {
  const totalCosts =
    inputs.forhemitFee +
    inputs.sbaFee +
    inputs.stampTax +
    inputs.qoeFee +
    inputs.legalFee +
    inputs.cpaFee;

  return (
    <div className="term-form-wrapper">
      <div className="term-form-header">
        <h2 className="term-form-title">ESOP Term Sheet Calculator</h2>
        <p className="term-form-subtitle">
          Enter your deal details to generate a customized term sheet with
          SBA-compliant calculations
        </p>
      </div>

      <StepIndicator currentStep={currentStep} />

      {/* Form Steps */}
      <div className="term-form-steps">
        <FormStep step={1} currentStep={currentStep} title="Deal Basics">
          <NumInput
            label="Purchase Price"
            value={inputs.purchasePrice}
            onChange={(v) => onUpdateInput("purchasePrice", v)}
            placeholder="10000000"
          />
          <NumInput
            label="Annual EBITDA"
            value={inputs.ebitda}
            onChange={(v) => onUpdateInput("ebitda", v)}
            placeholder="2500000"
          />
          <NumInput
            label="Federal Capital Gains Tax Rate"
            value={inputs.taxRate}
            onChange={(v) => onUpdateInput("taxRate", v)}
            prefix=""
            suffix="%"
            placeholder="23.8"
          />
        </FormStep>

        <FormStep step={2} currentStep={currentStep} title="Financing Structure">
          <NumInput
            label="SBA 7(a) Loan Amount"
            value={inputs.sbaLoanAmount}
            onChange={(v) => onUpdateInput("sbaLoanAmount", v)}
            placeholder="5000000"
          />
          <NumInput
            label="ESOP Loan Interest Rate"
            value={inputs.esopLoanRate}
            onChange={(v) => onUpdateInput("esopLoanRate", v)}
            prefix=""
            suffix="%"
            placeholder="8.5"
          />
          <NumInput
            label="ESOP Loan Term"
            value={inputs.esopLoanTerm}
            onChange={(v) => onUpdateInput("esopLoanTerm", v)}
            prefix=""
            suffix="years"
            placeholder="7"
          />
        </FormStep>

        <FormStep step={3} currentStep={currentStep} title="Transaction Costs">
          <NumInput
            label="Forhemit Fee"
            value={inputs.forhemitFee}
            onChange={(v) => onUpdateInput("forhemitFee", v)}
            placeholder="25000"
          />
          <NumInput
            label="SBA Guarantee Fee"
            value={inputs.sbaFee}
            onChange={(v) => onUpdateInput("sbaFee", v)}
            placeholder="138125"
          />
          <NumInput
            label="Stamp Tax"
            value={inputs.stampTax}
            onChange={(v) => onUpdateInput("stampTax", v)}
            placeholder="35000"
          />
          <NumInput
            label="Quality of Earnings (QofE)"
            value={inputs.qoeFee}
            onChange={(v) => onUpdateInput("qoeFee", v)}
            placeholder="25000"
          />
          <NumInput
            label="Legal Fees"
            value={inputs.legalFee}
            onChange={(v) => onUpdateInput("legalFee", v)}
            placeholder="25000"
          />
          <NumInput
            label="CPA/Tax Advisor Fees"
            value={inputs.cpaFee}
            onChange={(v) => onUpdateInput("cpaFee", v)}
            placeholder="15000"
          />
        </FormStep>

        <FormStep step={4} currentStep={currentStep} title="Deal Stage & Review">
          <RadioSelect
            label="Current Deal Stage"
            value={inputs.dealStage}
            onChange={(v) => onUpdateInput("dealStage", v as UserInputs["dealStage"])}
            options={[
              { value: "preloi", label: "Pre-LOI", desc: "Initial discussions" },
              { value: "mid", label: "Mid-Diligence", desc: "Due diligence in progress" },
              { value: "postfmv", label: "Post-FMV", desc: "ERISA valuation complete" },
            ]}
          />

          <div className="term-review-section">
            <h4>Review Your Inputs</h4>
            <div className="term-review-grid">
              <div className="term-review-item">
                <span>Purchase Price:</span>
                <strong>{fmt(inputs.purchasePrice)}</strong>
              </div>
              <div className="term-review-item">
                <span>EBITDA:</span>
                <strong>{fmt(inputs.ebitda)}</strong>
              </div>
              <div className="term-review-item">
                <span>SBA Loan:</span>
                <strong>{fmt(inputs.sbaLoanAmount)}</strong>
              </div>
              <div className="term-review-item">
                <span>Total Costs:</span>
                <strong>{fmt(totalCosts)}</strong>
              </div>
            </div>
          </div>
        </FormStep>
      </div>

      {/* Navigation */}
      <div className="term-form-navigation">
        <button
          className="term-nav-btn term-nav-prev"
          onClick={onPrev}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <div className="term-nav-steps">{currentStep} of 4</div>
        <button className="term-nav-btn term-nav-next" onClick={onNext}>
          {currentStep === 4 ? "Generate Term Sheet" : "Next"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

const ESOPTermSheetForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function ESOPTermSheetForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [showTermSheet, setShowTermSheet] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<UserInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
  });
  const [activeScenario, setActiveScenario] = useState<string>(
    (initialData?.scen as string) ?? "B"
  );

  // Calculations
  const scenarios = useTermSheetCalculations(inputs);

  // Handlers
  const updateInput = (field: keyof UserInputs, value: UserInputs[keyof UserInputs]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTermSheet(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    getFormData: () =>
      showTermSheet
        ? { tab: "termsheet", scen: activeScenario, inputs }
        : { inputs, currentStep },
    getContainerRef: () => containerRef.current,
  }));

  return (
    <div ref={containerRef} className="term-form-container">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');`}</style>
      
      {showTermSheet ? (
        <TermSheetDisplay
          inputs={inputs}
          scenarios={scenarios}
          activeScenario={activeScenario}
          onScenarioChange={setActiveScenario}
          onBack={() => setShowTermSheet(false)}
        />
      ) : (
        <InputForm
          inputs={inputs}
          currentStep={currentStep}
          onUpdateInput={updateInput}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
    </div>
  );
});

export { ESOPTermSheetForm };
export default ESOPTermSheetForm;
