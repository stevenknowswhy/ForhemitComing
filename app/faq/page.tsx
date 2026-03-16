"use client";

import Link from "next/link";
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

      {/* Logo Header */}
      <header className="about-logo-header">
        <Link href="/" className="about-logo-link">
          <span className="about-logo-text">Forhemit</span>
          <span className="about-logo-underline"></span>
        </Link>
      </header>

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
