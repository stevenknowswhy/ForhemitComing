"use client";

import React from "react";
import { DealInputs, DSCRInputs, DSCRResult } from "../../types";
import { NumberInput, ToggleButton } from "../inputs";
import { fmt, fmtX } from "../../lib/formatters";
import { COLORS, TARGET_DSCR } from "../../constants";
import { calculateStressedDSCR } from "../../lib/calculations";

interface DSCRScenarioStepProps {
  inputs: DealInputs;
  onUpdateDscr: (updates: Partial<DSCRInputs>) => void;
  dscr: DSCRResult;
  activeEbitda: number;
}

export function DSCRScenarioStep({
  inputs,
  onUpdateDscr,
  dscr,
  activeEbitda,
}: DSCRScenarioStepProps) {
  const { dscr: dscrInputs, financial } = inputs;

  const dscrColor =
    dscr.dscrEbitda >= 1.35 ? "good" : dscr.dscrEbitda >= TARGET_DSCR ? "" : "warn";
  const barWidth = Math.min((dscr.dscrEbitda / 2.2) * 100, 100);
  const barClass =
    dscr.dscrEbitda >= 1.35 ? "" : dscr.dscrEbitda >= TARGET_DSCR ? "warn" : "bad";

  const stressedDscr = calculateStressedDSCR(inputs, activeEbitda);

  return (
    <div className="di-step-content">
      <div className="di-section-label">DSCR scenario</div>

      <p className="di-intro-text">
        Select the scenario you want presented to the lender. Scenario B is a
        stronger credit story if the QofE supports a higher EBITDA figure.
      </p>

      <ToggleButton
        value={dscrInputs.scenario}
        onChange={(v) => onUpdateDscr({ scenario: v as "A" | "B" })}
        options={[
          {
            value: "A",
            label: "Scenario A — base case",
            description: "Use the EBITDA entered on page 1",
          },
          {
            value: "B",
            label: "Scenario B — upside case",
            description: "Enter a higher QofE-adjusted EBITDA",
          },
        ]}
      />

      {dscrInputs.scenario === "B" && (
        <NumberInput
          label="Scenario B EBITDA (QofE-adjusted)"
          value={dscrInputs.ebitdaB}
          onChange={(v) => onUpdateDscr({ ebitdaB: v })}
          placeholder="2,500,000"
          prefix="$"
          min={0}
          step={50000}
        />
      )}

      <div className="di-field">
        <label className="di-label">SBA loan term</label>
        <select
          className="di-select"
          value={dscrInputs.loanTerm}
          onChange={(e) => onUpdateDscr({ loanTerm: Number(e.target.value) })}
        >
          <option value={25}>25 years (real estate collateral)</option>
          <option value={10}>10 years (no real estate)</option>
        </select>
      </div>

      <NumberInput
        label="Interest rate (SBA prime + spread)"
        value={dscrInputs.interestRate}
        onChange={(v) => onUpdateDscr({ interestRate: v })}
        placeholder="7.5"
        suffix="%"
        min={1}
        max={20}
        step={0.25}
      />

      {(dscr.totalDS > 0 || dscr.sbaDS > 0) && (
        <div className="di-live-card">
          <div className="di-live-row">
            <span className="di-live-label">SBA annual debt service</span>
            <span className="di-live-val">{fmt(dscr.sbaDS)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">ESOP loan debt service</span>
            <span className="di-live-val">{fmt(dscr.esopDS)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">Total debt service</span>
            <span className="di-live-val">{fmt(dscr.totalDS)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">EBITDA DSCR</span>
            <span className={`di-live-val ${dscrColor}`}>
              {fmtX(dscr.dscrEbitda)}
              {dscr.dscrEbitda >= TARGET_DSCR ? " ✓" : " ⚠ below 1.25x minimum"}
            </span>
          </div>

          <div className="di-dscr-bar-wrap">
            <div className="di-dscr-bar-bg">
              <div
                className={`di-dscr-bar-fill ${barClass}`}
                style={{ width: `${barWidth}%` }}
              />
              <div className="di-dscr-min-line" />
            </div>
            <div className="di-dscr-labels">
              <span>0x</span>
              <span>1.25x min</span>
              <span>2.2x</span>
            </div>
          </div>

          <div className="di-live-row">
            <span className="di-live-label">OCF DSCR</span>
            <span className="di-live-val">{fmtX(dscr.dscrOcf)}</span>
          </div>

          <div className="di-live-row">
            <span className="di-live-label">Stressed DSCR (10% decline)</span>
            <span className="di-live-val">{fmtX(stressedDscr)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
