"use client";

import React from "react";
import { UserInputs, Scenario } from "../../types";
import { BLUE } from "../../constants";
import { fmt, pct } from "../../lib/formatters";
import { Section, Row, StackBar, Callout, ScenarioToggle } from "../shared";

interface SourcesUsesTabProps {
  scenario: Scenario;
  scenarios: { A: Scenario; B: Scenario };
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  inputs: UserInputs;
}

export function SourcesUsesTab({
  scenario: S,
  scenarios,
  activeScenario,
  onScenarioChange,
  inputs,
}: SourcesUsesTabProps) {
  return (
    <div>
      <ScenarioToggle
        active={activeScenario}
        onChange={onScenarioChange}
        scenarios={scenarios}
      />

      <Section title="Capital Stack">
        <StackBar scenario={S} />
      </Section>

      <Section title="Uses of Funds">
        <Row label="Purchase Price" value={fmt(inputs.purchasePrice)} indent />
        <Row
          label="Closing Costs"
          value={fmt(inputs.sbaFee + inputs.stampTax + 350_000)}
          indent
          note="SBA guarantee fee, stamp tax, legal, title, working capital"
        />
        <Row label="Total Project Cost" value={fmt(S.total)} bold />
      </Section>

      <Section title="Sources of Funds">
        <Row
          label="SBA 7(a) Senior Debt"
          value={`${fmt(S.sba)}  (${pct(S.sba, S.total)})`}
          bold
          highlight
          note="Prime + 2.75% (~7.75%) · 10yr fully amortizing · 75% guaranteed"
        />
        <Row
          label="ESOP Leveraged Loan"
          value={`${fmt(S.esop)}  (${pct(S.esop, S.total)})`}
          bold
          highlight
          note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}yr · subordinated · lender TBD`}
        />
        <Row
          label="Seller Note (full standby)"
          value={`${fmt(S.note)}  (${pct(S.note, S.total)})`}
          note="$0 annual DS during SBA term · deferred cash · supports §1042 mechanics"
        />
        <Row label="Total Sources" value={fmt(S.total)} bold />
      </Section>

      <Callout theme={BLUE} title="Why This Stack Is Seller-Optimized">
        The seller note is sized to the minimum required to balance the capital
        stack after maximizing both the SBA tranche ({fmt(inputs.sbaLoanAmount)}{" "}
        cap) and the ESOP leveraged loan (constrained by OCF DSCR at 1.25x). Every
        dollar shifted from the seller note to the ESOP loan is a dollar the
        seller receives at closing rather than in year 10.
      </Callout>
    </div>
  );
}
