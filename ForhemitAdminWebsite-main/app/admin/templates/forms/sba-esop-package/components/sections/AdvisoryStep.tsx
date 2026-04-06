"use client";

import React from "react";
import { TextInput } from "../inputs";
import { AdvisoryTeam } from "../../types";

interface AdvisoryStepProps {
  inputs: AdvisoryTeam;
  onUpdate: (updates: Partial<AdvisoryTeam>) => void;
}

export function AdvisoryStep({ inputs, onUpdate }: AdvisoryStepProps) {
  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Advisory team</h2>
        <p>
          The specialists engaged for the life of this transaction. Leave blank if
          not yet finalized — the document will show a &quot;credentials pending&quot; note
          automatically.
        </p>
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="ESOP legal counsel (firm name)"
          value={inputs.esopCounsel}
          onChange={(v) => onUpdate({ esopCounsel: v })}
          placeholder="Firm name"
        />
        <TextInput
          label="ESOP administrator (firm name)"
          value={inputs.esopAdmin}
          onChange={(v) => onUpdate({ esopAdmin: v })}
          placeholder="Firm name"
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Seller's CPA (firm / name)"
          value={inputs.sellerCpa}
          onChange={(v) => onUpdate({ sellerCpa: v })}
          placeholder="Firm or individual name"
        />
        <TextInput
          label="Seller's attorney (firm / name)"
          value={inputs.sellerAttorney}
          onChange={(v) => onUpdate({ sellerAttorney: v })}
          placeholder="Firm or individual name"
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Independent ESOP trustee (firm)"
          value={inputs.trustee}
          onChange={(v) => onUpdate({ trustee: v })}
          placeholder="Firm name"
        />
        <TextInput
          label="Independent valuation firm"
          value={inputs.valuationFirm}
          onChange={(v) => onUpdate({ valuationFirm: v })}
          placeholder="Firm name"
        />
      </div>

      <div className="pkg-sba-box">
        <div className="pkg-box-label">SBA trustee independence — mandatory</div>
        <p>
          Forhemit plays no role in trustee selection, vetting, interviewing, or
          compensation negotiation. The trustee must provide written acknowledgment
          confirming this. That acknowledgment is a required closing document and must
          be included in the LGPC submission package.
        </p>
      </div>
    </div>
  );
}
