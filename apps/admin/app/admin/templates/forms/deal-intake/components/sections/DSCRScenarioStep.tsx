"use client";

import React from "react";
import { DealInputs, DSCRInputs } from "../../types";
import { NumberInput, ToggleButton } from "../inputs";
import { fmt, fmtX } from "../../lib/formatters";
import { TARGET_DSCR } from "../../constants";
import { calculateStressedDSCR } from "../../lib/calculations";

interface DSCRScenarioStepProps {
  inputs: DealInputs;
  onUpdateDscr: (updates: Partial<DSCRInputs>) => void;
  dscr: {
    sbaDS: number;
    esopDS: number;
    snDS: number;
    totalDS: number;
    ocf: number;
    dscrEbitda: number;
    dscrOcf: number;
    esopRate: number;
    esopTerm: number;
    taxRate: number;
    sbaRate: number;
  };
  activeEbitda: number;
}

export function DSCRScenarioStep({
  inputs,
  onUpdateDscr,
  dscr,
  activeEbitda,
}: DSCRScenarioStepProps) {
  const { dscr: dscrInputs, capital } = inputs;

  const dscrColor =
    dscr.dscrEbitda >= 1.35
      ? "good"
      : dscr.dscrEbitda >= TARGET_DSCR
      ? ""
      : "warn";
  const barWidth = Math.min((dscr.dscrEbitda / 2.2) * 100, 100);
  const barClass =
    dscr.dscrEbitda >= 1.35 ? "" : dscr.dscrEbitda >= TARGET_DSCR ? "warn" : "bad";

  const stressedDscr = calculateStressedDSCR(inputs, activeEbitda);

  // Show assumption block only when we have calculations
  const showAssumptions = dscr.totalDS > 0;

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
        label="SBA interest rate (prime + spread)"
        value={dscrInputs.interestRate}
        onChange={(v) => onUpdateDscr({ interestRate: v })}
        placeholder="7.5"
        suffix="%"
        min={1}
        max={20}
        step={0.25}
      />

      {/* NEW: ESOP loan rate - was hardcoded at SBA rate + 1% */}
      <NumberInput
        label="ESOP leveraged loan rate (typically SBA rate + spread)"
        value={dscrInputs.esopRate}
        onChange={(v) => onUpdateDscr({ esopRate: v })}
        placeholder="8.5"
        suffix="%"
        min={1}
        max={20}
        step={0.25}
        hint="ESOP loan rate is an assumption — confirm with the ESOP lender. Commonly 100–200 bps over the SBA rate."
      />

      {/* NEW: ESOP loan term - was hardcoded at 7 years */}
      <div className="di-field">
        <label className="di-label">ESOP leveraged loan term (years)</label>
        <select
          className="di-select"
          value={dscrInputs.esopTerm}
          onChange={(e) => onUpdateDscr({ esopTerm: Number(e.target.value) })}
        >
          <option value={5}>5 years</option>
          <option value={7}>7 years (typical)</option>
          <option value={10}>10 years</option>
          <option value={12}>12 years</option>
        </select>
      </div>

      {/* NEW: Tax rate - was hardcoded at 25% */}
      <NumberInput
        label="Effective tax rate (for OCF DSCR)"
        value={dscrInputs.taxRate}
        onChange={(v) => onUpdateDscr({ taxRate: v })}
        placeholder="25"
        suffix="%"
        min={0}
        max={50}
        step={1}
        hint="Used only for OCF DSCR. EBITDA DSCR (primary SBA metric) is pre-tax. S-corps and pass-throughs may use 0%."
      />

      {/* NEW: Assumption block showing calculation basis */}
      {showAssumptions && (
        <div className="di-assumption-block">
          <strong>DSCR calculation basis</strong>
          <br />
          Primary DSCR = EBITDA ÷ total annual debt service (pre-tax, SBA standard).{" "}
          OCF DSCR = EBITDA × (1 − {dscr.taxRate}% tax) ÷ total debt service.{" "}
          ESOP loan: {dscr.esopRate}% / {dscr.esopTerm}-yr amortizing.{" "}
          {capital.sellerNote > 0
            ? capital.standbyMode === "full"
              ? "Seller note: full standby, $0 debt service."
              : "Seller note: interest-only at 6% p.a. (active payment)."
            : ""}{" "}
          All figures illustrative — confirm rates and terms with lenders.
        </div>
      )}

      {dscr.totalDS > 0 && (
        <div className="di-live-card">
          <div className="di-live-row">
            <span className="di-live-label">SBA annual debt service</span>
            <span className="di-live-val">{fmt(dscr.sbaDS)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">ESOP loan debt service</span>
            <span className="di-live-val">{fmt(dscr.esopDS)}</span>
          </div>
          {capital.sellerNote > 0 && (
            <div className="di-live-row">
              <span className="di-live-label">Seller note debt service</span>
              <span className="di-live-val">
                {dscr.snDS === 0
                  ? "$0 (full standby)"
                  : `${fmt(dscr.snDS)} (active)`}
              </span>
            </div>
          )}
          <div className="di-live-row">
            <span className="di-live-label">Total annual debt service</span>
            <span className="di-live-val">{fmt(dscr.totalDS)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">
              EBITDA DSCR (primary SBA metric)
            </span>
            <span className={`di-live-val ${dscrColor}`}>
              {fmtX(dscr.dscrEbitda)}
              {dscr.dscrEbitda >= TARGET_DSCR
                ? " ✓"
                : " ⚠ below 1.25x minimum"}
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
            <span className="di-live-label">
              OCF DSCR (after {dscr.taxRate}% tax — supplemental)
            </span>
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
