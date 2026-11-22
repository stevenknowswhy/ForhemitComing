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
    q: "Is 120 days really realistic?",
    a: "120 days from Documents-Ready is the plan \u2014 the clock starts when your documents are complete and accepted, not when you first talk to us. A traditional sale commonly takes 12\u201318 months; this path is deliberately shorter, because the buyer is already inside the building and the structure is decided before the clock starts, not negotiated while it runs.",
  },
  {
    id: "delays",
    q: "What can stretch it?",
    a: "The plan depends on things no advisor fully controls: how quickly a lender moves, the trustee\u2019s independent review, and how fast decisions and documents come back on your side.",
  },
  {
    id: "fit",
    q: "What if the fit is wrong?",
    a: "We start by understanding the business you have built \u2014 its financials, its people, its culture, and what you want the next chapter to look like. If the fit is wrong, we say so now, not in month three, and stopping here costs you nothing but the conversation.",
  },
  {
    id: "slips",
    q: "What happens if the timeline slips?",
    a: "If the timeline stretches, you hear it from us first, with the reason and the new date. What we will not do is protect the 120-day headline by cutting a step the law requires.",
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
  lead = "120 days from Documents-Ready is our target, not a guarantee. Here are the questions owners ask most.",
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
              <div
                key={`${bodyId}-${isOpen ? "open" : "closed"}`}
                id={bodyId}
                className="fmp-faq-body"
                role="region"
                hidden={!isOpen}
              >
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
