"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AboutHeader,
  AboutFooter,
  GalleryContainer,
} from "./components";
import { gallerySlides, galleryTheme } from "./lib";
import "./gallery-page.css";

// PDF data for each slide
const slidePDFs = [
  { title: "The COOP Standard for Business Continuity", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
  { title: "Our PBC Charter & Social Impact Framework", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
  { title: "The AI Perfect Storm: Why Ownership is the Ultimate Hedge", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
  { title: "The Investor Thesis: Resilience as an Asset Class", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
  { title: "The Employee Ownership Transition Framework", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
  { title: "The Continuity Pledge: Our Commitment to Community", url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" },
];

/**
 * About Page - Full-screen interactive gallery
 * Premium gallery experience with swipe, drag, and keyboard navigation
 */
export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleSlideSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="about-gallery-wrapper">
      {/* Background Effects */}
      <div className="gallery-background">
        <div className="gallery-gradient-mesh" />
        <div className="gallery-noise-overlay" />
      </div>

      {/* Header */}
      <AboutHeader />

      {/* Main Gallery */}
      <main
        className="gallery-main"
        role="main"
        aria-label="About Forhemit - Interactive Story Gallery"
      >
        <motion.div
          className="gallery-viewport"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, delay: 0.2 }
          }
        >
          <GalleryContainer 
            slides={gallerySlides} 
            currentIndex={currentIndex}
            onSlideChange={setCurrentIndex}
          />
          
          {/* Navigation Dots - Fixed under image area */}
          <SlideDots
            total={gallerySlides.length}
            current={currentIndex}
            onSelect={handleSlideSelect}
          />
        </motion.div>
      </main>

      {/* CTA Link Row - Above Footer */}
      <div
        style={{
          position: "fixed",
          bottom: "50px",
          left: 0,
          right: 0,
          zIndex: 35,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3rem",
        }}
      >
        <a
          href="/introduction?join=true"
          className="nav-link"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--muted-text)",
            textDecoration: "none",
            transition: "filter 0.4s ease, transform 0.4s ease",
            position: "relative",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.15)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Instant Offer
        </a>
        <a
          href="/introduction?contact=true"
          className="nav-link"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--muted-text)",
            textDecoration: "none",
            transition: "filter 0.4s ease, transform 0.4s ease",
            position: "relative",
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.15)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Contact Us
        </a>
      </div>

      {/* PDF Download Button - Outside gallery, based on current slide */}
      <PDFDownloadButton currentIndex={currentIndex} />

      {/* Footer */}
      <AboutFooter />

      {/* Keyboard Navigation Hint - Shows briefly on load */}
      <KeyboardHint />
    </div>
  );
}

/**
 * PDF Download Button - Displays based on current slide, positioned outside gallery
 */
function PDFDownloadButton({ currentIndex }: { currentIndex: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const pdf = slidePDFs[currentIndex];

  if (!pdf) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentIndex}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        bottom: "90px",
        right: "2rem",
        zIndex: 40,
      }}
    >
      <button
        onClick={() => window.open(pdf.url, "_blank")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          fontFamily: galleryTheme.fonts.mono,
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isHovered ? "#ffffff" : galleryTheme.colors.textPrimary,
          background: isHovered
            ? `linear-gradient(135deg, ${galleryTheme.colors.accent} 0%, ${galleryTheme.colors.accentLight} 100%)`
            : `linear-gradient(135deg, ${galleryTheme.colors.muted}30 0%, ${galleryTheme.colors.muted}20 100%)`,
          border: `1px solid ${isHovered ? galleryTheme.colors.accent : galleryTheme.colors.muted}40`,
          borderRadius: "8px",
          padding: "0.75rem 1.25rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          boxShadow: isHovered
            ? `0 4px 20px rgba(255, 107, 0, 0.3)`
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2v4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Download PDF</span>
      </button>
    </motion.div>
  );
}

/**
 * Keyboard navigation hint - fades out after a few seconds
 */
function KeyboardHint() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="keyboard-hint"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { delay: 1, duration: 0.5 }}
      style={{
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 35,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        background: "rgba(14, 14, 12, 0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: "8px",
        border: "1px solid rgba(139, 90, 43, 0.3)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "#a09a90",
          textTransform: "uppercase",
        }}
      >
        Use{" "}
        <kbd
          style={{
            padding: "0.25rem 0.5rem",
            background: "rgba(139, 90, 43, 0.3)",
            borderRadius: "4px",
            color: "#f5f0e8",
            fontFamily: "inherit",
          }}
        >
          ←
        </kbd>
        <kbd
          style={{
            padding: "0.25rem 0.5rem",
            background: "rgba(139, 90, 43, 0.3)",
            borderRadius: "4px",
            color: "#f5f0e8",
            fontFamily: "inherit",
            marginLeft: "0.25rem",
          }}
        >
          →
        </kbd>{" "}
        to navigate
      </span>
    </motion.div>
  );
}

/**
 * Slide Dots Component - Fixed navigation dots under image
 */
function SlideDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "42%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 25,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        background: "rgba(14, 14, 12, 0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: "20px",
        border: `1px solid ${galleryTheme.colors.muted}30`,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === current ? "true" : undefined}
          style={{
            width: index === current ? "24px" : "8px",
            height: "8px",
            borderRadius: "4px",
            background:
              index === current
                ? galleryTheme.colors.accent
                : `${galleryTheme.colors.muted}80`,
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s ease",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            if (index !== current) {
              e.currentTarget.style.background = galleryTheme.colors.accentLight;
            }
          }}
          onMouseLeave={(e) => {
            if (index !== current) {
              e.currentTarget.style.background = `${galleryTheme.colors.muted}80`;
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${galleryTheme.colors.accent}60`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      ))}
    </div>
  );
}
