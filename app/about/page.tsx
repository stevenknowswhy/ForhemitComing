"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AboutHeader,
  AboutFooter,
  GalleryContainer,
  ProgressIndicator,
} from "./components";
import { gallerySlides } from "./lib";
import "./gallery-page.css";

/**
 * About Page - Full-screen interactive gallery
 * Premium gallery experience with swipe, drag, and keyboard navigation
 */
export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Handle slide changes from progress indicator
  const handleSlideSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Update current index when gallery changes
  const handleGalleryChange = useCallback((index: number) => {
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
          <GalleryContainer slides={gallerySlides} />

          {/* Progress Indicator */}
          <ProgressIndicator
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
        bottom: "110px",
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
