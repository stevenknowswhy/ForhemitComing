"use client";

import React from "react";
import { UserInputs, Scenario } from "../../types";
import { NAVY, BLUE } from "../../constants";
import { fmt } from "../../lib/formatters";
import { Section, Row, Callout, ScenarioToggle } from "../shared";

interface SellerEconomicsTabProps {
  scenario: Scenario;
  scenarios: { A: Scenario; B: Scenario };
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  inputs: UserInputs;
}

export function SellerEconomicsTab({
  scenario: S,
  scenarios,
  activeScenario,
  onScenarioChange,
  inputs,
}: SellerEconomicsTabProps) {
  const improvements = [
    {
      title: "Higher validated EBITDA",
      detail: `Every $100K increase in QofE-validated EBITDA creates additional ESOP loan capacity. Your current EBITDA of ${fmt(
        inputs.ebitda
      )} supports ${fmt(S.esop)} in ESOP financing.`,
    },
    {
      title: "Longer ESOP loan term",
      detail: `Extending from ${inputs.esopLoanTerm} to 10 years reduces annual debt service, allowing larger loan principal at the same DSCR constraint.`,
    },
    {
      title: "Lower ESOP loan rate",
      detail: `If the ESOP lender prices at 7.5% instead of ${inputs.esopLoanRate}%, the same principal produces lower annual DS — creating room for a larger loan.`,
    },
    {
      title: "Partial seller note outside standby",
      detail:
        "A portion of the seller note could be structured as non-standby subordinated debt with active payments, accepted by the SBA lender as subordinated financing.",
    },
  ];

  return (
    <div>
      <ScenarioToggle
        active={activeScenario}
        onChange={onScenarioChange}
        scenarios={scenarios}
      />

      <Section title="Seller Proceeds Summary">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Cash at Closing",
              value: fmt(S.sellerCash),
              sub: `${S.sellerCashPct}% of purchase price`,
              color: "#16a34a",
            },
            {
              label: "Seller Note (Deferred)",
              value: fmt(S.note),
              sub: "Received after SBA loan retires (yr 10+)",
              color: "#6b7280",
            },
            {
              label: "Total Consideration",
              value: fmt(S.pp),
              sub: "100% of purchase price — all accounted for",
              color: NAVY,
            },
            {
              label: "§1042 Eligible Proceeds",
              value: fmt(S.sellerCash),
              sub: "Cash proceeds eligible for QRP reinvestment",
              color: "#2563eb",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: 2,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#6b7280",
                }}
              >
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why the Seller Note Is Not Zero">
        <Callout theme={BLUE} title="The Binding Constraint Explained">
          The goal is to maximize seller closing cash. That means maximizing the
          ESOP leveraged loan, because that tranche produces real closing
          proceeds. But the ESOP loan creates active annual debt service — and
          OCF DSCR must stay at or above 1.25x for the SBA lender to approve.
          The seller note is what fills the remaining gap after both the SBA
          loan ({fmt(inputs.sbaLoanAmount)} cap) and the maximum ESOP loan
          (OCF-constrained) are fully deployed.
        </Callout>
        <Row label="SBA Loan (hard cap)" value={fmt(inputs.sbaLoanAmount)} />
        <Row label="Max ESOP Loan (OCF-constrained)" value={fmt(S.esop)} />
        <Row
          label="Total debt capacity"
          value={fmt(inputs.sbaLoanAmount + S.esop)}
          bold
        />
        <Row label="Total project cost" value={fmt(S.total)} />
        <Row
          label="Minimum seller note required"
          value={fmt(S.note)}
          bold
          note="This is the irreducible minimum based on your inputs"
        />
      </Section>

      <Section title="How to Reduce the Seller Note Further">
        {improvements.map(({ title, detail }) => (
          <div
            key={title}
            style={{
              marginBottom: 14,
              paddingBottom: 14,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                color: NAVY,
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 12,
                color: "#374151",
                lineHeight: 1.65,
              }}
            >
              {detail}
            </div>
          </div>
        ))}
      </Section>

      <Section title="§1042 Election — Seller Note Interaction" accent="#2563eb">
        <Callout theme={BLUE}>
          The §1042 election allows deferral of capital gains tax on cash
          proceeds by reinvesting in Qualified Replacement Property within 15
          months. Your cash at closing ({fmt(S.sellerCash)}) is fully eligible.
          The seller note ({fmt(S.note)}) defers tax until payments are
          received.
        </Callout>
      </Section>
    </div>
  );
}
