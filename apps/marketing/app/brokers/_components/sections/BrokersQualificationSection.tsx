"use client";

import { useMemo, useState } from "react";
import { BROKER_QUALIFICATION_CRITERIA } from "../../constants";

export function BrokersQualificationSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const hasInteracted = count > 0;
  const total = BROKER_QUALIFICATION_CRITERIA.length;
  const gatesPass = count === total;

  let summaryText = "";
  let summaryClass = "";

  if (gatesPass) {
    summaryText =
      "Eligible on the qualification standard — all six hard gates are met. This is a first screen, not a determination.";
    summaryClass = "fmp-elig-summary--strong";
  } else if (hasInteracted) {
    summaryText = `Not currently eligible — ${count} of ${total} hard gates met, and a business must meet every one. Until every hard gate is met, readiness does not change the result; if a criterion is close, bring it to a first call.`;
    summaryClass = "fmp-elig-summary--explore";
  }

  return (
    <section id="brk-qualify" className="fmp-section" aria-labelledby="brk-qualify-heading">
      <h2 id="brk-qualify-heading" className="fmp-section-title">
        The qualification standard
      </h2>
      <p className="fmp-section-lead">
        The six qualification criteria are hard gates: a business must meet every one. Toggle
        what applies to the business you have in mind. For the full screen — the six gates
        plus the two readiness groups — use the 18-point check below.
      </p>
      <ul className="fmp-elig-list" role="group" aria-label="Qualification criteria">
        {BROKER_QUALIFICATION_CRITERIA.map((c) => (
          <li key={c.id} className="fmp-elig-item">
            <button
              type="button"
              className={`fmp-elig-btn${checked[c.id] ? " fmp-elig-btn--checked" : ""}`}
              onClick={() => toggleItem(c.id)}
              aria-pressed={!!checked[c.id]}
            >
              <span className="fmp-elig-check" aria-hidden>
                {checked[c.id] ? "✓" : ""}
              </span>
              <span className="fmp-elig-label">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {hasInteracted && (
        <div className={`fmp-elig-summary ${summaryClass}`} role="status" aria-live="polite">
          <p className="fmp-elig-summary-text">{summaryText}</p>
        </div>
      )}
    </section>
  );
}
