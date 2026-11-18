"use client";

import { useGlobalScrollReveal } from "@forhemit/shared/hooks/useIntersectionObserver";
import "../about/about-page.css";
import "@forhemit/shared/styles/faq-page.css";

import {
  HeroSection,
  FAQSections,
  CTASection,
} from "./_components/sections";

export function FAQPageClient() {
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <FAQSections />
        <CTASection />
      </main>
    </div>
  );
}
