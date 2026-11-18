"use client";

import { useState, useMemo } from "react";

const TAX_CRITERIA = [
  { id: "ccorp", label: "Your company is a closely held C corporation. S corporation stock does not qualify under current law." },
  { id: "pct30", label: "The ESOP owns at least 30% of the company immediately after the sale. Every Forhemit transition is 100%, so this condition is met by design." },
  { id: "held3yr", label: "You have held your stock for at least three years." },
  { id: "qrp", label: "You reinvest the proceeds within the window, which opens three months before the sale and closes twelve months after it." },
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
        &sect;1042 eligibility &mdash; the four conditions
      </h2>
      <p className="fmp-section-lead">
        When you sell to an ESOP, federal law may let you defer the capital
        gains tax on the sale. Deferral is not forgiveness, and it is not
        automatic &mdash; it applies only when every one of these holds.
        Check the ones that apply.
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
              ? "Every condition holds on your answers. Whether Section 1042 fits your situation is settled with your own tax advisor in Month 2, not on a website."
              : `You meet ${count} of ${TAX_CRITERIA.length} conditions. Section 1042 applies only when every one of them holds \u2014 your own tax advisor settles the question in Month 2.`}
          </p>
        </div>
      )}
      <p className="fmp-section-lead">
        What we will never call it is tax-free.
      </p>
    </section>
  );
}
