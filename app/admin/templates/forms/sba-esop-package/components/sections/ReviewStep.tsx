"use client";

import React from "react";
import { PackageInputs, ComplianceChecklist } from "../../types";
import { CHECKLIST_ITEMS } from "../../constants";
import { fmtDscr } from "../../lib/formatters";

interface ReviewStepProps {
  inputs: PackageInputs;
  onGenerate: () => void;
  canGenerate: boolean;
}

interface SummaryField {
  label: string;
  value: string;
  required?: boolean;
}

export function ReviewStep({ inputs, onGenerate, canGenerate }: ReviewStepProps) {
  const fields: SummaryField[] = [
    { label: "Target company", value: inputs.lender.companyName, required: true },
    { label: "Lender", value: inputs.lender.lenderName, required: true },
    { label: "Institution", value: inputs.lender.institution, required: true },
    { label: "Industry", value: inputs.lender.industry },
    { label: "Years operating", value: inputs.lender.yearsInOperation?.toString() || "" },
    { label: "TTM Revenue", value: inputs.financial.revenue, required: true },
    { label: "Adj. EBITDA", value: inputs.financial.ebitda, required: true },
    { label: "DSCR", value: fmtDscr(inputs.financial.dscr), required: true },
    { label: "KP Insurance", value: inputs.financial.kpInsurance },
    { label: "Founder name", value: inputs.forhemit.founderName, required: true },
    { label: "Founder email", value: inputs.forhemit.email, required: true },
    { label: "PBC State", value: inputs.lender.pbcState },
  ];

  const missingFields = fields
    .filter((f) => f.required && !f.value)
    .map((f) => f.label);

  const checklistLabels = CHECKLIST_ITEMS.map((item) => {
    // Shortened labels for review display
    const shortMap: Record<keyof ComplianceChecklist, string> = {
      feeStructureDeliverables: "Fees tied to deliverables only",
      sbaCounselReview: "SBA counsel review planned",
      sellerGuarantee: "Seller guarantee executed",
      twentyFourMonthStop: "24-month hard stop confirmed",
      trusteeIndependence: "Trustee independence documented",
      controlDisclaimer: "Control disclaimer in agreement",
      feesModeled: "Fees modeled as SG&A",
      erisaDisclaimer: "ERISA disclaimer present",
      sellerNoteStandby: "Seller Note on full standby",
      month20Transition: "Month-20 transition report scheduled",
    };
    return shortMap[item.key];
  });

  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Review &amp; generate</h2>
        <p>
          Confirm the details below, then generate your completed executive summary.
          All SBA compliance language, the COOP contrast table, and the full
          attachment checklist will be included automatically.
        </p>
      </div>

      <div className="pkg-summary-grid">
        {fields.map((f) => (
          <div key={f.label} className="pkg-summary-card">
            <div className="pkg-summary-label">{f.label}</div>
            <div className={`pkg-summary-value ${!f.value ? "empty" : ""}`}>
              {f.value || "Not entered"}
            </div>
          </div>
        ))}
      </div>

      <div className="pkg-check-grid">
        {checklistLabels.map((label, i) => (
          <div key={i} className="pkg-check-row">
            {label}
          </div>
        ))}
      </div>

      {missingFields.length > 0 && (
        <div className="pkg-error-box">
          <strong>Required fields missing:</strong> {missingFields.join(", ")}.
          Please go back and complete these before generating.
        </div>
      )}

      <div className="pkg-generate-section">
        <h3>Ready to generate</h3>
        <p>
          Clicking generate produces the complete executive summary document with
          every field populated, all SBA compliance language intact, the contrast
          table showing prepared vs. unprepared scenarios, the direct lender appeal,
          the seller guarantee terms, and the full LGPC attachment checklist.
        </p>
        <button
          className="pkg-generate-btn"
          onClick={onGenerate}
          disabled={!canGenerate || missingFields.length > 0}
        >
          Generate executive summary package ↗
        </button>
      </div>
    </div>
  );
}
