"use client";

import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";

// Import styles from about page since we're using the same CSS classes
import "../about/about-page.css";

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
