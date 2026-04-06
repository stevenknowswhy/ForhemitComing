"use client";

import React from "react";
import { DealHeader } from "../../types";
import { TextInput, NumberInput, SelectInput, DateInput } from "../inputs";
import { FISCAL_YEAR_OPTIONS } from "../../constants";

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
  return (
    <>
      <div className="erm-card">
        <div className="erm-card-header">
          <span className="erm-card-title">Company & Transaction</span>
        </div>
        <div className="erm-card-body">
          <div className="erm-field-grid erm-fg-2" style={{ marginBottom: 14 }}>
            <TextInput
              id="h-company"
              label="Company name"
              value={header.company}
              onChange={(v) => onUpdateField("company", v)}
              placeholder="Meridian Manufacturing, LLC"
              required
              error={errors.get("company")}
            />
            <TextInput
              id="h-dealid"
              label="Deal ID / reference"
              value={header.dealId}
              onChange={(v) => onUpdateField("dealId", v)}
              placeholder="MER-2025"
            />
          </div>
          <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
            <TextInput
              id="h-industry"
              label="Industry / NAICS code"
              value={header.industry}
              onChange={(v) => onUpdateField("industry", v)}
              placeholder="Precision Manufacturing / 332710"
            />
            <SelectInput
              id="h-fye"
              label="Fiscal year end"
              value={header.fiscalYearEnd}
              options={FISCAL_YEAR_OPTIONS}
              onChange={(v) => onUpdateField("fiscalYearEnd", v)}
            />
            <DateInput
              id="h-close"
              label="Projected close date"
              value={header.closeDate}
              onChange={(v) => onUpdateField("closeDate", v)}
            />
          </div>
          <div className="erm-field-grid erm-fg-3">
            <NumberInput
              id="h-txval"
              label="Total transaction value ($)"
              value={header.transactionValue}
              onChange={(v) => onUpdateField("transactionValue", v)}
              placeholder="10000000"
              min={0}
              step={100000}
            />
            <NumberInput
              id="h-pct"
              label="ESOP ownership % acquired"
              value={header.esopOwnershipPct}
              onChange={(v) => onUpdateField("esopOwnershipPct", Math.min(100, Math.max(0, v)))}
              placeholder="100"
              min={1}
              max={100}
            />
            <NumberInput
              id="h-emp"
              label="Number of employees"
              value={header.employeeCount}
              onChange={(v) => onUpdateField("employeeCount", Math.max(0, v))}
              placeholder="85"
              min={0}
            />
          </div>
        </div>
      </div>
    </>
  );
}
