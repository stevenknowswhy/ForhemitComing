"use client";

import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";
import "./about-page.css";

// Section components
import { HeroSection } from "./_components/sections/HeroSection";
import { MissionSection } from "./_components/sections/MissionSection";
import { WhyWeExistSection } from "./_components/sections/WhyWeExistSection";
import { PBCSection } from "./_components/sections/PBCSection";
import { FAQSection } from "./_components/sections/FAQSection";
import { CTASection } from "./_components/sections/CTASection";

export default function AboutPage() {
  // Initialize scroll reveal animations
  useGlobalScrollReveal();

  return (
    <div className="about-wrapper">
      <div className="about-background"></div>

      <main className="about-main">
        <HeroSection />
        <PBCSection />
        <MissionSection />
        <WhyWeExistSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}
