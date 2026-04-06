"use client";

import "./legal-practices.css";
import { useLegalPageAnimations } from "./_hooks/useLegalPageAnimations";

// Import section components
import { HeroSection } from "./_components/sections/HeroSection";
import { StatsSection } from "./_components/sections/StatsSection";
import { QuestionsSection } from "./_components/sections/QuestionsSection";
import { RiskSection } from "./_components/sections/RiskSection";
import { CostSection } from "./_components/sections/CostSection";
import { StewardshipSection } from "./_components/sections/StewardshipSection";
import { BenefitsSection } from "./_components/sections/BenefitsSection";
import { WhyDifferentSection } from "./_components/sections/WhyDifferentSection";
import { ProcessSection } from "./_components/sections/ProcessSection";
import { FitSection } from "./_components/sections/FitSection";
import { FAQSection } from "./_components/sections/FAQSection";
import { UrgencySection } from "./_components/sections/UrgencySection";
import { CTASection } from "./_components/sections/CTASection";

export default function LegalPractices() {
  // Initialize page animations
  useLegalPageAnimations();

  return (
    <div className="legal-wrapper">
      <div className="legal-background"></div>

      <main className="legal-main">
        <HeroSection />
        <StatsSection />
        <QuestionsSection />
        <RiskSection />
        <CostSection />
        <StewardshipSection />
        <BenefitsSection />
        <WhyDifferentSection />
        <ProcessSection />
        <FitSection />
        <FAQSection />
        <UrgencySection />
        <CTASection />
      </main>
    </div>
  );
}
