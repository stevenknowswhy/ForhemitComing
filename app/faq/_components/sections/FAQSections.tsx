"use client";

import { FAQAccordion } from "../FAQAccordion";
import { faqSections } from "../../_data/faqs";

export function FAQSections() {
  return (
    <section className="about-section about-section-alt">
      <div className="container">
        <div className="faq-three-column-grid">
          {faqSections.map((section) => (
            <div key={section.title} className="faq-column">
              <div className="faq-column-header">
                <span className="about-eyebrow">{section.eyebrow}</span>
                <h2 className="faq-column-title">{section.title}</h2>
              </div>
              <FAQAccordion items={section.items} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
