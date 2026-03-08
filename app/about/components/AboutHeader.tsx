"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";

/**
 * About Header - Minimal header with company wordmark
 * Matches home page styling with silver gradient and underline hover effect
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
        justifyContent: "flex-start",
        background: "rgba(14, 14, 12, 0.7)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(90, 84, 74, 0.2)",
        opacity: prefersReducedMotion ? 1 : opacity,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href="/"
        className="about-logo"
        style={{
          fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textDecoration: "none",
          textTransform: "uppercase",
          position: "relative",
          transition: "color 0.3s ease",
        }}
      >
        <span
          style={{
            background: "linear-gradient(180deg, #909090 0%, #e0e0e0 25%, #ffffff 50%, #c0c0c0 75%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            transition: "filter 0.4s ease, transform 0.4s ease",
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
          Forhemit
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: 0,
            height: "1px",
            background: "var(--primary-orange)",
            transition: "width 0.3s ease",
          }}
          className="logo-underline"
        />
      </Link>
    </motion.header>
  );
}
