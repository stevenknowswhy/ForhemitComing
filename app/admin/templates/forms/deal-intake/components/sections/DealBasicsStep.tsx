"use client";

import React from "react";
import { DealInputs, BusinessInfo, FinancialInputs } from "../../types";
import { STATE_OPTIONS, BUSINESS_TYPE_OPTIONS } from "../../constants";
import { TextInput, NumberInput, SelectInput } from "../inputs";
import { fmt, fmtX } from "../../lib/formatters";

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

      <NumberInput
        label="Purchase price"
        value={financial.purchasePrice}
        onChange={(v) => onUpdateFinancial({ purchasePrice: v })}
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

      <NumberInput
        label="Closing costs & working capital reserve (estimated)"
        value={financial.closingCosts}
        onChange={(v) => onUpdateFinancial({ closingCosts: v })}
        placeholder="850,000"
        prefix="$"
        min={0}
        step={10000}
        hint="Include SBA guarantee fee, legal, appraisal, QofE, and 3 months working capital."
      />

      {financial.purchasePrice > 0 && financial.closingCosts >= 0 && (
        <div className="di-live-card">
          <div className="di-live-row">
            <span className="di-live-label">Total project cost</span>
            <span className="di-live-val">
              {fmt(financial.purchasePrice + financial.closingCosts)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
