"use client";

import { useState, useRef, useEffect } from "react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  index?: number;
  variant?: "default" | "legal" | "wealth";
}

export function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  index = 0,
  variant = "default",
}: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const baseClasses = {
    default: "faq-item",
    legal: "faq-item",
    wealth: "faq-item",
  };

  return (
    <div
      className={`${baseClasses[variant]} ${isOpen ? "open" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <button className="faq-question" onClick={onClick}>
        <span>{question}</span>
        <span className="faq-icon">
          {variant === "legal" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" className="faq-plus" />
              <path d="M5 12h14" className="faq-minus" />
            </svg>
          ) : (
            <span>{isOpen ? "−" : "+"}</span>
          )}
        </span>
      </button>
      <div
        className="faq-answer-wrapper"
        style={{ height: variant === "legal" ? height : undefined }}
      >
        <div
          ref={contentRef}
          className="faq-answer"
          style={{ height: variant !== "legal" ? height : undefined }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}
