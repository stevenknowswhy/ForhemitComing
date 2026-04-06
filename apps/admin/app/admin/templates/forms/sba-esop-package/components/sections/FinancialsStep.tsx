"use client";

import React from "react";
import { TextInput } from "../inputs";
import { FinancialSnapshot, ValidationErrors } from "../../types";

interface FinancialsStepProps {
  inputs: FinancialSnapshot;
  onUpdate: (updates: Partial<FinancialSnapshot>) => void;
  errors: ValidationErrors;
}

export function FinancialsStep({ inputs, onUpdate, errors }: FinancialsStepProps) {
  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Financial snapshot</h2>
        <p>
          Key figures for the metrics bar and DSCR analysis. These must match the
          attached financial package exactly.
        </p>
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="TTM revenue"
          value={inputs.revenue}
          onChange={(v) => onUpdate({ revenue: v })}
          placeholder="e.g. $3.2M"
          hint="Trailing 12-month gross revenue"
          error={errors.revenue}
          required
        />
        <TextInput
          label="Adjusted EBITDA"
          value={inputs.ebitda}
          onChange={(v) => onUpdate({ ebitda: v })}
          placeholder="e.g. $720K"
          hint="Normalized — must match financial package"
          error={errors.ebitda}
          required
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Projected post-close DSCR"
          value={inputs.dscr}
          onChange={(v) => onUpdate({ dscr: v })}
          placeholder="e.g. 1.42x"
          hint="Must exceed 1.25x SBA minimum"
          error={errors.dscr}
          required
        />
        <TextInput
          label="Key person life insurance total"
          value={inputs.kpInsurance}
          onChange={(v) => onUpdate({ kpInsurance: v })}
          placeholder="e.g. $4,000,000"
          hint="Total coverage for all identified key persons"
        />
      </div>

      <div className="pkg-sba-box">
        <div className="pkg-box-label">SBA DSCR disclosure requirement</div>
        <p>
          Forhemit&apos;s annual stewardship fee ($50K–$75K on a $5M transaction) must be
          modeled as SG&amp;A in the attached financial projections. If this expense
          reduces projected DSCR below 1.25x at any point in the 24-month engagement
          period, the seller must fund a 6-month debt service reserve at closing. The
          financial package must include a base-case DSCR and a sensitivity scenario.
        </p>
      </div>
    </div>
  );
}
