"use client";

import { useGlobalScrollReveal } from "@forhemit/shared/hooks/useIntersectionObserver";
import "./about-page.css";

// Section components
import { HeroSection } from "./_components/sections/HeroSection";
import { MissionSection } from "./_components/sections/MissionSection";
import { TeamSection } from "./_components/sections/TeamSection";
import { EvolutionSection } from "./_components/sections/EvolutionSection";
import { WhyWeExistSection } from "./_components/sections/WhyWeExistSection";
import { PBCSection } from "./_components/sections/PBCSection";
import { FAQSection } from "./_components/sections/FAQSection";
import { CTASection } from "./_components/sections/CTASection";

export function AboutPageClient() {
  // Initialize scroll reveal animations
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <PBCSection />
        <MissionSection />
        <TeamSection />
        <EvolutionSection />
        <WhyWeExistSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}
