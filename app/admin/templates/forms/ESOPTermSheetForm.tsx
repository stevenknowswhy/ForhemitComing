"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../registry";

// ── FORM INPUTS INTERFACE ────────────────────────────────────────────────────
interface UserInputs {
  // Step 1: Basic Deal Info
  purchasePrice: number;
  ebitda: number;
  taxRate: number;

  // Step 2: Financing Structure
  sbaLoanAmount: number;
  esopLoanRate: number;
  esopLoanTerm: number;

  // Step 3: Cost Estimates
  forhemitFee: number;
  trusteeFee: number;
  appraisalFee: number;
  counselFee: number;
  sbaFee: number;
  stampTax: number;
  qoeFee: number;
  legalFee: number;
  cpaFee: number;

  // Step 4: Deal Stage
  dealStage: "preloi" | "mid" | "postfmv";
}

// ── DEFAULT VALUES ───────────────────────────────────────────────────────────
const DEFAULT_INPUTS: UserInputs = {
  purchasePrice: 10_000_000,
  ebitda: 2_500_000,
  taxRate: 23.8,
  sbaLoanAmount: 5_000_000, // SBA 7(a) cap
  esopLoanRate: 8.5,
  esopLoanTerm: 7,
  forhemitFee: 25_000,
  trusteeFee: 0, // Calculated based on stage
  appraisalFee: 0, // Calculated based on stage
  counselFee: 0, // Calculated based on stage
  sbaFee: 138_125, // 3.5% on first $1M + 3.75% on remaining $4M
  stampTax: 35_000, // ~0.35% of $10M
  qoeFee: 25_000,
  legalFee: 25_000,
  cpaFee: 15_000,
  dealStage: "mid",
};

// ── CALCULATION FUNCTIONS ───────────────────────────────────────────────────
function calculateScenarios(inputs: UserInputs) {
  const { purchasePrice, ebitda, taxRate, sbaLoanAmount, esopLoanRate, esopLoanTerm } = inputs;

  // Base financials
  const dAndA = 150_000; // Estimated
  const ebit = ebitda - dAndA;
  const taxes = ebit * (taxRate / 100);
  const nopat = ebit - taxes;
  const ocf = nopat + dAndA;

  // SBA loan details (10-year fully amortizing, ~7.75%)
  const sbaRate = 7.75 / 100;
  const sbaTerm = 10;
  const sbaPayment = (sbaLoanAmount * sbaRate / 12) / (1 - Math.pow(1 + sbaRate / 12, -sbaTerm * 12));
  const sbaAnnualDS = sbaPayment * 12;

  // ESOP loan sizing for 1.25x OCF DSCR
  const targetDscr = 1.25;
  const maxAnnualDS = ocf / targetDscr;
  const esopAnnualDS = maxAnnualDS - sbaAnnualDS;
  const esopLoanAmount = esopAnnualDS * (1 - Math.pow(1 + esopLoanRate / 100 / 12, -esopLoanTerm * 12)) / (esopLoanRate / 100 / 12);

  // Capital structure
  const sellerNoteAmount = purchasePrice - sbaLoanAmount - esopLoanAmount;
  const totalCapital = purchasePrice + inputs.sbaFee + inputs.stampTax + 350_000; // Closing costs

  // Seller economics
  const sellerCash = purchasePrice - sellerNoteAmount;
  const sellerCashPct = (sellerCash / purchasePrice) * 100;

  // Create scenarios with different EBITDA levels
  const createScenario = (scenarioEbitda: number, label: string, sub: string) => {
    const scenarioOcf = (scenarioEbitda - dAndA) * (1 - taxRate / 100) + dAndA;
    const scenarioEsopDS = Math.max(0, (scenarioOcf / targetDscr) - sbaAnnualDS);
    const scenarioEsop = Math.min(esopLoanAmount, scenarioEsopDS * (1 - Math.pow(1 + esopLoanRate / 100 / 12, -esopLoanTerm * 12)) / (esopLoanRate / 100 / 12));
    const scenarioNote = Math.max(0, purchasePrice - sbaLoanAmount - scenarioEsop);
    const scenarioCash = purchasePrice - scenarioNote;
    const scenarioCashPct = Math.round((scenarioCash / purchasePrice) * 100 * 10) / 10;
    const scenarioTotalDS = sbaAnnualDS + (scenarioEsop * esopLoanRate / 100);
    const scenarioDscrEbitda = scenarioEbitda / scenarioTotalDS;
    const scenarioDscrOcf = scenarioOcf / scenarioTotalDS;

    return {
      id: label.split(' ')[1], // "A" or "B"
      label,
      sub,
      ebitda: scenarioEbitda,
      multiple: `${Math.round(purchasePrice / scenarioEbitda * 10) / 10}x`,
      sba: sbaLoanAmount,
      esop: Math.round(scenarioEsop),
      note: Math.round(scenarioNote),
      total: Math.round(totalCapital),
      pp: purchasePrice,
      sellerCash: Math.round(scenarioCash),
      sellerCashPct,
      sbaDS: Math.round(sbaAnnualDS),
      esopDS: Math.round(scenarioEsop * esopLoanRate / 100),
      totalDS: Math.round(scenarioTotalDS),
      dscr_ebitda: Math.round(scenarioDscrEbitda * 100) / 100,
      dscr_ocf: Math.round(scenarioDscrOcf * 100) / 100,
      ocf: Math.round(scenarioOcf),
      stress10: Math.round((scenarioEbitda * 0.9) / scenarioTotalDS * 100) / 100,
      stress20: Math.round((scenarioEbitda * 0.8) / scenarioTotalDS * 100) / 100,
      breakeven: Math.round(scenarioTotalDS / targetDscr),
      color: label.includes('A') ? "#d97706" : "#16a34a",
      bg: label.includes('A') ? "#fffbeb" : "#f0fdf4",
      border: label.includes('A') ? "#fcd34d" : "#bbf7d0",
      textColor: label.includes('A') ? "#92400e" : "#14532d",
    };
  };

  return {
    A: createScenario(ebitda * 0.8, "Scenario A", `${fmtK(ebitda * 0.8)} EBITDA · ${Math.round(purchasePrice / (ebitda * 0.8))}x multiple`),
    B: createScenario(ebitda, "Scenario B", `${fmtK(ebitda)} EBITDA · ${Math.round(purchasePrice / ebitda)}x multiple`),
  };
}

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const fmtK = (n: number) => "$" + (Math.round(n / 1000)).toLocaleString("en-US") + "K";
const pct = (n: number, d: number) => ((n / d) * 100).toFixed(1) + "%";

