"use client";

import { useState, useMemo } from "react";

const TAX_CRITERIA = [
  { id: "ccorp", label: "Company is (or can convert to) a C-Corporation" },
  { id: "pct30", label: "ESOP buys at least 30% of outstanding shares" },
  { id: "held3yr", label: "You\u2019ve held the stock for at least 3 years" },
  { id: "qrp", label: "You\u2019ll reinvest proceeds in Qualified Replacement Property (QRP) within 12 months" },
  { id: "filing", label: "You file the \u00A71042 election with your tax return for the year of sale" },
];

export function TaxChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const allChecked = count === TAX_CRITERIA.length;
  const hasInteracted = count > 0;

  return (
    <section id="fmp-1042" className="fmp-section" aria-labelledby="fmp-1042-heading">
      <h2 id="fmp-1042-heading" className="fmp-section-title">
        &sect;1042 tax election &mdash; are you eligible?
      </h2>
      <p className="fmp-section-lead">
        The &sect;1042 election lets you defer <strong>100% of capital gains tax</strong> on the sale.
        It has specific requirements &mdash; check the ones that apply.
      </p>
      <ul className="fmp-elig-list" role="group" aria-label="§1042 eligibility criteria">
        {TAX_CRITERIA.map((c) => (
          <li key={c.id} className="fmp-elig-item">
            <button
              type="button"
              className={`fmp-elig-btn${checked[c.id] ? " fmp-elig-btn--checked" : ""}`}
              onClick={() => toggle(c.id)}
              aria-pressed={!!checked[c.id]}
            >
              <span className="fmp-elig-check" aria-hidden>
                {checked[c.id] ? "\u2713" : ""}
              </span>
              <span className="fmp-elig-label">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {hasInteracted && (
        <div
          className={`fmp-elig-summary${allChecked ? " fmp-elig-summary--strong" : ""}`}
          role="status"
          aria-live="polite"
        >
          <p className="fmp-elig-summary-text">
            {allChecked
              ? "You likely qualify for \u00A71042 \u2014 your CPA confirms eligibility during Month 1."
              : `You meet ${count} of ${TAX_CRITERIA.length} requirements. If you don\u2019t qualify for \u00A71042, you still benefit from ESOP pricing \u2014 you\u2019d just pay capital gains tax normally. Your CPA confirms eligibility during Month 1.`}
          </p>
        </div>
      )}
    </section>
  );
}
