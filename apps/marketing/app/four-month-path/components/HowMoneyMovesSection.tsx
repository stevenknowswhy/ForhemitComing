"use client";

import { useState } from "react";

const MONEY_ITEMS = [
  {
    id: "price",
    pct: "FMV",
    title: "The price",
    summary: "Set by an independent appraiser",
    detail:
      "By an independent, qualified appraiser engaged for the transaction \u2014 never by Forhemit and never by you alone. The trustee reviews the valuation on behalf of employees and must conclude the price is no more than fair market value.",
  },
  {
    id: "fees",
    pct: "3\u20135%",
    title: "Our fee",
    summary: "Of valuation \u2014 Forhemit\u2019s fee only",
    detail:
      "Forhemit\u2019s fee typically runs 3\u20135% of valuation \u2014 set in a written fee document after independent valuation. It covers Forhemit\u2019s work running your transition. The independent professionals the transaction requires are engaged by you directly and paid by you directly, each after a written estimate you approve \u2014 their fees are not included in our 3\u20135%. The full cost picture is on our Pricing page.",
  },
  {
    id: "tax",
    pct: "\u00A71042",
    title: "The tax treatment",
    summary: "Deferral \u2014 never tax-free",
    detail:
      "When you sell to an ESOP, federal law may let you defer the capital gains tax on the sale. That provision is Section 1042. Deferral is not forgiveness, and it is not automatic \u2014 whether it fits your situation is settled with your own tax advisor, not on a website.",
  },
  {
    id: "guarantees",
    pct: "Standard",
    title: "Personal guarantees",
    summary: "No personal guarantees",
    detail:
      "Our standard is no personal guarantees \u2014 a term sheet demanding one is flagged as off-standard. The financing is structured to rest on the business itself, not on your house, your savings, or your family\u2019s security.",
  },
];

export function HowMoneyMovesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="fmp-money" className="fmp-section" aria-labelledby="fmp-money-heading">
      <h2 id="fmp-money-heading" className="fmp-section-title">
        The money, stated plainly
      </h2>
      <p className="fmp-section-lead">
        What we can state plainly is the price, the fee, and the tax treatment
        &mdash; each set in writing before you commit. How the proceeds
        themselves are structured is worked out in Month 2, with your own tax
        advisor.
      </p>
      <div className="fmp-money-grid">
        {MONEY_ITEMS.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`fmp-money-card${isOpen ? " fmp-money-card--open" : ""}`}
              onClick={() => setExpandedId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <div className="fmp-money-card-head">
                <span className="fmp-money-pct">{item.pct}</span>
                <span className="fmp-money-title">{item.title}</span>
                <span className="fmp-money-summary">{item.summary}</span>
              </div>
              {isOpen && <p className="fmp-money-detail">{item.detail}</p>}
            </button>
          );
        })}
      </div>
      <div className="fmp-money-note">
        <p>
          <strong>ESOP Fee Transparency.</strong> Our one-page fee document
          &mdash; every charge, who receives it, and when &mdash; is shared in
          full during the first assessment call, before you sign anything.
        </p>
      </div>
    </section>
  );
}
