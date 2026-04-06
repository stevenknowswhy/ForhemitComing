"use client";

import React from "react";
import { DealInputs, CapitalStack } from "../../types";
import { SBA_MAX_LOAN } from "../../constants";
import { NumberInput, ToggleButton } from "../inputs";
import { fmt, fmtPct } from "../../lib/formatters";
import { COLORS } from "../../constants";

interface CapitalStackStepProps {
  inputs: DealInputs;
  onUpdateCapital: (updates: Partial<CapitalStack>) => void;
  calculated: {
    totalProjectCost: number;
    esopLoan: number;
    sbaPct: number;
    sellerPct: number;
    esopPct: number;
  };
}

export function CapitalStackStep({
  inputs,
  onUpdateCapital,
  calculated,
}: CapitalStackStepProps) {
  const { capital } = inputs;
  const { totalProjectCost, esopLoan, sbaPct, sellerPct, esopPct } = calculated;

  // FIXED: Only show standby toggle when seller note > 0
  const showStandbyToggle = capital.sellerNote > 0;

  return (
    <div className="di-step-content">
      <div className="di-section-label">Capital structure</div>

      <p className="di-intro-text">
        Forhemit does not appear in the capital stack. The ESOP trust — on behalf
        of the employees — is the buyer. Set the SBA and seller note amounts;
        the ESOP leveraged loan fills the remainder.
      </p>

      <NumberInput
        label="SBA 7(a) senior debt"
        value={capital.sbaAmount}
        onChange={(v) => onUpdateCapital({ sbaAmount: Math.min(v, SBA_MAX_LOAN) })}
        placeholder="5,000,000"
        prefix="$"
        min={0}
        max={SBA_MAX_LOAN}
        step={100000}
        hint="Maximum $5M per SBA program limits. Subject to lender credit approval."
      />

      <NumberInput
        label="Seller note"
        value={capital.sellerNote}
        onChange={(v) => onUpdateCapital({ sellerNote: v })}
        placeholder="2,000,000"
        prefix="$"
        min={0}
        step={100000}
      />

      {/* FIXED: Only show standby toggle when seller note > 0 */}
      {showStandbyToggle && (
        <>
          <ToggleButton
            label="Seller note structure"
            value={capital.standbyMode}
            onChange={(v) => onUpdateCapital({ standbyMode: v as "full" | "active" })}
            options={[
              {
                value: "full",
                label: "Full standby",
                description: "$0 debt service during SBA term — maximizes DSCR",
              },
              {
                value: "active",
                label: "Active payment",
                description: "Interest-only at 6% p.a. (modeled)",
              },
            ]}
          />

          <p className="di-hint">
            {capital.standbyMode === "full"
              ? "Full standby: seller note counts as equity injection under SOP 50 10 8. Zero debt service during the SBA loan term."
              : "Active payment: seller note carries current debt service (modeled as interest-only at 6% p.a.). This reduces DSCR during the SBA term."}
          </p>
        </>
      )}

      {totalProjectCost > 0 && (
        <div className="di-stack-summary">
          <div className="di-stack-card">
            <div className="di-stack-label">SBA 7(a)</div>
            <div className="di-stack-val">{fmt(inputs.capital.sbaAmount)}</div>
            <div className="di-stack-pct">{fmtPct(sbaPct)} of total</div>
            <div
              className="di-stack-bar"
              style={{
                background: COLORS.sba,
                width: `${Math.min(sbaPct, 100)}%`,
              }}
            />
          </div>

          <div className="di-stack-card">
            <div className="di-stack-label">Seller note</div>
            <div className="di-stack-val">{fmt(inputs.capital.sellerNote)}</div>
            <div className="di-stack-pct">{fmtPct(sellerPct)} of total</div>
            <div
              className="di-stack-bar"
              style={{
                background: COLORS.seller,
                width: `${Math.min(sellerPct, 100)}%`,
              }}
            />
          </div>

          <div className="di-stack-card">
            <div className="di-stack-label">ESOP loan (TBD)</div>
            <div className="di-stack-val">{fmt(esopLoan)}</div>
            <div className="di-stack-pct">{fmtPct(esopPct)} of total</div>
            <div
              className="di-stack-bar"
              style={{
                background: COLORS.esop,
                width: `${Math.min(esopPct, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
