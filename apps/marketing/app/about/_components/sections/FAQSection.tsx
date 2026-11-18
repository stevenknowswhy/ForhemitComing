"use client";

import { useFaqToggle } from "@forhemit/shared/hooks/useFaqToggle";
import { aboutFaqs } from "../../_data/faqs";

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

export function FAQSection() {
  const [openFaq, toggleFaq] = useFaqToggle<string>("faq-0");

  return (
    <section className="about-section about-section-faq">
      <div className="container">
        <div className="faq-header">
          <span className="about-eyebrow">Common Questions</span>
          <h2>Asked by founders, answered straight.</h2>
          <p className="faq-intro">
            The transition to employee ownership is a significant decision. Here are answers to the
            questions owners ask most.
          </p>
        </div>

        <div className="faq-container">
          <div className="faq-section">
            {aboutFaqs.map((faq, index) => {
              const id = `faq-${index}`;
              return (
                <AboutFAQItem
                  key={id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === id}
                  onClick={() => toggleFaq(id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
