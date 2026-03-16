"use client";

import Link from "next/link";
import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";

// Import styles from about page since we're using the same CSS classes
import "../about/about-page.css";

// Section components
import {
  HeroSection,
  ProblemSolutionSection,
  CrisesSection,
  SolutionsSection,
} from "./_components/sections";

export default function TheExitCrisisPage() {
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
        <CrisesSection />
        <SolutionsSection />
      </main>
    </div>
  );
}
