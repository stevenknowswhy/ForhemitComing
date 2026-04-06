"use client";

import { useState } from "react";

const MONEY_ITEMS = [
  {
    id: "cash",
    pct: "60\u201380%",
    title: "Cash at close",
    summary: "Lump sum wire on closing day",
    detail:
      "The bank funds a loan to the ESOP trust, which buys your shares. Most sellers receive 60\u201380% of the purchase price as a single wire transfer on closing day. No waiting, no conditions.",
  },
  {
    id: "note",
    pct: "20\u201340%",
    title: "Seller note (if any)",
    summary: "A percentage might have to be held until loan is fully repaid",
    detail:
      "In most deals, you carry a seller note \u2014 typically 20\u201340% of the price. This portion is held until the SBA loan is fully repaid. The terms are negotiated upfront and agreed before you sign the Letter of Intent. It is not sprung on you at closing.",
  },
  {
    id: "earnout",
    pct: "0%",
    title: "Earnouts",
    summary: "None. ESOP price is locked.",
    detail:
      "Unlike PE deals, an ESOP has no earnout. The price is locked at the Letter of Intent. No \u2018hit these revenue targets for the next 3 years\u2019 conditions. The independent appraiser sets the fair price, and that\u2019s what you receive.",
  },
  {
    id: "escrow",
    pct: "0%",
    title: "Escrow holdbacks",
    summary: "Typically none in ESOP deals",
    detail:
      "ESOP transactions typically don\u2019t require escrow holdbacks or reps-and-warranty insurance. The purchase price is the purchase price \u2014 no portion withheld for potential claims.",
  },
];

export function HowMoneyMovesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="fmp-money" className="fmp-section" aria-labelledby="fmp-money-heading">
      <h2 id="fmp-money-heading" className="fmp-section-title">
        How the money moves
      </h2>
      <p className="fmp-section-lead">
        Every seller wants to know: how much cash do I actually receive, and when?
        Here&apos;s the typical ESOP deal structure.
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
          <strong>No personal guarantees required from you.</strong> The loan is between the bank
          and the ESOP trust. Your personal assets are not collateral.
        </p>
      </div>
    </section>
  );
}
