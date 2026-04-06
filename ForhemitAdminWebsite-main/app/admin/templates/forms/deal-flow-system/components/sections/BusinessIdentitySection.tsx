// ── BUSINESS IDENTITY SECTION ────────────────────────────────────────────────

import React from "react";
import type { Stage1Data, ValidationErrors } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  TextInput,
  SelectInput,
  NumberInput,
} from "../inputs";
import { ENTITY_TYPE_OPTIONS } from "../../constants";

interface BusinessIdentitySectionProps {
  data: Stage1Data["businessIdentity"];
  errors: ValidationErrors;
  updateBusinessIdentity: UseDealFlowFormReturn["updateBusinessIdentity"];
}

export function BusinessIdentitySection({
  data,
  errors,
  updateBusinessIdentity,
}: BusinessIdentitySectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.2</span>
          <span className="dfs-card-title">Business Identity</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-grid dfs-grid-3">
            <div className="dfs-span-2">
              <TextInput
                label="Company Name"
                value={data.companyName}
                onChange={(v) => updateBusinessIdentity({ companyName: v })}
                placeholder="Legal company name"
                required
                error={errors.companyName}
              />
            </div>
            <SelectInput
              label="Entity Type"
              value={data.entityType}
              onChange={(v) => updateBusinessIdentity({ entityType: v as typeof data.entityType })}
              options={ENTITY_TYPE_OPTIONS}
            />
            <NumberInput
              label="Years in Business"
              value={data.yearsInBusiness}
              onChange={(v) => updateBusinessIdentity({ yearsInBusiness: v })}
              placeholder="e.g. 12"
              min={0}
            />
            <TextInput
              label="City"
              value={data.city}
              onChange={(v) => updateBusinessIdentity({ city: v })}
              placeholder="City"
            />
            <TextInput
              label="State"
              value={data.state}
              onChange={(v) => updateBusinessIdentity({ state: v })}
              placeholder="e.g. TX"
            />
            <div className="dfs-span-2">
              <TextInput
                label="Website"
                value={data.website}
                onChange={(v) => updateBusinessIdentity({ website: v })}
                placeholder="https://..."
              />
            </div>
            <TextInput
              label="Industry"
              value={data.industry}
              onChange={(v) => updateBusinessIdentity({ industry: v })}
              placeholder="e.g. Manufacturing"
              required
              error={errors.industry}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
