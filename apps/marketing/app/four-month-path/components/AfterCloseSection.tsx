"use client";

import { useState } from "react";

const AFTER_ITEMS = [
  {
    id: "transition",
    title: "Your transition period",
    summary: "4\u201312 months, on call \u2014 agreed in writing",
    detail:
      "You are available for a transition period of 4 to 12 months after close, on call in a role agreed in writing before closing: reachable for agreed check-ins, introductions, and questions as the new owners settle in, not working hands-on \u2014 lending the transition your credibility.",
  },
  {
    id: "monitoring",
    title: "Monitoring for 24 months",
    summary: "Warning indicators agreed with you up front",
    detail:
      "For 24 months after close the company is monitored against warning indicators agreed with you up front, reported on a schedule agreed with you \u2014 so problems surface while they are still small enough to fix. The company you built keeps being cared for.",
  },
  {
    id: "employees",
    title: "Employee impact",
    summary: "Shares in the company, held in the ESOP trust",
    detail:
      "Your employees receive shares in the company, held in the ESOP trust and allocated to their individual accounts over time, on top of their regular pay. They do not buy in and they do not take on the company\u2019s debts. As the company performs and the acquisition financing is repaid, the value of what they hold grows.",
  },
  {
    id: "after",
    title: "After the transition period",
    summary: "The shape of your involvement is yours to choose",
    detail:
      "This commitment is part of the standard, not an imposition: employees believe in the change because you visibly stand behind it. After that period, the shape of your involvement is yours to choose.",
  },
];

export function AfterCloseSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="fmp-after-close" className="fmp-section" aria-labelledby="fmp-after-heading">
      <h2 id="fmp-after-heading" className="fmp-section-title">
        After the close
      </h2>
      <p className="fmp-section-lead">
        Your transition period, and after. Most advisors disappear at
        closing; Forhemit stays &mdash; that is the product.
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
