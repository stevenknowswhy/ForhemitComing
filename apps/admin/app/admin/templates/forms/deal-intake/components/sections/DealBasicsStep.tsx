"use client";

import React from "react";
import { DealInputs, BusinessInfo, FinancialInputs } from "../../types";
import { STATE_OPTIONS, BUSINESS_TYPE_OPTIONS } from "../../constants";
import { TextInput, NumberInput, SelectInput } from "../inputs";
import { fmt, fmtX } from "../../lib/formatters";
import { calculateWorkingCapital } from "../../lib/calculations";

interface DealBasicsStepProps {
  inputs: DealInputs;
  onUpdateBusiness: (updates: Partial<BusinessInfo>) => void;
  onUpdateFinancial: (updates: Partial<FinancialInputs>) => void;
  errors: { purchasePrice?: string; ebitda?: string };
}

export function DealBasicsStep({
  inputs,
  onUpdateBusiness,
  onUpdateFinancial,
  errors,
}: DealBasicsStepProps) {
  const { business, financial } = inputs;
  const impliedMultiple =
    financial.purchasePrice && financial.ebitda
      ? financial.purchasePrice / financial.ebitda
      : 0;

  // Show "Other" text field when business type is "Other"
  const showOtherType = business.type === "Other";

  // Calculate working capital based on percentage
  const calculatedWorkingCapital = calculateWorkingCapital(
    financial.purchasePrice,
    financial.workingCapitalPct
  );

  // Total project cost = purchase price + actual closing costs + working capital
  const totalProjectCost =
    financial.purchasePrice +
    financial.actualClosingCosts +
    financial.workingCapital;

  return (
    <div className="di-step-content">
      <div className="di-section-label">Business & acquisition basics</div>

      <div className="di-field-row-2">
        <TextInput
          label="Business name"
          value={business.name}
          onChange={(v) => onUpdateBusiness({ name: v })}
          placeholder="e.g. Coastal Cardiology Group"
        />
        <SelectInput
          label="State of operation"
          value={business.state}
          onChange={(v) => onUpdateBusiness({ state: v })}
          options={STATE_OPTIONS}
          placeholder="Select state"
        />
      </div>

      <div className="di-field-row-2">
        <SelectInput
          label="Industry / business type"
          value={business.type}
          onChange={(v) => onUpdateBusiness({ type: v })}
          options={BUSINESS_TYPE_OPTIONS}
          placeholder="Select type"
        />
        <NumberInput
          label="Employee count (approximate)"
          value={business.employeeCount}
          onChange={(v) => onUpdateBusiness({ employeeCount: v })}
          placeholder="e.g. 45"
          min={1}
        />
      </div>

      {/* NEW: Show text field when "Other" is selected */}
      {showOtherType && (
        <TextInput
          label="Please specify business type"
          value={business.typeOther}
          onChange={(v) => onUpdateBusiness({ typeOther: v })}
          placeholder="e.g. Specialty retail, Consulting firm, etc."
        />
      )}

      <NumberInput
        label="Purchase price"
        value={financial.purchasePrice}
        onChange={(v) => {
          onUpdateFinancial({ purchasePrice: v });
          // Auto-update working capital when purchase price changes
          const newWorkingCapital = calculateWorkingCapital(
            v,
            financial.workingCapitalPct
          );
          onUpdateFinancial({ workingCapital: newWorkingCapital });
        }}
        placeholder="10,000,000"
        prefix="$"
        min={0}
        step={100000}
        error={errors.purchasePrice}
      />

      <NumberInput
        label="Trailing twelve-month EBITDA"
        value={financial.ebitda}
        onChange={(v) => onUpdateFinancial({ ebitda: v })}
        placeholder="2,000,000"
        prefix="$"
        min={0}
        step={50000}
        error={errors.ebitda}
        hint={
          impliedMultiple
            ? `Implied purchase multiple: ${fmtX(impliedMultiple)} EBITDA`
            : undefined
        }
      />

      {/* CHANGED: Split closing costs and working capital */}
      <div className="di-field-row-2">
        <NumberInput
          label="Actual closing costs"
          value={financial.actualClosingCosts}
          onChange={(v) => onUpdateFinancial({ actualClosingCosts: v })}
          placeholder="350,000"
          prefix="$"
          min={0}
          step={10000}
          hint="SBA guarantee fee, legal, appraisal, QofE, etc."
        />
        <div className="di-field">
          <label className="di-label">Working capital (% of purchase price)</label>
          <div className="di-input-wrap">
            <input
              type="number"
              className="di-input"
              value={financial.workingCapitalPct}
              onChange={(e) => {
                const pct = Number(e.target.value) || 0;
                onUpdateFinancial({ workingCapitalPct: pct });
                // Auto-calculate working capital amount
                const newWorkingCapital = calculateWorkingCapital(
                  financial.purchasePrice,
                  pct
                );
                onUpdateFinancial({ workingCapital: newWorkingCapital });
              }}
              placeholder="5"
              min={0}
              max={50}
              step={0.5}
            />
            <span className="di-suffix">%</span>
          </div>
          <span className="di-hint">
            Calculated: {fmt(calculatedWorkingCapital)}. Adjust % or override amount below.
          </span>
        </div>
      </div>

      {/* Allow user to override working capital amount */}
      <NumberInput
        label="Working capital reserve (actual amount)"
        value={financial.workingCapital}
        onChange={(v) => onUpdateFinancial({ workingCapital: v })}
        placeholder="500,000"
        prefix="$"
        min={0}
        step={10000}
        hint="Override the calculated amount if needed. Typically 3–6 months of operating expenses."
      />

      {/* Show total project cost breakdown */}
      {financial.purchasePrice > 0 && (
        <div className="di-live-card">
          <div className="di-live-row">
            <span className="di-live-label">Purchase price</span>
            <span className="di-live-val">{fmt(financial.purchasePrice)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">Actual closing costs</span>
            <span className="di-live-val">{fmt(financial.actualClosingCosts)}</span>
          </div>
          <div className="di-live-row">
            <span className="di-live-label">
              Working capital ({financial.workingCapitalPct}%)
            </span>
            <span className="di-live-val">{fmt(financial.workingCapital)}</span>
          </div>
          <div className="di-live-row" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "8px", marginTop: "4px" }}>
            <span className="di-live-label">Total project cost</span>
            <span className="di-live-val">{fmt(totalProjectCost)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
