"use client";

import { useGlobalScrollReveal } from "@forhemit/shared/hooks/useIntersectionObserver";

// Import styles from about page since we're using the same CSS classes
import "../about/about-page.css";

// Section components
import {
  HeroSection,
  CrisesSection,
  ProblemSolutionSection,
  SolutionsSection,
} from "./_components/sections";
import { ClosingCheck } from "../blog/_components/ClosingCheck";

export function TheExitCrisisPageClient() {
  // Initialize scroll reveal animations
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <CrisesSection />
        <ProblemSolutionSection />
        <SolutionsSection />
        {/* Single closing action at the foot (ruling D2 A, 2026-11-27) */}
        <div className="container">
          <ClosingCheck />
        </div>
      </main>
    </div>
  );
}
