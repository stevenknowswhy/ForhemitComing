"use client";

import React from "react";
import { TextInput, NumberInput, SelectInput } from "../inputs";
import { LenderInfo, ValidationErrors } from "../../types";
import { STATE_OPTIONS } from "../../constants";

interface LenderInfoStepProps {
  inputs: LenderInfo;
  onUpdate: (updates: Partial<LenderInfo>) => void;
  errors: ValidationErrors;
}

export function LenderInfoStep({ inputs, onUpdate, errors }: LenderInfoStepProps) {
  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Lender &amp; transaction</h2>
        <p>
          Who is receiving this package, and what is the basic deal structure? These
          fields populate the cover block and routing table.
        </p>
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Lender / credit officer name"
          value={inputs.lenderName}
          onChange={(v) => onUpdate({ lenderName: v })}
          placeholder="e.g. Jane Smith"
          error={errors.lenderName}
          required
        />
        <TextInput
          label="Lending institution"
          value={inputs.institution}
          onChange={(v) => onUpdate({ institution: v })}
          placeholder="e.g. First National Bank"
          error={errors.institution}
          required
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Target company legal name"
          value={inputs.companyName}
          onChange={(v) => onUpdate({ companyName: v })}
          placeholder="Legal business name"
          error={errors.companyName}
          required
        />
        <TextInput
          label="Industry"
          value={inputs.industry}
          onChange={(v) => onUpdate({ industry: v })}
          placeholder="e.g. Commercial HVAC Services"
          error={errors.industry}
          required
        />
      </div>

      <div className="pkg-field-row pkg-triple">
        <NumberInput
          label="Years in operation"
          value={inputs.yearsInOperation}
          onChange={(v) => onUpdate({ yearsInOperation: v })}
          placeholder="e.g. 18"
          min={1}
          error={errors.yearsInOperation}
          required
        />
        <TextInput
          label="Submission date"
          type="date"
          value={inputs.submissionDate}
          onChange={(v) => onUpdate({ submissionDate: v })}
        />
        <SelectInput
          label="PBC registration state"
          value={inputs.pbcState}
          onChange={(v) => onUpdate({ pbcState: v })}
          options={STATE_OPTIONS}
          placeholder="Select state..."
        />
      </div>
    </div>
  );
}
