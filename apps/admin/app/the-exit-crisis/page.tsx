"use client";

import { useGlobalScrollReveal } from "@forhemit/shared/hooks/useIntersectionObserver";

// Shared stylesheet inherited from the admin /about page, which moved to apps/marketing
import "@forhemit/shared/styles/about-page.css";

// Section components
import {
  HeroSection,
  CrisesSection,
  TheComingDisasterSection,
  ProblemSolutionSection,
  SolutionsSection,
} from "./_components/sections";

export default function TheExitCrisisPage() {
  // Initialize scroll reveal animations
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <CrisesSection />
        <TheComingDisasterSection />
        <ProblemSolutionSection />
        <SolutionsSection />
      </main>
    </div>
  );
}
