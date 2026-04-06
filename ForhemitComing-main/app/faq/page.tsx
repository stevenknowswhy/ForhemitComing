"use client";

import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";
import "../about/about-page.css";
import "./faq-page.css";

import {
  HeroSection,
  IntroSection,
  ComparisonSection,
  FAQSections,
  ValuePropositionsSection,
  CTASection,
} from "./_components/sections";

export default function FAQPage() {
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <IntroSection />
        <ComparisonSection />
        <FAQSections />
        <ValuePropositionsSection />
        <CTASection />
      </main>
    </div>
  );
}
