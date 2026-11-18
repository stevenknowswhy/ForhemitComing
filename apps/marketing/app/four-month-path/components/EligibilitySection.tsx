"use client";

import { useState, useMemo } from "react";

const CRITERIA = [
  { id: "founder", label: "Founder-led, and operating for at least 3 years" },
  { id: "revenue", label: "Annual revenue of $3M or more" },
  { id: "employees", label: "20 or more verifiable U.S. employees — on U.S. payroll (W-2), not contractors or overseas staff" },
  { id: "profitable", label: "Profitable for 3 years or more" },
  { id: "ownership", label: "You own 51% or more of the company" },
  { id: "availability", label: "You can be available for 4 to 12 months after close — on call, not working hands-on" },
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
  const meetsAll = count === CRITERIA.length;

  let summaryText = "";
  let summaryClass = "";

  if (meetsAll) {
    summaryText = `You meet all ${CRITERIA.length} — the same standard the free assessment applies to your numbers.`;
    summaryClass = "fmp-elig-summary--strong";
  } else if (count >= 3) {
    summaryText = `You match ${count} of ${CRITERIA.length} — every one of the six is required, so the honest next step is the free assessment, which names exactly what would have to change.`;
    summaryClass = "fmp-elig-summary--possible";
  } else if (hasInteracted) {
    summaryText = `You match ${count} of ${CRITERIA.length} — every one of the six is required. The free assessment applies the same six to your numbers and tells you directly where you stand.`;
    summaryClass = "fmp-elig-summary--explore";
  }

  return (
    <section id="fmp-eligibility" className="fmp-section" aria-labelledby="fmp-elig-heading">
      <h2 id="fmp-elig-heading" className="fmp-section-title">
        Is this the right fit?
      </h2>
      <p className="fmp-section-lead">
        The standard is six criteria, and a business must meet every one.
        Check the items that apply to your situation.
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
