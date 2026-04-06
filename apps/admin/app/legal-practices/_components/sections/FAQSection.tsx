"use client";

import { useState } from "react";
import { FAQItem } from "@/components/ui/FAQItem";
import { legalFaqs } from "../../_data/faqs";

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <section className="legal-section faq-section">
      <div className="container">
        <h2 data-animate="fade-up">Common questions from firms like yours</h2>

        <div className="faq-list" data-animate="fade-up">
          {legalFaqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === i}
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              index={i}
              variant="legal"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