// ── COLORS ────────────────────────────────────────────────────────────────────
const NAVY = "#1e3a5f";
const BLUE = { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" };
const AMBER = { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" };
const GREEN = { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
const GRAY = { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
const RED = { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" };

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Callout({ theme, title, children }: { theme: typeof BLUE, title?: string, children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 16px", borderRadius: 6, marginBottom: 16,
      backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
      {title && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11,
        fontWeight: 700, color: theme.color, marginBottom: 5 }}>{title}</div>}
      <div style={{ fontFamily: "Georgia, serif", fontSize: 12,
        color: theme.color, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Section({ title, children, accent }: { title: string, children: React.ReactNode, accent?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ borderBottom: `2px solid ${accent || NAVY}`,
        paddingBottom: 5, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: accent || NAVY }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, bold, indent, sub, note, highlight }: {
  label: string | React.ReactNode,
  value: string | React.ReactNode,
  bold?: boolean,
  indent?: boolean,
  sub?: boolean,
  note?: string,
  highlight?: boolean
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "flex-start", padding: "5px 0",
      paddingLeft: indent ? 16 : 0, borderBottom: "1px solid #f3f4f6",
      backgroundColor: highlight ? "#f0f9ff" : "transparent" }}>
      <div style={{ maxWidth: "63%" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
          fontWeight: bold ? 700 : 400,
          color: bold ? "#0f172a" : sub ? "#9ca3af" : "#374151",
          fontStyle: sub ? "italic" : "normal" }}>{label}</div>
        {note && <div style={{ fontFamily: "Georgia, serif", fontSize: 11,
          color: "#6b7280", lineHeight: 1.4, marginTop: 2 }}>{note}</div>}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
        fontWeight: bold ? 700 : 400, color: bold ? "#0f172a" : "#374151",
        textAlign: "right", minWidth: 130 }}>{value}</div>
    </div>
  );
}

function DSCRBar({ label, value, color, max = 2.5 }: { label: string, value: number, color: string, max?: number }) {
  const threshold = 1.25;
  const width = Math.min((value / max) * 100, 100);
  const thPct = (threshold / max) * 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#374151" }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color }}>{value.toFixed(2)}x</span>
      </div>
      <div style={{ position: "relative", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%",
          width: `${width}%`, backgroundColor: color, borderRadius: 4 }} />
        <div style={{ position: "absolute", top: -4, left: `${thPct}%`,
          width: 2, height: 16, backgroundColor: "#dc2626",
          transform: "translateX(-50%)" }} />
        <span style={{ position: "absolute", top: 14, left: `${thPct}%`,
          transform: "translateX(-50%)", fontSize: 9, color: "#dc2626",
          fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>1.25x min</span>
      </div>
    </div>
  );
}

function StackBar({ S }: { S: any }) {
  const segs = [
    { label: "SBA 7(a) Senior", value: S.sba, color: NAVY },
    { label: "ESOP Leveraged Loan", value: S.esop, color: "#2563eb" },
    { label: "Seller Note (standby)", value: S.note, color: "#94a3b8" },
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", height: 32, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
        {segs.map(s => (
          <div key={s.label} style={{ width: `${(s.value / S.total) * 100}%`,
            backgroundColor: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {(s.value / S.total) > 0.08 && (
              <span style={{ fontSize: 10, color: "#fff",
                fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                {pct(s.value, S.total)}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {segs.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, backgroundColor: s.color, borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#374151" }}>
              {s.label}: {fmt(s.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioToggle({ active, onChange, scenarios }: { active: string, onChange: (id: string) => void, scenarios: any }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      {Object.values(scenarios).map((S: any) => (
        <div key={S.id} onClick={() => onChange(S.id)}
          style={{ flex: 1, minWidth: 200, padding: "14px 16px", borderRadius: 6,
            cursor: "pointer", transition: "all 0.15s",
            border: `2px solid ${active === S.id ? S.color : "#e5e7eb"}`,
            backgroundColor: active === S.id ? S.bg : "#fff" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
            fontWeight: 700, color: S.color, marginBottom: 2 }}>{S.label}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "#6b7280", marginBottom: 10 }}>{S.sub}</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#9ca3af", textTransform: "uppercase", marginBottom: 1 }}>Seller Cash</div>
              <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 20,
                fontWeight: 700, color: S.color }}>{fmt(S.sellerCash)}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: S.textColor }}>{S.sellerCashPct}% of purchase price</div>
            </div>
            <div style={{ borderLeft: `1px solid ${S.border}`, paddingLeft: 16 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#9ca3af", textTransform: "uppercase", marginBottom: 1 }}>OCF DSCR</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20,
                fontWeight: 700, color: "#16a34a" }}>{S.dscr_ocf.toFixed(2)}x</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: "#6b7280" }}>both metrics ≥ 1.25x</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OpenItem({ number, title, detail }: { number: number, title: string, detail: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 14px",
      backgroundColor: AMBER.bg, border: `1px solid ${AMBER.border}`,
      borderRadius: 6, marginBottom: 10 }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
        fontWeight: 700, color: AMBER.color, minWidth: 22 }}>#{number}</span>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
          fontWeight: 700, color: AMBER.color, marginBottom: 4 }}>{title}</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 12,
          color: "#92400e", lineHeight: 1.6 }}>{detail}</div>
      </div>
    </div>
  );
}

// ── FORM STEP COMPONENT ──────────────────────────────────────────────────────
function FormStep({ step, currentStep, title, children }: {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`term-form-step ${step === currentStep ? 'active' : step < currentStep ? 'completed' : 'inactive'}`}>
      <div className="term-step-header">
        <div className="term-step-number">{step}</div>
        <h3 className="term-step-title">{title}</h3>
      </div>
      {step === currentStep && (
        <div className="term-step-content">
          {children}
        </div>
      )}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const ESOPTermSheetForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function ESOPTermSheetForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [showTermSheet, setShowTermSheet] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<UserInputs>({
    ...DEFAULT_INPUTS,
    ...initialData,
  });

  // Term sheet state
  const [tab, setTab] = useState<string>((initialData?.tab as string) ?? "termsheet");
  const [scen, setScen] = useState<string>((initialData?.scen as string) ?? "B");

  // Calculate scenarios based on user inputs
  const scenarios = React.useMemo(() => calculateScenarios(inputs), [inputs]);
  const S = scenarios[scen as keyof typeof scenarios];

  const updateInput = (field: keyof UserInputs, value: UserInputs[keyof UserInputs]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
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

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => showTermSheet ? { tab, scen, inputs } : { inputs, currentStep },
    getContainerRef: () => containerRef.current,
  }));

  // Number input component for form
  const NumInput = ({ value, onChange, label, prefix = "$", suffix = "", placeholder = "" }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
  }) => (
    <div className="term-form-field">
      <label className="term-form-label">{label}</label>
      <div className="term-input-wrapper">
        {prefix && <span className="term-input-prefix">{prefix}</span>}
        <input
          type="number"
          className="term-form-input"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder={placeholder}
        />
        {suffix && <span className="term-input-suffix">{suffix}</span>}
      </div>
    </div>
  );

  const RadioSelect = ({ value, onChange, label, options }: {
    value: string | number;
    onChange: (v: any) => void;
    label: string;
    options: Array<{ value: string | number; label: string; desc?: string }>;
  }) => (
    <div className="term-form-field">
      <label className="term-form-label">{label}</label>
      <div className="term-radio-group">
        {options.map(option => (
          <label key={option.value} className="term-radio-option">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="term-radio-input"
            />
            <span className="term-radio-label">{option.label}</span>
            {option.desc && <span className="term-radio-desc">{option.desc}</span>}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="term-form-container">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');`}</style>
      {!showTermSheet ? (
        <div className="term-form-wrapper">
          <div className="term-form-header">
            <h2 className="term-form-title">ESOP Term Sheet Calculator</h2>
            <p className="term-form-subtitle">
              Enter your deal details to generate a customized term sheet with SBA-compliant calculations
            </p>
          </div>

          {/* Progress indicator */}
          <div className="term-progress">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className={`term-progress-step ${step <= currentStep ? 'completed' : ''} ${step === currentStep ? 'active' : ''}`}>
                <span className="term-progress-number">{step}</span>
                <span className="term-progress-label">
                  {step === 1 ? 'Deal Basics' :
                   step === 2 ? 'Financing' :
                   step === 3 ? 'Costs' :
                   'Review'}
                </span>
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="term-form-steps">
            <FormStep step={1} currentStep={currentStep} title="Deal Basics">
              <NumInput
                label="Purchase Price"
                value={inputs.purchasePrice}
                onChange={(v) => updateInput('purchasePrice', v)}
                placeholder="10000000"
              />
              <NumInput
                label="Annual EBITDA"
                value={inputs.ebitda}
                onChange={(v) => updateInput('ebitda', v)}
                placeholder="2500000"
              />
              <NumInput
                label="Federal Capital Gains Tax Rate"
                value={inputs.taxRate}
                onChange={(v) => updateInput('taxRate', v)}
                prefix=""
                suffix="%"
                placeholder="23.8"
              />
            </FormStep>

            <FormStep step={2} currentStep={currentStep} title="Financing Structure">
              <NumInput
                label="SBA 7(a) Loan Amount"
                value={inputs.sbaLoanAmount}
                onChange={(v) => updateInput('sbaLoanAmount', v)}
                placeholder="5000000"
              />
              <NumInput
                label="ESOP Loan Interest Rate"
                value={inputs.esopLoanRate}
                onChange={(v) => updateInput('esopLoanRate', v)}
                prefix=""
                suffix="%"
                placeholder="8.5"
              />
              <NumInput
                label="ESOP Loan Term"
                value={inputs.esopLoanTerm}
                onChange={(v) => updateInput('esopLoanTerm', v)}
                prefix=""
                suffix="years"
                placeholder="7"
              />
            </FormStep>

            <FormStep step={3} currentStep={currentStep} title="Transaction Costs">
              <NumInput
                label="Forhemit Fee"
                value={inputs.forhemitFee}
                onChange={(v) => updateInput('forhemitFee', v)}
                placeholder="25000"
              />
              <NumInput
                label="SBA Guarantee Fee"
                value={inputs.sbaFee}
                onChange={(v) => updateInput('sbaFee', v)}
                placeholder="138125"
              />
              <NumInput
                label="Stamp Tax"
                value={inputs.stampTax}
                onChange={(v) => updateInput('stampTax', v)}
                placeholder="35000"
              />
              <NumInput
                label="Quality of Earnings (QofE)"
                value={inputs.qoeFee}
                onChange={(v) => updateInput('qoeFee', v)}
                placeholder="25000"
              />
              <NumInput
                label="Legal Fees"
                value={inputs.legalFee}
                onChange={(v) => updateInput('legalFee', v)}
                placeholder="25000"
              />
              <NumInput
                label="CPA/Tax Advisor Fees"
                value={inputs.cpaFee}
                onChange={(v) => updateInput('cpaFee', v)}
                placeholder="15000"
              />
            </FormStep>

            <FormStep step={4} currentStep={currentStep} title="Deal Stage & Review">
              <RadioSelect
                label="Current Deal Stage"
                value={inputs.dealStage}
                onChange={(v) => updateInput('dealStage', v)}
                options={[
                  { value: 'preloi', label: 'Pre-LOI', desc: 'Initial discussions' },
                  { value: 'mid', label: 'Mid-Diligence', desc: 'Due diligence in progress' },
                  { value: 'postfmv', label: 'Post-FMV', desc: 'ERISA valuation complete' },
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
                    <strong>{fmt(inputs.forhemitFee + inputs.sbaFee + inputs.stampTax + inputs.qoeFee + inputs.legalFee + inputs.cpaFee)}</strong>
                  </div>
                </div>
              </div>
            </FormStep>
          </div>

          {/* Form Navigation */}
          <div className="term-form-navigation">
            <button
              className="term-nav-btn term-nav-prev"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </button>

            <div className="term-nav-steps">
              {currentStep} of 4
            </div>

            <button
              className="term-nav-btn term-nav-next"
              onClick={nextStep}
            >
              {currentStep === 4 ? 'Generate Term Sheet' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="term-header">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#7dd3fc", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
                  Presented by
                </div>
                <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 21, fontWeight: 700, marginBottom: 3 }}>
                  Forhemit Stewardship Management Co.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 2 }}>
                  Customized Term Sheet
                </div>
                <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 24, fontWeight: 700 }}>
                  $10,000,000
                </div>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="term-tabs">
              {[
                { id: "termsheet", label: "Term Sheet" },
                { id: "stack", label: "Sources & Uses" },
                { id: "dscr", label: "Debt Service" },
                { id: "seller", label: "Seller Economics" },
                { id: "open", label: "Open Items" },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`term-tab ${tab === t.id ? "active" : ""}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="term-content">
              {/* ── TERM SHEET ── */}
              {tab === "termsheet" && (
                <div>
                  <ScenarioToggle active={scen} onChange={setScen} scenarios={scenarios} />

                  <Section title="Transaction Terms">
                    <Row label="Purchase Price" value={fmt(S.pp)} bold />
                    <Row label="Buyer" value="ESOP Trust (newly formed, employer plan)" />
                    <Row label="Borrower (SBA obligor)" value="MSO Operating Company (ESOP-owned)" />
                    <Row label="Seller Entity" value="C-Corporation (or pre-close conversion)" />
                    <Row label="Seller Tax Treatment" value="§1042 election — tax-deferred QRP rollover" />
                    <Row label="Closing Date (target)" value="TBD — 90–120 days from LOI" />
                  </Section>

                  <Section title="Capital Structure — Seller-Optimized">
                    <Row label="Tranche 1 — SBA 7(a) Senior Debt" value={`${fmt(S.sba)}  (${pct(S.sba, S.total)})`} bold highlight
                      note="Borrower: MSO Operating Co. · Prime + 2.75% (~7.75%) · 10-year fully amortizing · 75% SBA guaranteed" />
                    <Row label="Tranche 2 — ESOP Leveraged Loan" value={`${fmt(S.esop)}  (${pct(S.esop, S.total)})`} bold highlight
                      note={`Subordinated to SBA · ${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · lender TBD · active debt service`} />
                    <Row label="Tranche 3 — Seller Note" value={`${fmt(S.note)}  (${pct(S.note, S.total)})`} bold
                      note="Full standby for SBA loan term per SOP 50 10 8 · $0 debt service during term · deferred cash to seller" />
                    <Row label="Total Project Cost" value={fmt(S.total)} bold />
                  </Section>

                  <Section title={`Seller Proceeds — ${S.label}`} accent="#16a34a">
                    <Row label="Purchase Price" value={fmt(S.pp)} />
                    <Row label="Less: Seller Note (deferred — full standby)" value={`(${fmt(S.note)})`} indent
                      note="Seller receives this after SBA loan retires at year 10 — not at closing" />
                    <Row label="★ Cash to Seller at Closing" value={fmt(S.sellerCash)} bold
                      note={`${S.sellerCashPct}% of purchase price · maximum achievable at 1.25x OCF DSCR`} />
                  </Section>

                  <Section title="Debt Service Terms">
                    <Row label="SBA 7(a) Annual Debt Service" value={fmt(S.sbaDS)}
                      note="10-year fully amortizing · ~7.75%" />
                    <Row label="ESOP Loan Annual Debt Service" value={fmt(S.esopDS)}
                      note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · active payments · subordinated to SBA`} />
                    <Row label="Seller Note Annual DS" value="$0"
                      note="Full standby — no payments during SBA loan term" />
                    <Row label="Total Active Annual Debt Service" value={fmt(S.totalDS)} bold />
                    <Row label="DSCR — EBITDA Basis" value={`${S.dscr_ebitda.toFixed(2)}x`} bold />
                    <Row label="DSCR — OCF Basis" value={`${S.dscr_ocf.toFixed(2)}x`} bold
                      note="OCF DSCR is the binding constraint — maximized at exactly 1.25x" />
                  </Section>

                  <Section title="Closing Conditions (Forhemit Standard)">
                    {[
                      ["QofE Complete","Independent Quality of Earnings validated before LOI"],
                      ["ERISA Valuation","ERISA-compliant independent appraisal in lieu of SBA appraisal per Notice 5000-872764"],
                      ["ESOP Trustee Engaged","Independent qualified trustee in place before SBA submission"],
                      ["ESOP Loan Lender Confirmed","Intercreditor terms agreed before SBA package submission"],
                      ["Seller Equity Exit","Complete equity exit at close · post-close role as PC employee only"],
                      ["Citizenship Verified","All PC owners verified per Policy Notice 5000-876441 (eff. March 1, 2026)"],
                      ["COOP Delivered","Forhemit Continuity of Operations Plan complete pre-close"],
                    ].map(([l,n]) => <Row key={l} label={l} value="✓ Required" note={n} />)}
                  </Section>
                </div>
              )}

              {/* ── SOURCES & USES ── */}
              {tab === "stack" && (
                <div>
                  <ScenarioToggle active={scen} onChange={setScen} scenarios={scenarios} />
                  <Section title="Capital Stack">
                    <StackBar S={S} />
                  </Section>
                  <Section title="Uses of Funds">
                    <Row label="Purchase Price" value={fmt(inputs.purchasePrice)} indent />
                    <Row label="Closing Costs" value={fmt(inputs.sbaFee + inputs.stampTax + 350_000)} indent
                      note="SBA guarantee fee, stamp tax, legal, title, working capital" />
                    <Row label="Total Project Cost" value={fmt(S.total)} bold />
                  </Section>
                  <Section title="Sources of Funds">
                    <Row label="SBA 7(a) Senior Debt" value={`${fmt(S.sba)}  (${pct(S.sba, S.total)})`} bold highlight
                      note="Prime + 2.75% (~7.75%) · 10yr fully amortizing · 75% guaranteed" />
                    <Row label="ESOP Leveraged Loan" value={`${fmt(S.esop)}  (${pct(S.esop, S.total)})`} bold highlight
                      note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}yr · subordinated · lender TBD`} />
                    <Row label="Seller Note (full standby)" value={`${fmt(S.note)}  (${pct(S.note, S.total)})`}
                      note="$0 annual DS during SBA term · deferred cash · supports §1042 mechanics" />
                    <Row label="Total Sources" value={fmt(S.total)} bold />
                  </Section>
                  <Callout theme={BLUE} title="Why This Stack Is Seller-Optimized">
                    The seller note is sized to the minimum required to balance the capital stack after
                    maximizing both the SBA tranche (${fmt(inputs.sbaLoanAmount)} cap) and the ESOP leveraged loan
                    (constrained by OCF DSCR at 1.25x). Every dollar shifted from the seller note to
                    the ESOP loan is a dollar the seller receives at closing rather than in year 10.
                  </Callout>
                </div>
              )}

              {/* ── DEBT SERVICE ── */}
              {tab === "dscr" && (
                <div>
                  <ScenarioToggle active={scen} onChange={setScen} scenarios={scenarios} />

                  <Callout theme={scen === "B" ? GREEN : AMBER}
                    title={`${S.label} — Coverage at Maximum Seller Cash`}>
                    Both EBITDA-basis (1.25x minimum) and OCF-basis (1.25x minimum) DSCR are
                    maintained. The ESOP leveraged loan is sized to the exact point where OCF DSCR
                    reaches 1.25x — the lender's floor.
                  </Callout>

                  <Section title="Cash Flow Build">
                    <Row label="EBITDA (QofE-validated)" value={fmt(S.ebitda)} bold />
                    <Row label="Less: D&A (estimated)" value="($150,000)" indent />
                    <Row label="EBIT" value={fmt(S.ebitda - 150_000)} indent />
                    <Row label="Less: Taxes (~28% blended effective rate)"
                      value={`(${fmt((S.ebitda - 150_000) * (inputs.taxRate / 100))})`} indent />
                    <Row label="NOPAT" value={fmt((S.ebitda - 150_000) * (1 - inputs.taxRate / 100))} indent />
                    <Row label="Add back: D&A" value="$150,000" indent />
                    <Row label="Operating Cash Flow (post-tax)" value={fmt(S.ocf)} bold />
                  </Section>

                  <Section title="Annual Debt Service — Steady State">
                    <Row label="SBA 7(a) Annual DS" value={fmt(S.sbaDS)} bold
                      note="10-year fully amortizing · ~7.75%" />
                    <Row label="ESOP Leveraged Loan Annual DS" value={fmt(S.esopDS)}
                      note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · active · subordinated to SBA`}/>
                    <Row label="Seller Note" value="$0"
                      note="Full standby per SOP 50 10 8 — zero payments during SBA term" />
                    <Row label="Total Active Annual DS" value={fmt(S.totalDS)} bold />
                  </Section>

                  <Section title="Coverage Ratios">
                    <DSCRBar label="DSCR — EBITDA Basis"
                      value={S.dscr_ebitda}
                      color={S.dscr_ebitda >= 1.5 ? "#16a34a" : "#d97706"} />
                    <DSCRBar label="DSCR — OCF Basis (binding constraint)"
                      value={S.dscr_ocf} color="#16a34a" />
                    <Callout theme={GRAY}>
                      OCF DSCR is the binding constraint because lenders underwrite on post-tax
                      operating cash flow, not EBITDA. The ESOP leveraged loan is sized to hold
                      OCF DSCR at exactly 1.25x.
                    </Callout>
                  </Section>

                  <Section title="Stress Test">
                    {[
                      ["Base Case", S.ebitda, S.dscr_ebitda],
                      ["EBITDA −10%", S.ebitda * 0.9, S.stress10],
                      ["EBITDA −20%", S.ebitda * 0.8, S.stress20],
                    ].map(([label, e, d]) => {
                      const dscrValue = typeof d === 'number' ? d : parseFloat(d as string);
                      const ebitdaValue = typeof e === 'number' ? e : parseFloat(e as string);
                      return (
                        <Row key={label} label={label}
                          value={
                            <span style={{ color: dscrValue >= 1.25 ? "#16a34a" : dscrValue >= 1.1 ? "#d97706" : "#dc2626" }}>
                              {fmt(ebitdaValue)} → {dscrValue.toFixed(2)}x
                            </span>
                          }
                        />
                      );
                    })}
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11,
                      color: "#6b7280", marginTop: 8 }}>
                      Break-even EBITDA for 1.25x coverage: ~{fmt(S.breakeven)}
                    </div>
                  </Section>
                </div>
              )}

              {/* ── SELLER ECONOMICS ── */}
              {tab === "seller" && (
                <div>
                  <ScenarioToggle active={scen} onChange={setScen} scenarios={scenarios} />

                  <Section title="Seller Proceeds Summary">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                      gap: 12, marginBottom: 20 }}>
                      {[
                        { label: "Cash at Closing", value: fmt(S.sellerCash),
                          sub: `${S.sellerCashPct}% of purchase price`, color: "#16a34a" },
                        { label: "Seller Note (Deferred)", value: fmt(S.note),
                          sub: "Received after SBA loan retires (yr 10+)", color: "#6b7280" },
                        { label: "Total Consideration", value: fmt(S.pp),
                          sub: "100% of purchase price — all accounted for", color: NAVY },
                        { label: "§1042 Eligible Proceeds", value: fmt(S.sellerCash),
                          sub: "Cash proceeds eligible for QRP reinvestment", color: "#2563eb" },
                      ].map(item => (
                        <div key={item.label} style={{ padding: "14px 16px", borderRadius: 6,
                          border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
                            color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 22,
                            fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.value}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10,
                            color: "#6b7280" }}>{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="Why the Seller Note Is Not Zero">
                    <Callout theme={BLUE} title="The Binding Constraint Explained">
                      The goal is to maximize seller closing cash. That means maximizing the ESOP
                      leveraged loan, because that tranche produces real closing proceeds. But the
                      ESOP loan creates active annual debt service — and OCF DSCR must stay at or
                      above 1.25x for the SBA lender to approve. The seller note is what fills the
                      remaining gap after both the SBA loan (${fmt(inputs.sbaLoanAmount)} cap) and the maximum
                      ESOP loan (OCF-constrained) are fully deployed.
                    </Callout>
                    <Row label="SBA Loan (hard cap)" value={fmt(inputs.sbaLoanAmount)} />
                    <Row label="Max ESOP Loan (OCF-constrained)" value={fmt(S.esop)} />
                    <Row label="Total debt capacity" value={fmt(inputs.sbaLoanAmount + S.esop)} bold />
                    <Row label="Total project cost" value={fmt(S.total)} />
                    <Row label="Minimum seller note required" value={fmt(S.note)} bold
                      note="This is the irreducible minimum based on your inputs" />
                  </Section>

                  <Section title="How to Reduce the Seller Note Further">
                    {[
                      ["Higher validated EBITDA",
                        `Every $100K increase in QofE-validated EBITDA creates additional ESOP loan capacity. Your current EBITDA of ${fmt(inputs.ebitda)} supports ${fmt(S.esop)} in ESOP financing.`],
                      ["Longer ESOP loan term",
                        `Extending from ${inputs.esopLoanTerm} to 10 years reduces annual debt service, allowing larger loan principal at the same DSCR constraint.`],
                      ["Lower ESOP loan rate",
                        `If the ESOP lender prices at 7.5% instead of ${inputs.esopLoanRate}%, the same principal produces lower annual DS — creating room for a larger loan.`],
                      ["Partial seller note outside standby",
                        "A portion of the seller note could be structured as non-standby subordinated debt with active payments, accepted by the SBA lender as subordinated financing."],
                    ].map(([title, detail]) => (
                      <div key={title} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12,
                          fontWeight: 700, color: NAVY, marginBottom: 4 }}>{title}</div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 12,
                          color: "#374151", lineHeight: 1.65 }}>{detail}</div>
                      </div>
                    ))}
                  </Section>

                  <Section title="§1042 Election — Seller Note Interaction" accent="#2563eb">
                    <Callout theme={BLUE}>
                      The §1042 election allows deferral of capital gains tax on cash proceeds by reinvesting in
                      Qualified Replacement Property within 15 months. Your cash at closing (${fmt(S.sellerCash)})
                      is fully eligible. The seller note (${fmt(S.note)}) defers tax until payments are received.
                    </Callout>
                  </Section>
                </div>
              )}

              {/* ── OPEN ITEMS ── */}
              {tab === "open" && (
                <div>
                  <Section title="Structural Items to Resolve Before Lender Submission" accent={AMBER.color}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 13,
                      color: "#374151", marginBottom: 20, lineHeight: 1.6 }}>
                      These items must be resolved with ESOP counsel and SBA lender counsel before
                      this term sheet becomes a credit submission.
                    </div>
                    <OpenItem number={1} title="QofE Must Be Complete Before ESOP Loan Is Sized"
                      detail={`The ESOP leveraged loan amount is directly derived from OCF DSCR using your EBITDA of ${fmt(inputs.ebitda)}. The numbers shown are based on your inputs and may change once QofE is validated.`} />
                    <OpenItem number={2} title="ESOP Leveraged Loan Lender Must Be Identified Pre-Submission"
                      detail="The SBA lender requires the terms of all subordinated debt and an executed intercreditor agreement before approving the loan. The ESOP loan lender must be identified and qualified as part of deal team assembly." />
                    <OpenItem number={3} title="SBA Approval of Subordinated Debt Terms"
                      detail={`The SBA must approve the ESOP leveraged loan (${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year terms) as subordinated debt. The intercreditor agreement between the SBA lender and the ESOP loan lender defines payment priority and cure rights.`} />
                    <OpenItem number={4} title="ESOP Equity Injection Exemption — MSO Qualification"
                      detail="Confirm in writing from ESOP counsel that the ESOP trust's acquisition of the MSO qualifies for the controlling interest equity injection exemption under SOP 50 10 8." />
                    <OpenItem number={5} title="Seller Note Post-Standby Terms"
                      detail={`The seller note terms (${fmt(S.note)} principal) post-year-10 must be documented in the purchase agreement. The SBA lender will ask at submission.`} />
                    <OpenItem number={6} title="§1042 Counsel Confirmation on Seller Note Timing"
                      detail={`Your tax counsel must confirm how the deferred seller note interacts with the §1042 QRP election window. Cash proceeds of ${fmt(S.sellerCash)} at closing are clearly eligible.`} />
                  </Section>

                  <Section title="First Lender Meeting — Opening Questions" accent="#2563eb">
                    <Callout theme={BLUE} title="Approach">
                      Lead with the structuring objective — maximizing seller cash while maintaining
                      SBA-compliant coverage. This signals deal sophistication. Then ask about their
                      experience with layered subordinated debt in ESOP transactions.
                    </Callout>
                    {[
                      "We're structuring this deal to maximize seller closing cash within SBA coverage requirements. Our capital stack includes an ESOP leveraged loan subordinated to SBA. Has your credit team approved intercreditor structures with an ESOP leveraged loan alongside an SBA senior tranche?",
                      "What has typically required adjustment when your credit committee reviews ESOP deals with layered subordinated debt?",
                      "Does your institution process ESOP 7(a) transactions under PLP authority, or do they require SBA field office review?",
                      "Are you willing to provide an indicative term sheet prior to LOI for a complete, pre-assembled package?",
                    ].map((q, i) => (
                      <div key={i} style={{ padding: "10px 14px", marginBottom: 8,
                        backgroundColor: "#f0f6ff", border: "1px solid #bfdbfe",
                        borderRadius: 6, fontFamily: "Georgia, serif",
                        fontSize: 12, color: "#1e40af", lineHeight: 1.6, fontStyle: "italic" }}>
                        "{q}"
                      </div>
                    ))}
                  </Section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="term-footer">
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#9ca3af" }}>
                Forhemit Stewardship Management Co. · California PBC · San Francisco, CA
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#9ca3af" }}>
                CUSTOMIZED CALCULATION — NOT A COMMITMENT TO LEND · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            </div>

            {/* Back to Form Button */}
            <div className="term-back-btn-container">
              <button
                className="term-back-btn"
                onClick={() => setShowTermSheet(false)}
              >
                ← Edit Inputs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ESOPTermSheetForm;