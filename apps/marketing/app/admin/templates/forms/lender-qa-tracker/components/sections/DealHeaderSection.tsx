"use client";

import React from "react";
import { TextInput, NumberInput, SelectInput, DateInput } from "../inputs";
import { DealHeader } from "../../types";
import { LOAN_TYPE_OPTIONS } from "../../constants";
import { checkLoanLimit, validateDates } from "../../lib/validation";

interface DealHeaderSectionProps {
  header: DealHeader;
  onUpdateField: <K extends keyof DealHeader>(field: K, value: DealHeader[K]) => void;
  errors: Map<string, string>;
}

export function DealHeaderSection({
  header,
  onUpdateField,
  errors,
}: DealHeaderSectionProps) {
  const loanLimitCheck = checkLoanLimit(header.loantype, header.loanamt);
  const dateCheck = validateDates(header.subdate, header.closedate);

  const dateHint = dateCheck.daysDiff > 0
    ? dateCheck.valid
      ? `${dateCheck.daysDiff} days duration`
      : `Warning: Only ${dateCheck.daysDiff} days (minimum 30 recommended)`
    : "";

  return (
    <div className="lqa-form-card">
      <div className="lqa-card-header">
        <span className="lqa-card-header-label">Company & Transaction</span>
      </div>
      <div className="lqa-card-body">
        <div className="lqa-field-grid lqa-field-grid-2">
          <TextInput
            id="company"
            label="Company name"
            value={header.company}
            onChange={(v) => onUpdateField("company", v)}
            placeholder="Meridian Manufacturing, LLC"
            required
            error={errors.get("company")}
          />
          <TextInput
            id="dealid"
            label="Deal ID / reference #"
            value={header.dealid}
            onChange={(v) => onUpdateField("dealid", v)}
            placeholder="MER2025"
            required
            error={errors.get("dealid")}
            hint="Used as prefix for item IDs (letters, numbers, hyphens only)"
          />
          <SelectInput
            id="loantype"
            label="SBA loan type"
            value={header.loantype}
            onChange={(v) => onUpdateField("loantype", v as DealHeader["loantype"])}
            options={LOAN_TYPE_OPTIONS}
            required
            error={errors.get("loantype")}
          />
          <NumberInput
            id="loanamt"
            label="Total loan amount ($)"
            value={header.loanamt}
            onChange={(v) => onUpdateField("loanamt", v)}
            placeholder="8400000"
            required
            error={errors.get("loanamt")}
            hint={loanLimitCheck.message}
          />
        </div>
      </div>
    </div>
  );
}
