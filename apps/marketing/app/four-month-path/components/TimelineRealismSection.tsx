"use client";

import { useState } from "react";

export type TimelineFaqItem = {
  id: string;
  q: string;
  a: string;
};

const DEFAULT_FAQ_ITEMS: TimelineFaqItem[] = [
  {
    id: "realistic",
    q: "Is four months really realistic?",
    a: "Yes, for well-prepared businesses. The median ESOP closes in 90\u2013150 days once engaged. The biggest factor is how quickly you can provide clean financials. If your books are audited or review-quality, we can often hit 90 days.",
  },
  {
    id: "delays",
    q: "What typically causes delays?",
    a: "Three things: messy financials (add 2\u20134 weeks), lender underwriting questions (add 2\u20133 weeks), and owner indecision on deal terms (variable). We front-load the financial review to catch problems in Month 1, not Month 3.",
  },
  {
    id: "bank-no",
    q: "What if the bank says no?",
    a: "We pre-qualify the deal before Month 1 formally starts. If a lender declines, we have relationships with multiple ESOP-experienced banks and can pivot quickly. If no lender will fund the deal, we\u2019ll tell you \u2014 that\u2019s information worth having, even if it\u2019s not the answer you wanted.",
  },
  {
    id: "dual-track",
    q: "Can I run a PE process at the same time?",
    a: "Absolutely. Many owners do. An ESOP in your back pocket is insurance: if a private buyer walks at the eleventh hour, your ESOP closing is already funded and ready. We coordinate the timelines so they don\u2019t conflict.",
  },
];

type Props = {
  sectionId?: string;
  headingId?: string;
  title?: string;
  lead?: string;
  faqItems?: TimelineFaqItem[];
  faqBodyIdPrefix?: string;
};

export function TimelineRealismSection({
  sectionId = "fmp-realism",
  headingId = "fmp-realism-heading",
  title = "What to realistically expect",
  lead = "Four months is our target, not a guarantee. Here are the questions owners ask most.",
  faqItems = DEFAULT_FAQ_ITEMS,
  faqBodyIdPrefix = "fmp-faq-body",
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id={sectionId} className="fmp-section" aria-labelledby={headingId}>
      <h2 id={headingId} className="fmp-section-title">
        {title}
      </h2>
      <p className="fmp-section-lead">{lead}</p>
      <div className="fmp-faq-list">
        {faqItems.map((item) => {
          const isOpen = openId === item.id;
          const bodyId = `${faqBodyIdPrefix}-${item.id}`;
          return (
            <div key={item.id} className={`fmp-faq-item${isOpen ? " fmp-faq-item--open" : ""}`}>
              <button
                type="button"
                className="fmp-faq-trigger"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={bodyId}
              >
                <span className="fmp-faq-q">{item.q}</span>
                <span className="fmp-faq-chevron" aria-hidden>
                  {isOpen ? "\u2212" : "+"}
                </span>
              </button>
              {isOpen && (
                <div id={bodyId} className="fmp-faq-body" role="region">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
