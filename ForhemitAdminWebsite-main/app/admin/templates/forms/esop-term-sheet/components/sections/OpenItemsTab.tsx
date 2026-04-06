"use client";

import React from "react";
import { UserInputs, Scenario } from "../../types";
import { AMBER, BLUE } from "../../constants";
import { fmt } from "../../lib/formatters";
import { Section, OpenItem, Callout } from "../shared";

interface OpenItemsTabProps {
  scenario: Scenario;
  inputs: UserInputs;
}

export function OpenItemsTab({ scenario: S, inputs }: OpenItemsTabProps) {
  const openItems = [
    {
      number: 1,
      title: "QofE Must Be Complete Before ESOP Loan Is Sized",
      detail: `The ESOP leveraged loan amount is directly derived from OCF DSCR using your EBITDA of ${fmt(
        inputs.ebitda
      )}. The numbers shown are based on your inputs and may change once QofE is validated.`,
    },
    {
      number: 2,
      title: "ESOP Leveraged Loan Lender Must Be Identified Pre-Submission",
      detail:
        "The SBA lender requires the terms of all subordinated debt and an executed intercreditor agreement before approving the loan. The ESOP loan lender must be identified and qualified as part of deal team assembly.",
    },
    {
      number: 3,
      title: "SBA Approval of Subordinated Debt Terms",
      detail: `The SBA must approve the ESOP leveraged loan (${inputs.esopLoanRate}% / ${inputs.esopLoanTerm}-year terms) as subordinated debt. The intercreditor agreement between the SBA lender and the ESOP loan lender defines payment priority and cure rights.`,
    },
    {
      number: 4,
      title: "ESOP Equity Injection Exemption — MSO Qualification",
      detail:
        "Confirm in writing from ESOP counsel that the ESOP trust's acquisition of the MSO qualifies for the controlling interest equity injection exemption under SOP 50 10 8.",
    },
    {
      number: 5,
      title: "Seller Note Post-Standby Terms",
      detail: `The seller note terms (${fmt(
        S.note
      )} principal) post-year-10 must be documented in the purchase agreement. The SBA lender will ask at submission.`,
    },
    {
      number: 6,
      title: "§1042 Counsel Confirmation on Seller Note Timing",
      detail: `Your tax counsel must confirm how the deferred seller note interacts with the §1042 QRP election window. Cash proceeds of ${fmt(
        S.sellerCash
      )} at closing are clearly eligible.`,
    },
  ];

  const questions = [
    "We're structuring this deal to maximize seller closing cash within SBA coverage requirements. Our capital stack includes an ESOP leveraged loan subordinated to SBA. Has your credit team approved intercreditor structures with an ESOP leveraged loan alongside an SBA senior tranche?",
    "What has typically required adjustment when your credit committee reviews ESOP deals with layered subordinated debt?",
    "Does your institution process ESOP 7(a) transactions under PLP authority, or do they require SBA field office review?",
    "Are you willing to provide an indicative term sheet prior to LOI for a complete, pre-assembled package?",
  ];

  return (
    <div>
      <Section
        title="Structural Items to Resolve Before Lender Submission"
        accent={AMBER.color}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 13,
            color: "#374151",
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          These items must be resolved with ESOP counsel and SBA lender counsel
          before this term sheet becomes a credit submission.
        </div>
        {openItems.map((item) => (
          <OpenItem
            key={item.number}
            number={item.number}
            title={item.title}
            detail={item.detail}
          />
        ))}
      </Section>

      <Section title="First Lender Meeting — Opening Questions" accent="#2563eb">
        <Callout theme={BLUE} title="Approach">
          Lead with the structuring objective — maximizing seller cash while
          maintaining SBA-compliant coverage. This signals deal sophistication.
          Then ask about their experience with layered subordinated debt in ESOP
          transactions.
        </Callout>
        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              padding: "10px 14px",
              marginBottom: 8,
              backgroundColor: "#f0f6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              fontFamily: "Georgia, serif",
              fontSize: 12,
              color: "#1e40af",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            &ldquo;{q}&rdquo;
          </div>
        ))}
      </Section>
    </div>
  );
}
