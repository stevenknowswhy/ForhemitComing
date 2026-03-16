"use client";

import { FAQAccordion } from "../FAQAccordion";
import { faqSections } from "../../_data/faqs";

export function FAQSections() {
  return (
    <>
      {faqSections.map((section, index) => (
        <section
          key={section.title}
          className={`about-section ${index % 2 === 0 ? "about-section-alt" : ""}`}
        >
          <div className="container">
            <div className="faq-section-header">
              <span className="about-eyebrow">{section.eyebrow}</span>
              <h2 className="section-title">{section.title}</h2>
            </div>
            <FAQAccordion items={section.items} />
          </div>
        </section>
      ))}
    </>
  );
}
