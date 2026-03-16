"use client";

import { useState } from "react";
import { visionFaqs, financialsFaqs, operationalFaqs, legacyFaqs } from "../../_data/faqs";

interface AboutFAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AboutFAQItem({ question, answer, isOpen, onClick }: AboutFAQItemProps) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className={`faq-question ${isOpen ? "active" : ""}`} onClick={onClick}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
        <div className="faq-answer-content">{answer}</div>
      </div>
    </div>
  );
}

interface FAQSectionBlockProps {
  title: string;
  subtitle: string;
  sectionNum: string;
  faqs: { question: string; answer: React.ReactNode }[];
  openFaq: string | null;
  onToggle: (id: string) => void;
  sectionPrefix: string;
}

function FAQSectionBlock({
  title,
  subtitle,
  sectionNum,
  faqs,
  openFaq,
  onToggle,
  sectionPrefix,
}: FAQSectionBlockProps) {
  return (
    <div className="faq-section">
      <h3 className="faq-section-title">
        <span className="section-num">{sectionNum}</span>
        {title}
        <span className="section-subtitle">{subtitle}</span>
      </h3>

      {faqs.map((faq, index) => {
        const id = `${sectionPrefix}-${index}`;
        return (
          <AboutFAQItem
            key={id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFaq === id}
            onClick={() => onToggle(id)}
          />
        );
      })}
    </div>
  );
}

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<string | null>("vision-0");

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="about-section about-section-faq">
      <div className="container">
        <div className="faq-header">
          <span className="about-eyebrow">Common Questions</span>
          <h2>Understanding the Forhemit Model</h2>
          <p className="faq-intro">
            The transition to employee ownership is a significant decision. Here are answers to the
            questions owners ask most.
          </p>
        </div>

        <div className="faq-container">
          <FAQSectionBlock
            title="The Vision & The Model"
            subtitle=""
            sectionNum="01"
            faqs={visionFaqs}
            openFaq={openFaq}
            onToggle={toggleFaq}
            sectionPrefix="vision"
          />

          <FAQSectionBlock
            title="Financials & Risk Mitigation"
            subtitle=""
            sectionNum="02"
            faqs={financialsFaqs}
            openFaq={openFaq}
            onToggle={toggleFaq}
            sectionPrefix="financials"
          />

          <FAQSectionBlock
            title="Operational Resilience"
            subtitle=""
            sectionNum="03"
            faqs={operationalFaqs}
            openFaq={openFaq}
            onToggle={toggleFaq}
            sectionPrefix="operational"
          />

          <FAQSectionBlock
            title="Legacy & The Transition"
            subtitle=""
            sectionNum="04"
            faqs={legacyFaqs}
            openFaq={openFaq}
            onToggle={toggleFaq}
            sectionPrefix="legacy"
          />
        </div>
      </div>
    </section>
  );
}
