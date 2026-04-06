"use client";

import React from "react";
import { CompanyInfo } from "../../types";
import { TextInput, TextArea } from "../inputs";

interface CompanyInfoSectionProps {
  company: CompanyInfo;
  onUpdateField: <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => void;
}

export function CompanyInfoSection({ company, onUpdateField }: CompanyInfoSectionProps) {
  return (
    <div className="ilg-field-group">
      <TextArea
        id="companyAddress"
        label="Office Address"
        value={company.address}
        onChange={(v) => onUpdateField("address", v)}
        placeholder="123 Main Street, Suite 400&#10;Chicago, IL 60601"
        rows={2}
      />
      <TextInput
        id="letterDate"
        label="Date on Letter"
        value={company.letterDate}
        onChange={(v) => onUpdateField("letterDate", v)}
        placeholder="January 1, 2025"
      />
    </div>
  );
}
