"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { galleryTheme } from "../lib/galleryData";

/**
 * About Header - Minimal header with company wordmark
 * Glassmorphism backdrop with fade on scroll/interaction
 */
export function AboutHeader() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Fade out header slightly when scrolling
  const opacity = useTransform(scrollY, [0, 100], [1, 0.6]);

  return (
    <motion.header
      className="about-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "56px",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(14, 14, 12, 0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${galleryTheme.colors.muted}20`,
        opacity: prefersReducedMotion ? 1 : opacity,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
    >
      <div
        className="about-header-inner"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link
          href="/"
          className="about-logo"
          style={{
            fontFamily: galleryTheme.fonts.heading,
            fontSize: "1.25rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: galleryTheme.colors.textPrimary,
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span
            style={{
              background: `linear-gradient(
                180deg,
                ${galleryTheme.colors.textPrimary} 0%,
                ${galleryTheme.colors.accentLight} 50%,
                ${galleryTheme.colors.textPrimary} 100%
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Forhemit
          </span>
        </Link>
      </div>
    </motion.header>
  );
}
