"use client";

import React from "react";
import { UserInputs, Scenario } from "../../types";
import { GREEN, AMBER, GRAY } from "../../constants";
import { fmt } from "../../lib/formatters";
import {
  Section,
  Row,
  DSCRBar,
  Callout,
  ScenarioToggle,
} from "../shared";

interface DebtServiceTabProps {
  scenario: Scenario;
  scenarios: { A: Scenario; B: Scenario };
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  inputs: UserInputs;
}

export function DebtServiceTab({
  scenario: S,
  scenarios,
  activeScenario,
  onScenarioChange,
  inputs,
}: DebtServiceTabProps) {
  return (
    <div>
      <ScenarioToggle
        active={activeScenario}
        onChange={onScenarioChange}
        scenarios={scenarios}
      />

      <Callout
        theme={activeScenario === "B" ? GREEN : AMBER}
        title={`${S.label} — Coverage at Maximum Seller Cash`}
      >
        Both EBITDA-basis (1.25x minimum) and OCF-basis (1.25x minimum) DSCR
        are maintained. The ESOP leveraged loan is sized to the exact point
        where OCF DSCR reaches 1.25x — the lender&apos;s floor.
      </Callout>

      <Section title="Cash Flow Build">
        <Row label="EBITDA (QofE-validated)" value={fmt(S.ebitda)} bold />
        <Row label="Less: D&A (estimated)" value="($150,000)" indent />
        <Row label="EBIT" value={fmt(S.ebitda - 150_000)} indent />
        <Row
          label="Less: Taxes (~28% blended effective rate)"
          value={`(${fmt((S.ebitda - 150_000) * (inputs.taxRate / 100))})`}
          indent
        />
        <Row
          label="NOPAT"
          value={fmt((S.ebitda - 150_000) * (1 - inputs.taxRate / 100))}
          indent
        />
        <Row label="Add back: D&A" value="$150,000" indent />
        <Row label="Operating Cash Flow (post-tax)" value={fmt(S.ocf)} bold />
      </Section>

      <Section title="Annual Debt Service — Steady State">
        <Row
          label="SBA 7(a) Annual DS"
          value={fmt(S.sbaDS)}
          bold
          note="10-year fully amortizing · ~7.75%"
        />
        <Row
          label="ESOP Leveraged Loan Annual DS"
          value={fmt(S.esopDS)}
          note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · active · subordinated to SBA`}
        />
        <Row
          label="Seller Note"
          value="$0"
          note="Full standby per SOP 50 10 8 — zero payments during SBA term"
        />
        <Row label="Total Active Annual DS" value={fmt(S.totalDS)} bold />
      </Section>

      <Section title="Coverage Ratios">
        <DSCRBar
          label="DSCR — EBITDA Basis"
          value={S.dscr_ebitda}
          color={S.dscr_ebitda >= 1.5 ? "#16a34a" : "#d97706"}
        />
        <DSCRBar label="DSCR — OCF Basis (binding constraint)" value={S.dscr_ocf} color="#16a34a" />
        <Callout theme={GRAY}>
          OCF DSCR is the binding constraint because lenders underwrite on
          post-tax operating cash flow, not EBITDA. The ESOP leveraged loan is
          sized to hold OCF DSCR at exactly 1.25x.
        </Callout>
      </Section>

      <Section title="Stress Test">
        {[
          ["Base Case", S.ebitda, S.dscr_ebitda],
          ["EBITDA −10%", S.ebitda * 0.9, S.stress10],
          ["EBITDA −20%", S.ebitda * 0.8, S.stress20],
        ].map(([label, e, d]) => {
          const dscrValue = typeof d === "number" ? d : parseFloat(d as string);
          const ebitdaValue =
            typeof e === "number" ? e : parseFloat(e as string);
          return (
            <Row
              key={label}
              label={label}
              value={
                <span
                  style={{
                    color:
                      dscrValue >= 1.25
                        ? "#16a34a"
                        : dscrValue >= 1.1
                        ? "#d97706"
                        : "#dc2626",
                  }}
                >
                  {fmt(ebitdaValue)} → {dscrValue.toFixed(2)}x
                </span>
              }
            />
          );
        })}
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#6b7280",
            marginTop: 8,
          }}
        >
          Break-even EBITDA for 1.25x coverage: ~{fmt(S.breakeven)}
        </div>
      </Section>
    </div>
  );
}
