"use client";

import React from "react";
import { SBALoan } from "../../types";
import { NumberInput, SelectInput, TextInput } from "../inputs";
import { SBA_TERM_OPTIONS, AMORTIZATION_OPTIONS } from "../../constants";

interface SBALoanSectionProps {
  loan: SBALoan;
  onUpdateField: <K extends keyof SBALoan>(field: K, value: SBALoan[K]) => void;
}

export function SBALoanSection({ loan, onUpdateField }: SBALoanSectionProps) {
  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">SBA Loan</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
          <NumberInput
            id="sba-amt"
            label="Loan amount ($)"
            value={loan.amount}
            onChange={(v) => onUpdateField("amount", Math.max(0, v))}
            placeholder="6000000"
            step={100000}
            min={0}
            required
            hint="SBA 7(a) maximum is $5,000,000"
          />
          <NumberInput
            id="sba-rate"
            label="Interest rate (%)"
            value={loan.rate}
            onChange={(v) => onUpdateField("rate", Math.max(0, v))}
            placeholder="7.50"
            step={0.25}
            min={0}
            required
            hint="Prime + spread; current prime ~8.5%"
          />
          <SelectInput
            id="sba-term"
            label="Loan term"
            value={loan.term}
            options={SBA_TERM_OPTIONS}
            onChange={(v) => onUpdateField("term", parseInt(v))}
            required
          />
        </div>
        <div className="erm-field-grid erm-fg-3">
          <SelectInput
            id="sba-amort"
            label="Amortization type"
            value={loan.amortizationType}
            options={AMORTIZATION_OPTIONS}
            onChange={(v) =>
              onUpdateField("amortizationType", v as "full" | "io1" | "io2")
            }
          />
          <div className="erm-field">
            <label>Prepayment penalty</label>
            <select
              value={loan.prepaymentPenalty ? "yes" : "no"}
              onChange={(e) => onUpdateField("prepaymentPenalty", e.target.value === "yes")}
            >
              <option value="yes">Yes — SBA standard</option>
              <option value="no">No</option>
            </select>
          </div>
          <TextInput
            id="sba-collateral"
            label="Collateral / lien position"
            value={loan.collateral}
            onChange={(v) => onUpdateField("collateral", v)}
            placeholder="All business assets, 1st lien"
          />
        </div>
      </div>
    </div>
  );
}
