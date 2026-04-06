"use client";

import React from "react";
import { TextInput } from "../inputs";
import { DealHeader } from "../../types";

interface LenderInfoSectionProps {
  header: DealHeader;
  onUpdateField: <K extends keyof DealHeader>(field: K, value: DealHeader[K]) => void;
  onFormatPhone: () => void;
  errors: Map<string, string>;
}

export function LenderInfoSection({
  header,
  onUpdateField,
  onFormatPhone,
  errors,
}: LenderInfoSectionProps) {
  return (
    <div className="lqa-form-card">
      <div className="lqa-card-header">
        <span className="lqa-card-header-label">Lender Information</span>
      </div>
      <div className="lqa-card-body">
        <div className="lqa-field-grid lqa-field-grid-2">
          <TextInput
            id="lender"
            label="Lender name"
            value={header.lender}
            onChange={(v) => onUpdateField("lender", v)}
            placeholder="First Community Bank"
            required
            error={errors.get("lender")}
          />
          <TextInput
            id="lcontact"
            label="Lender contact name"
            value={header.lcontact}
            onChange={(v) => onUpdateField("lcontact", v)}
            placeholder="Jane Smith"
            required
            error={errors.get("lcontact")}
          />
          <TextInput
            id="lemail"
            label="Lender contact email"
            value={header.lemail}
            onChange={(v) => onUpdateField("lemail", v)}
            placeholder="jsmith@firstcommunity.com"
            type="email"
            required
            error={errors.get("lemail")}
          />
          <TextInput
            id="lphone"
            label="Lender contact phone"
            value={header.lphone}
            onChange={(v) => onUpdateField("lphone", v)}
            onBlur={onFormatPhone}
            placeholder="(555) 555-0100"
            error={errors.get("lphone")}
          />
        </div>
      </div>
    </div>
  );
}
