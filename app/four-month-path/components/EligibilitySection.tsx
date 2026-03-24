"use client";

import { useState, useMemo } from "react";

const CRITERIA = [
  { id: "revenue", label: "Annual revenue of $3M or more" },
  { id: "employees", label: "At least 20 full-time employees" },
  { id: "profitable", label: "Profitable for the last 2–3 years" },
  { id: "ownership", label: "You own 51% or more of the company" },
  { id: "operable", label: "Business can operate without you (or you're willing to transition)" },
  { id: "entity", label: "Structured as a corporation (C-Corp or S-Corp)" },
  { id: "advisory", label: "You're open to staying on 6–12 months as an advisor" },
];

export function EligibilitySection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const hasInteracted = count > 0;

  let summaryText = "";
  let summaryClass = "";

  if (count >= 5) {
    summaryText = `You match ${count} of ${CRITERIA.length} — your business is likely a strong ESOP candidate.`;
    summaryClass = "fmp-elig-summary--strong";
  } else if (count >= 3) {
    summaryText = `You match ${count} of ${CRITERIA.length} — worth a conversation to explore further.`;
    summaryClass = "fmp-elig-summary--possible";
  } else if (hasInteracted) {
    summaryText = `You match ${count} of ${CRITERIA.length} — an ESOP may still work, but let\u2019s talk through the details.`;
    summaryClass = "fmp-elig-summary--explore";
  }

  return (
    <section id="fmp-eligibility" className="fmp-section" aria-labelledby="fmp-elig-heading">
      <h2 id="fmp-elig-heading" className="fmp-section-title">
        Is this the right fit?
      </h2>
      <p className="fmp-section-lead">
        Not every business is a good ESOP candidate. Check the items that apply to your situation.
      </p>
      <ul className="fmp-elig-list" role="group" aria-label="Eligibility criteria">
        {CRITERIA.map((c) => (
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
