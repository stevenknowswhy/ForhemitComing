"use client";

import { useEffect, useState } from "react";
import { useGlobalScrollReveal } from "@/hooks/useIntersectionObserver";
import "./brokers.css";

// Section components
import { HeroSection } from "./_components/sections/HeroSection";
import { DossierSection } from "./_components/sections/DossierSection";
import { DilemmaSection } from "./_components/sections/DilemmaSection";
import { DualTrackSection } from "./_components/sections/DualTrackSection";
import { ProcessSection } from "./_components/sections/ProcessSection";
import { PromiseSection } from "./_components/sections/PromiseSection";
import { CTASection } from "./_components/sections/CTASection";

export default function BrokersPage() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global scroll reveal
  useGlobalScrollReveal();

  return (
    <div className="brokers-wrapper">
      {/* Blueprint Grid Background */}
      <div className="brokers-bg">
        <div className="blueprint-grid" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
        <div className="gradient-overlay" />
      </div>

      <main className="brokers-main">
        <HeroSection />
        <DossierSection />
        <DilemmaSection />
        <DualTrackSection />
        <ProcessSection />
        <PromiseSection />
        <CTASection />
      </main>
    </div>
  );
}
