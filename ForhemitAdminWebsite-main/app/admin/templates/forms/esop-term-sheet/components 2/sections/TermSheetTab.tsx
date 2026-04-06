"use client";

import React from "react";
import { UserInputs, Scenario } from "../../types";
import { GREEN } from "../../constants";
import { fmt, pct } from "../../lib/formatters";
import { Section, Row, ScenarioToggle } from "../shared";

interface TermSheetTabProps {
  scenario: Scenario;
  scenarios: { A: Scenario; B: Scenario };
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  inputs: UserInputs;
}

export function TermSheetTab({
  scenario: S,
  scenarios,
  activeScenario,
  onScenarioChange,
  inputs,
}: TermSheetTabProps) {
  return (
    <div>
      <ScenarioToggle
        active={activeScenario}
        onChange={onScenarioChange}
        scenarios={scenarios}
      />

      <Section title="Transaction Terms">
        <Row label="Purchase Price" value={fmt(S.pp)} bold />
        <Row label="Buyer" value="ESOP Trust (newly formed, employer plan)" />
        <Row
          label="Borrower (SBA obligor)"
          value="MSO Operating Company (ESOP-owned)"
        />
        <Row
          label="Seller Entity"
          value="C-Corporation (or pre-close conversion)"
        />
        <Row
          label="Seller Tax Treatment"
          value="§1042 election — tax-deferred QRP rollover"
        />
        <Row label="Closing Date (target)" value="TBD — 90–120 days from LOI" />
      </Section>

      <Section title="Capital Structure — Seller-Optimized">
        <Row
          label="Tranche 1 — SBA 7(a) Senior Debt"
          value={`${fmt(S.sba)}  (${pct(S.sba, S.total)})`}
          bold
          highlight
          note="Borrower: MSO Operating Co. · Prime + 2.75% (~7.75%) · 10-year fully amortizing · 75% SBA guaranteed"
        />
        <Row
          label="Tranche 2 — ESOP Leveraged Loan"
          value={`${fmt(S.esop)}  (${pct(S.esop, S.total)})`}
          bold
          highlight
          note={`Subordinated to SBA · ${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · lender TBD · active debt service`}
        />
        <Row
          label="Tranche 3 — Seller Note"
          value={`${fmt(S.note)}  (${pct(S.note, S.total)})`}
          bold
          note="Full standby for SBA loan term per SOP 50 10 8 · $0 debt service during term · deferred cash to seller"
        />
        <Row label="Total Project Cost" value={fmt(S.total)} bold />
      </Section>

      <Section title={`Seller Proceeds — ${S.label}`} accent="#16a34a">
        <Row label="Purchase Price" value={fmt(S.pp)} />
        <Row
          label="Less: Seller Note (deferred — full standby)"
          value={`(${fmt(S.note)})`}
          indent
          note="Seller receives this after SBA loan retires at year 10 — not at closing"
        />
        <Row
          label="★ Cash to Seller at Closing"
          value={fmt(S.sellerCash)}
          bold
          note={`${S.sellerCashPct}% of purchase price · maximum achievable at 1.25x OCF DSCR`}
        />
      </Section>

      <Section title="Debt Service Terms">
        <Row
          label="SBA 7(a) Annual Debt Service"
          value={fmt(S.sbaDS)}
          note="10-year fully amortizing · ~7.75%"
        />
        <Row
          label="ESOP Loan Annual Debt Service"
          value={fmt(S.esopDS)}
          note={`${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year · active payments · subordinated to SBA`}
        />
        <Row
          label="Seller Note Annual DS"
          value="$0"
          note="Full standby — no payments during SBA loan term"
        />
        <Row
          label="Total Active Annual Debt Service"
          value={fmt(S.totalDS)}
          bold
        />
        <Row
          label="DSCR — EBITDA Basis"
          value={`${S.dscr_ebitda.toFixed(2)}x`}
          bold
        />
        <Row
          label="DSCR — OCF Basis"
          value={`${S.dscr_ocf.toFixed(2)}x`}
          bold
          note="OCF DSCR is the binding constraint — maximized at exactly 1.25x"
        />
      </Section>

      <Section title="Closing Conditions (Forhemit Standard)">
        {[
          ["QofE Complete", "Independent Quality of Earnings validated before LOI"],
          [
            "ERISA Valuation",
            "ERISA-compliant independent appraisal in lieu of SBA appraisal per Notice 5000-872764",
          ],
          [
            "ESOP Trustee Engaged",
            "Independent qualified trustee in place before SBA submission",
          ],
          [
            "ESOP Loan Lender Confirmed",
            "Intercreditor terms agreed before SBA package submission",
          ],
          [
            "Seller Equity Exit",
            "Complete equity exit at close · post-close role as PC employee only",
          ],
          [
            "Citizenship Verified",
            "All PC owners verified per Policy Notice 5000-876441 (eff. March 1, 2026)",
          ],
          [
            "COOP Delivered",
            "Forhemit Continuity of Operations Plan complete pre-close",
          ],
        ].map(([label, note]) => (
          <Row key={label} label={label} value="✓ Required" note={note} />
        ))}
      </Section>
    </div>
  );
}
