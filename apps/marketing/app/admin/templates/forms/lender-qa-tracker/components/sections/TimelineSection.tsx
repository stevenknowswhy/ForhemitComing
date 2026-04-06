"use client";

import React from "react";
import { TextInput, SelectInput, DateInput } from "../inputs";
import { DealHeader } from "../../types";
import { DEAL_STAGE_OPTIONS } from "../../constants";
import { validateDates } from "../../lib/validation";

interface TimelineSectionProps {
  header: DealHeader;
  onUpdateField: <K extends keyof DealHeader>(field: K, value: DealHeader[K]) => void;
  errors: Map<string, string>;
}

export function TimelineSection({
  header,
  onUpdateField,
  errors,
}: TimelineSectionProps) {
  const dateCheck = validateDates(header.subdate, header.closedate);

  const dateHint = dateCheck.daysDiff > 0
    ? dateCheck.valid
      ? `${dateCheck.daysDiff} days duration`
      : `Warning: Only ${dateCheck.daysDiff} days (minimum 30 recommended)`
    : "";

  return (
    <div className="lqa-form-card">
      <div className="lqa-card-header">
        <span className="lqa-card-header-label">Timeline & Status</span>
      </div>
      <div className="lqa-card-body">
        <div className="lqa-field-grid lqa-field-grid-3">
          <DateInput
            id="subdate"
            label="Submission date"
            value={header.subdate}
            onChange={(v) => onUpdateField("subdate", v)}
            required
            error={errors.get("subdate")}
          />
          <DateInput
            id="closedate"
            label="Target close date"
            value={header.closedate}
            onChange={(v) => onUpdateField("closedate", v)}
            required
            error={errors.get("closedate")}
            hint={dateHint}
          />
          <SelectInput
            id="dealstage"
            label="Deal stage"
            value={header.dealstage}
            onChange={(v) => onUpdateField("dealstage", v as DealHeader["dealstage"])}
            options={DEAL_STAGE_OPTIONS}
            required
            error={errors.get("dealstage")}
          />
          <TextInput
            id="advisor"
            label="Lead advisor / firm"
            value={header.advisor}
            onChange={(v) => onUpdateField("advisor", v)}
            placeholder="Acme ESOP Advisors"
          />
          <TextInput
            id="advisoremail"
            label="Advisor contact email"
            value={header.advisoremail}
            onChange={(v) => onUpdateField("advisoremail", v)}
            placeholder="advisor@firm.com"
            type="email"
            error={errors.get("advisoremail")}
          />
          <TextInput
            id="headernotes"
            label="Notes"
            value={header.headernotes}
            onChange={(v) => onUpdateField("headernotes", v)}
            placeholder="Any deal-level notes…"
          />
        </div>
      </div>
    </div>
  );
}
