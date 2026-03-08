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

      {/* Footer */}
      <AboutFooter />

      {/* Keyboard Navigation Hint - Shows briefly on load */}
      <KeyboardHint />
    </div>
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
