"use client";

import React from "react";
import { FinancialProjections } from "../../types";
import { NumberInput, SelectInput } from "../inputs";
import { PROJECTION_METHOD_OPTIONS } from "../../constants";

interface ProjectionsSectionProps {
  projections: FinancialProjections;
  onUpdateField: <K extends keyof FinancialProjections>(
    field: K,
    value: FinancialProjections[K]
  ) => void;
}

export function ProjectionsSection({
  projections,
  onUpdateField,
}: ProjectionsSectionProps) {
  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Financial Projections</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
          <NumberInput
            id="ebitda"
            label="Year 1 EBITDA ($)"
            value={projections.year1Ebitda}
            onChange={(v) => onUpdateField("year1Ebitda", Math.max(0, v))}
            placeholder="1800000"
            step={50000}
            min={0}
            required
            hint="Post-transaction, management-adjusted"
          />
          <NumberInput
            id="ebitda-growth"
            label="EBITDA growth rate (%/yr)"
            value={projections.ebitdaGrowthRate}
            onChange={(v) => onUpdateField("ebitdaGrowthRate", v)}
            placeholder="3.0"
            step={0.5}
          />
          <NumberInput
            id="ttm-ebitda"
            label="Historical EBITDA (trailing 12 mo)"
            value={projections.historicalEbitda}
            onChange={(v) => onUpdateField("historicalEbitda", Math.max(0, v))}
            placeholder="1750000"
            step={50000}
            min={0}
          />
        </div>
        <div className="erm-field-grid erm-fg-4" style={{ marginBottom: 14 }}>
          <NumberInput
            id="capex-pct"
            label="Capex reserve (% EBITDA)"
            value={projections.capexPct}
            onChange={(v) => onUpdateField("capexPct", Math.max(0, Math.min(100, v)))}
            placeholder="5"
            step={1}
            min={0}
            max={100}
            hint="Maintenance capex only"
          />
          <NumberInput
            id="tax-pct"
            label="Cash taxes (% EBITDA)"
            value={projections.taxPct}
            onChange={(v) => onUpdateField("taxPct", Math.max(0, Math.min(100, v)))}
            placeholder="8"
            step={1}
            min={0}
            max={100}
          />
          <NumberInput
            id="wc-reserve"
            label="Working capital reserve ($)"
            value={projections.workingCapitalReserve}
            onChange={(v) => onUpdateField("workingCapitalReserve", Math.max(0, v))}
            placeholder="0"
            step={10000}
            min={0}
          />
          <NumberInput
            id="da"
            label="D&A (annual, $)"
            value={projections.depreciationAmortization}
            onChange={(v) => onUpdateField("depreciationAmortization", Math.max(0, v))}
            placeholder="120000"
            step={10000}
            min={0}
            hint="For DSCR add-back"
          />
        </div>
        <div className="erm-field-grid erm-fg-2">
          <NumberInput
            id="addbacks"
            label="EBITDA add-backs (total, $)"
            value={projections.addbacks}
            onChange={(v) => onUpdateField("addbacks", Math.max(0, v))}
            placeholder="0"
            step={10000}
            min={0}
            hint="One-time items normalized out"
          />
          <SelectInput
            id="proj-method"
            label="Projection methodology"
            value={projections.projectionMethod}
            options={PROJECTION_METHOD_OPTIONS}
            onChange={(v) =>
              onUpdateField("projectionMethod", v as "mgmt" | "advisor" | "historical" | "conservative")
            }
          />
        </div>
      </div>
    </div>
  );
}
