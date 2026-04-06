"use client";

import { useMemo, useState } from "react";
import { BROKER_QUALIFICATION_CRITERIA } from "../../constants";

export function BrokersQualificationSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const hasInteracted = count > 0;

  let summaryText = "";
  let summaryClass = "";

  if (count >= 5) {
    summaryText = `This listing matches ${count} of ${BROKER_QUALIFICATION_CRITERIA.length} signals—usually a strong dual-track candidate.`;
    summaryClass = "fmp-elig-summary--strong";
  } else if (count >= 3) {
    summaryText = `${count} of ${BROKER_QUALIFICATION_CRITERIA.length} match—worth a confidential call to size the ESOP path.`;
    summaryClass = "fmp-elig-summary--possible";
  } else if (hasInteracted) {
    summaryText = `${count} of ${BROKER_QUALIFICATION_CRITERIA.length} match—may still work; we can narrow quickly on a short call.`;
    summaryClass = "fmp-elig-summary--explore";
  }

  return (
    <section id="brk-qualify" className="fmp-section" aria-labelledby="brk-qualify-heading">
      <h2 id="brk-qualify-heading" className="fmp-section-title">
        Listings that fit dual-track best
      </h2>
      <p className="fmp-section-lead">
        Toggle what applies to the business you have in mind. These are practical signals for SBA-style ESOP
        financing and a ~90–120 day execution—not a legal test.
      </p>
      <ul className="fmp-elig-list" role="group" aria-label="Qualification signals">
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
