"use client";

import React, { forwardRef, useRef, useImperativeHandle, useCallback, useEffect } from "react";
import { TemplateFormHandle } from "../../registry";
import { useRepaymentModel } from "./hooks/useRepaymentModel";
import { ViewTab, ScenarioTab } from "./types";
import {
  StepIndicator,
  DealHeaderSection,
  AdvisorTeamSection,
  SellingShareholderSection,
  SBALoanSection,
  SellerNoteSection,
  ProjectionsSection,
  MetricsPanel,
  PrintCover,
  WaterfallPanel,
  AmortizationTable,
  DSCRPanel,
  ChartPanel,
  ScenarioPanel,
  UnderwritingSummary,
} from "./components/sections";

const RepaymentModelForm = forwardRef<TemplateFormHandle, { initialData?: Record<string, unknown> }>(
  function RepaymentModelForm({ initialData }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      inputs,
      currentStep,
      activeView,
      activeScenario,
      validationErrors,
      setCurrentStep,
      updateHeaderField,
      updateAdvisorField,
      updateSellerField,
      updateSBALoanField,
      updateSellerNoteField,
      updateProjectionField,
      setActiveView,
      setActiveScenario,
      validateStep1,
      validateStep2,
      schedule,
      scenarios,
      waterfall,
      metrics,
    } = useRepaymentModel(initialData as unknown as Partial<typeof inputs>);

    const errorMap = new Map(validationErrors.map((e) => [e.field, e.message]));

    // Get scenario rows for DSCR view
    const scenarioRows = scenarios.find((s) => s.name.toLowerCase().includes(activeScenario.replace("stress2", "deep").replace("upside", "upside")))?.rows || schedule;

    const handleStepClick = useCallback(
      (step: number) => {
        if (step === 2 && currentStep === 1) {
          if (!validateStep1()) return;
        }
        if (step === 3 && currentStep === 2) {
          if (!validateStep2()) return;
        }
        setCurrentStep(step);
      },
      [currentStep, validateStep1, validateStep2, setCurrentStep]
    );

    const handleContinueToStep2 = useCallback(() => {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }, [validateStep1, setCurrentStep]);

    const handleContinueToStep3 = useCallback(() => {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }, [validateStep2, setCurrentStep]);

    // Imperative handle for PDF generation
    useImperativeHandle(
      ref,
      () => ({
        getFormData: () => inputs as unknown as Record<string, unknown>,
        getContainerRef: () => containerRef.current,
      }),
      [inputs]
    );

    // View tabs for step 3
    const viewTabs: { id: ViewTab; label: string }[] = [
      { id: "amort", label: "Amortization schedule" },
      { id: "dscr", label: "DSCR by year" },
      { id: "chart", label: "Paydown chart" },
      { id: "scen", label: "Scenario analysis" },
    ];

    return (
      <div className="erm-form-container" ref={containerRef}>
        <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

        <div className="erm-page">
          {/* STEP 1: Deal Header */}
          {currentStep === 1 && (
            <>
              <DealHeaderSection
                header={inputs.header}
                onUpdateField={updateHeaderField}
                errors={errorMap}
              />
              <AdvisorTeamSection advisors={inputs.advisors} onUpdateField={updateAdvisorField} />
              <SellingShareholderSection
                seller={inputs.seller}
                onUpdateField={updateSellerField}
              />

              <div className="erm-form-nav">
                <div />
                <button className="erm-btn erm-btn-primary" onClick={handleContinueToStep2}>
                  Continue to debt structure →
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Debt Structure & Projections */}
          {currentStep === 2 && (
            <>
              <SBALoanSection loan={inputs.sbaLoan} onUpdateField={updateSBALoanField} />
              <SellerNoteSection note={inputs.sellerNote} onUpdateField={updateSellerNoteField} />
              <ProjectionsSection
                projections={inputs.projections}
                onUpdateField={updateProjectionField}
              />

              <MetricsPanel metrics={metrics} waterfall={waterfall} />

              <div className="erm-form-nav">
                <button className="erm-btn erm-btn-ghost" onClick={() => setCurrentStep(1)}>
                  ← Back
                </button>
                <button className="erm-btn erm-btn-primary" onClick={handleContinueToStep3}>
                  Generate model output →
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Model Output & Print */}
          {currentStep === 3 && (
            <>
              <PrintCover header={inputs.header} totalDebt={metrics.totalDebt} />

              <div className="erm-metrics-strip">
                <div className="erm-metric-card">
                  <div className="erm-metric-label">Total debt</div>
                  <div className="erm-metric-value">
                    {metrics.totalDebt > 0
                      ? "$" + Math.round(metrics.totalDebt / 1000).toLocaleString() + "K"
                      : "—"}
                  </div>
                  <div className="erm-metric-sub">
                    SBA{" "}
                    {inputs.sbaLoan.amount > 0
                      ? "$" + Math.round(inputs.sbaLoan.amount / 1000).toLocaleString() + "K"
                      : "—"}{" "}
                    · Note{" "}
                    {inputs.sellerNote.amount > 0
                      ? "$" + Math.round(inputs.sellerNote.amount / 1000).toLocaleString() + "K"
                      : "—"}
                  </div>
                </div>
                <div className="erm-metric-card">
                  <div className="erm-metric-label">Year 1 DSCR</div>
                  <div
                    className="erm-metric-value"
                    style={{ color: metrics.year1Dscr && metrics.year1Dscr >= 1.5 ? "#0D6E5A" : metrics.year1Dscr && metrics.year1Dscr >= 1.25 ? "#B85C00" : "#9E2B2B" }}
                  >
                    {metrics.year1Dscr ? metrics.year1Dscr.toFixed(2) + "x" : "—"}
                  </div>
                  <div className="erm-metric-sub">
                    {metrics.year1Dscr && metrics.year1Dscr >= 1.5 ? (
                      <span className="erm-pill erm-pill-pass">Pass</span>
                    ) : metrics.year1Dscr && metrics.year1Dscr >= 1.25 ? (
                      <span className="erm-pill erm-pill-warn">Min</span>
                    ) : (
                      <span className="erm-pill erm-pill-fail">Below</span>
                    )}
                  </div>
                </div>
                <div className="erm-metric-card">
                  <div className="erm-metric-label">Min DSCR (all years)</div>
                  <div
                    className="erm-metric-value"
                    style={{ color: metrics.minDscr && metrics.minDscr >= 1.5 ? "#0D6E5A" : metrics.minDscr && metrics.minDscr >= 1.25 ? "#B85C00" : "#9E2B2B" }}
                  >
                    {metrics.minDscr ? metrics.minDscr.toFixed(2) + "x" : "—"}
                  </div>
                  <div className="erm-metric-sub">
                    {metrics.minDscr && metrics.minDscr >= 1.5 ? (
                      <span className="erm-pill erm-pill-pass">Pass</span>
                    ) : metrics.minDscr && metrics.minDscr >= 1.25 ? (
                      <span className="erm-pill erm-pill-warn">Min</span>
                    ) : (
                      <span className="erm-pill erm-pill-fail">Below</span>
                    )}
                  </div>
                </div>
                <div className="erm-metric-card">
                  <div className="erm-metric-label">Total interest cost</div>
                  <div className="erm-metric-value">
                    {metrics.totalInterestCost > 0
                      ? "$" + Math.round(metrics.totalInterestCost / 1000).toLocaleString() + "K"
                      : "—"}
                  </div>
                  <div className="erm-metric-sub">Over full loan life</div>
                </div>
              </div>

              <WaterfallPanel
                waterfall={waterfall}
                snSubordination={inputs.sellerNote.subordination}
                year1Dscr={metrics.year1Dscr}
              />

              <div className="erm-card">
                <div className="erm-card-header" style={{ padding: 0, background: "var(--erm-white)" }}>
                  <div className="erm-view-tabs">
                    {viewTabs.map((tab) => (
                      <div
                        key={tab.id}
                        className={`erm-view-tab ${activeView === tab.id ? "active" : ""}`}
                        onClick={() => setActiveView(tab.id)}
                      >
                        {tab.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="erm-card-body">
                  {activeView === "amort" && <AmortizationTable rows={schedule} />}
                  {activeView === "dscr" && (
                    <DSCRPanel
                      rows={scenarioRows}
                      activeScenario={activeScenario}
                      onScenarioChange={setActiveScenario}
                    />
                  )}
                  {activeView === "chart" && <ChartPanel rows={schedule} />}
                  {activeView === "scen" && <ScenarioPanel scenarios={scenarios} />}
                </div>
              </div>

              <UnderwritingSummary inputs={inputs} metrics={metrics} />

              <div className="erm-form-nav erm-no-print">
                <button className="erm-btn erm-btn-ghost" onClick={() => setCurrentStep(2)}>
                  ← Back to inputs
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="erm-btn erm-btn-ghost" onClick={() => setCurrentStep(1)}>
                    Edit deal header
                  </button>
                  <button className="erm-btn erm-btn-print" onClick={() => window.print()}>
                    ⎙ Print / Save PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

export default RepaymentModelForm;
export { RepaymentModelForm };
