"use client";

import { useState } from "react";

const AFTER_ITEMS = [
  {
    id: "advisory",
    title: "Advisory period",
    summary: "6\u201312 months, flexible hours",
    detail:
      "You help the team learn the ropes \u2014 typically 10\u201315 hours per week, declining over time. Compensation for the advisory period is negotiated as part of the deal, not an afterthought.",
  },
  {
    id: "noncompete",
    title: "Non-compete",
    summary: "Typically 1\u20132 years, limited scope",
    detail:
      "Standard ESOP non-competes are limited to your industry and geography. Terms are negotiable and transparent \u2014 we help you understand every restriction before you sign.",
  },
  {
    id: "employees",
    title: "Employee impact",
    summary: "Same roles, same pay, same benefits",
    detail:
      "On closing day, your employees\u2019 jobs don\u2019t change. They keep the same roles, pay, and benefits. The ownership transition happens in the background through the trust structure.",
  },
  {
    id: "freedom",
    title: "Your freedom",
    summary: "After advisory, you\u2019re fully free",
    detail:
      "No board seat requirements, no continued obligations. Many sellers consult, travel, or start something new. The business is designed to run without you \u2014 that\u2019s what Month 3 proves.",
  },
];

export function AfterCloseSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="fmp-after-close" className="fmp-section" aria-labelledby="fmp-after-heading">
      <h2 id="fmp-after-heading" className="fmp-section-title">
        After you close
      </h2>
      <p className="fmp-section-lead">
        The deal is done. Here&apos;s what life actually looks like.
      </p>
      <div className="fmp-after-grid">
        {AFTER_ITEMS.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div key={item.id} className="fmp-after-shell">
              <div className="fmp-after-shell__glow" aria-hidden />
              <button
                type="button"
                className={`fmp-after-card${isOpen ? " fmp-after-card--open" : ""}`}
                onClick={() => setExpandedId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
              >
                <div className="fmp-after-card-head">
                  <h3 className="fmp-after-title">{item.title}</h3>
                  <span className="fmp-after-summary">{item.summary}</span>
                  <span className="fmp-after-chevron" aria-hidden>
                    {isOpen ? "\u2212" : "+"}
                  </span>
                </div>
                {isOpen && <p className="fmp-after-detail">{item.detail}</p>}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
