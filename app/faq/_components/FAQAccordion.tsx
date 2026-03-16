"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-accordion">
      {items.map((item, index) => (
        <div key={index} className={`faq-accordion-item ${openIndex === index ? "open" : ""}`}>
          <button
            className="faq-accordion-question"
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <span className="faq-accordion-icon">{openIndex === index ? "−" : "+"}</span>
          </button>
          <div
            className="faq-accordion-answer"
            style={{
              maxHeight: openIndex === index ? "500px" : "0",
              opacity: openIndex === index ? 1 : 0,
            }}
          >
            <div className="faq-accordion-content">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
