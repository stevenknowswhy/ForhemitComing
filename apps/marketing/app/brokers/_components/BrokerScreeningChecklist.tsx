"use client";

import { useState } from "react";

const SCREENING: { group: string; items: string[] }[] = [
  {
    group: "The qualification standard",
    items: [
      "Annual revenue of $3M or more",
      "20 or more verifiable U.S. employees",
      "Profitable, with a consistent track record",
      "The owner holds 51% or more of the company",
      "The owner can allow a full four months for the transition",
      "The owner is willing to be available to the company for a transition period of 4 to 12 months after closing — on call for agreed check-ins, introductions, and questions, not working hands-on",
    ],
  },
  {
    group: "Business readiness",
    items: [
      "Financial statements are current and credible",
      "Tax returns are filed and consistent with the financial statements",
      "No single customer accounts for an outsized share of revenue",
      "There is management depth below the owner",
      "Key relationships — customers, suppliers, landlords — are transferable",
      "No unresolved litigation or regulatory issues",
    ],
  },
  {
    group: "Owner readiness",
    items: [
      "The owner has a genuine reason to transition beyond price",
      "The owner is open to employees as the buyers — not only the highest bidder",
      "The owner will communicate the transition honestly to the team at the right moment",
      "The owner's personal finances do not require cash within 30 days",
      "The owner has — or will engage — their own legal and tax advisors",
      "Family stakeholders understand the plan and support it",
    ],
  },
];

const FLAT = SCREENING.flatMap((g) => g.items);
const GATE_ITEMS = SCREENING[0]?.items ?? [];
const BUSINESS_ITEMS = SCREENING[1]?.items ?? [];
const OWNER_ITEMS = SCREENING[2]?.items ?? [];

function readinessVerdict(score: number): string {
  if (score >= 5) return "Promising";
  if (score >= 3) return "Needs preparation";
  return "Not ready";
}

export function BrokerScreeningChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => FLAT.map(() => false));
  const count = checked.filter(Boolean).length;
  const started = count > 0;

  const gateChecked = checked.slice(0, 6);
  const failedGates = GATE_ITEMS.filter((_, i) => !gateChecked[i]);
  const gatesPass = failedGates.length === 0;

  const businessScore = checked.slice(6, 12).filter(Boolean).length;
  const ownerScore = checked.slice(12, 18).filter(Boolean).length;

  let offset = 0;

  return (
    <div>
      <p className="fmp-section-lead">
        The same screen we run on a first call, in your hands. Check what you know to be true of
        the business you have in mind. This tool collects no personal data — nothing you check
        here is saved or sent anywhere.
      </p>
      <p className="fmp-section-lead">
        The six qualification criteria are hard gates: a business must meet every one. The two
        readiness groups are scored separately. This checklist is a first screen, not a
        determination.
      </p>

      {SCREENING.map((group) => {
        const start = offset;
        offset += group.items.length;
        const isGates = group.group === "The qualification standard";
        return (
          <fieldset key={group.group} style={{ border: "none", margin: "28px 0 0", padding: 0 }}>
            <legend className="fmp-call-prepare-label">
              {group.group}
              {isGates ? " — hard gates" : ""}
            </legend>
            <ul className="fmp-elig-list" role="group" aria-label={group.group}>
              {group.items.map((item, j) => {
                const idx = start + j;
                return (
                  <li key={item} className="fmp-elig-item">
                    <button
                      type="button"
                      className={`fmp-elig-btn${checked[idx] ? " fmp-elig-btn--checked" : ""}`}
                      aria-pressed={!!checked[idx]}
                      onClick={() =>
                        setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)))
                      }
                    >
                      <span className="fmp-elig-check" aria-hidden>
                        {checked[idx] ? "✓" : ""}
                      </span>
                      <span className="fmp-elig-label">{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}

      <div aria-live="polite" style={{ marginTop: 28 }}>
        <p className="fmp-call-prepare-label">{count} of 18 checked</p>
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={18}
          aria-label="Screening items checked"
          style={{ height: 8, background: "rgba(0,0,0,0.08)", marginTop: 8 }}
        >
          <div
            style={{
              height: 8,
              width: `${(count / 18) * 100}%`,
              background: "#2C3E2D",
              transition: "width 200ms ease",
            }}
          />
        </div>

        {!started && (
          <p className="fmp-section-lead" style={{ marginTop: 16 }}>
            Check the items you know to be true to see the screening result. Remember: this is a
            first screen, not a determination.
          </p>
        )}

        {started && !gatesPass && (
          <div
            className="fmp-elig-summary fmp-elig-summary--explore"
            role="status"
            style={{ marginTop: 16 }}
          >
            <p className="fmp-elig-summary-text">
              <strong>Not currently eligible.</strong> This business does not yet meet every
              qualification criterion. The failed criterion{failedGates.length > 1 ? "s are" : " is"}:{" "}
              {failedGates.join("; ")}.
            </p>
            <p className="fmp-elig-summary-text">
              Until every hard gate is met, the readiness scores below do not change the result.
              This is a first screen, not a determination — if a criterion is close, bring it to
              a first call and we will talk it through.
            </p>
          </div>
        )}

        {started && gatesPass && (
          <div
            className="fmp-elig-summary fmp-elig-summary--strong"
            role="status"
            style={{ marginTop: 16 }}
          >
            <p className="fmp-elig-summary-text">
              <strong>Eligible on the qualification standard.</strong> All six hard gates are
              met. Readiness is scored separately below. This is a first screen, not a
              determination.
            </p>
          </div>
        )}

        {started && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
            <div className="fmp-elig-summary fmp-elig-summary--possible" style={{ flex: "1 1 240px" }}>
              <p className="fmp-call-prepare-label">Business readiness</p>
              <p className="fmp-elig-summary-text">
                <strong>{readinessVerdict(businessScore)}</strong> — {businessScore} of{" "}
                {BUSINESS_ITEMS.length} checked
              </p>
            </div>
            <div className="fmp-elig-summary fmp-elig-summary--possible" style={{ flex: "1 1 240px" }}>
              <p className="fmp-call-prepare-label">Owner readiness</p>
              <p className="fmp-elig-summary-text">
                <strong>{readinessVerdict(ownerScore)}</strong> — {ownerScore} of{" "}
                {OWNER_ITEMS.length} checked
              </p>
            </div>
          </div>
        )}

        {started && (
          <p style={{ marginTop: 16 }}>
            <button
              type="button"
              className="fmp-btn fmp-btn-secondary"
              onClick={() => setChecked(FLAT.map(() => false))}
            >
              Clear the checklist
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
