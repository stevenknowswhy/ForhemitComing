"use client";

import Link from "next/link";
import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";
import "./about-page.css";

// Section components
import { HeroSection } from "./_components/sections/HeroSection";
import { ProblemSolutionSection } from "./_components/sections/ProblemSolutionSection";
import { MissionSection } from "./_components/sections/MissionSection";
import { CrisesSection } from "./_components/sections/CrisesSection";
import { SolutionsSection } from "./_components/sections/SolutionsSection";
import { PBCSection } from "./_components/sections/PBCSection";
import { FAQSection } from "./_components/sections/FAQSection";
import { CTASection } from "./_components/sections/CTASection";

export default function AboutPage() {
  // Initialize scroll reveal animations
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
        <ProblemSolutionSection />
        <MissionSection />
        <CrisesSection />
        <SolutionsSection />
        <PBCSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}
