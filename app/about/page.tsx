"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AboutHeader,
  AboutFooter,
  GalleryContainer,
} from "./components";
import { gallerySlides, galleryTheme } from "./lib";
import "./gallery-page.css";

// PDF data for each slide - matches gallery titles
const slidePDFs = [
  { 
    cardTitle: "The Next Chapter",
    buttonText: "More about us",
    url: "#" 
  },
  { 
    cardTitle: "From Disaster Response to Business Resilience",
    buttonText: "The COOP Standard for Business Continuity",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
  { 
    cardTitle: "The Public Benefit Mandate",
    buttonText: "Our PBC Charter & Social Impact Framework",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
  { 
    cardTitle: "The AI Shield: Ownership as Defense",
    buttonText: "The AI Perfect Storm: Why Ownership is the Ultimate Hedge",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
  { 
    cardTitle: "For Investors: The Stewardship Alpha",
    buttonText: "The Investor Thesis: Resilience as an Asset Class",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
  { 
    cardTitle: "For Employees: The IKEA Effect of Equity",
    buttonText: "The Employee Ownership Transition Framework",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
  { 
    cardTitle: "For Community: The Continuity Pledge",
    buttonText: "The Continuity Pledge: Our Commitment to Community",
    url: "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdj8XYzeLAZPcI2XFHu8ORonq6MaQyfrGUBxS" 
  },
];

/**
 * About Page - Full-screen interactive gallery
 * Premium gallery experience with swipe, drag, and keyboard navigation
 */
export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="about-gallery-wrapper">
      <AboutHeader />
      <div className="gallery-main">
        <div className="gallery-viewport">
          <GalleryContainer
            slides={gallerySlides}
            currentIndex={currentIndex}
            onSlideChange={setCurrentIndex}
          />
        </div>
      </div>
      <PDFDownloadRow currentIndex={currentIndex} />
      <AboutFooter />
    </div>
  );
}

/**
 * PDF Download Row - Centered above CTA links, displays card title and download button
 */
function PDFDownloadRow({ currentIndex }: { currentIndex: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const pdf = slidePDFs[currentIndex];

  if (!pdf) return null;

  // Only show download button for cards that have a PDF (skip first card)
  const hasPDF = currentIndex > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentIndex}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        bottom: "90px",
        left: 0,
        right: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <button
        onClick={() => pdf.url !== "#" && window.open(pdf.url, "_blank")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={pdf.url === "#"}
        style={{
          fontFamily: galleryTheme.fonts.mono,
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isHovered && pdf.url !== "#" ? "#ffffff" : galleryTheme.colors.textPrimary,
          background: `linear-gradient(135deg, ${galleryTheme.colors.muted}30 0%, ${galleryTheme.colors.muted}20 100%)`,
          border: `1px solid ${galleryTheme.colors.muted}40`,
          borderRadius: "8px",
          padding: "0.75rem 1.5rem",
          cursor: pdf.url === "#" ? "default" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Sliding gradient overlay - only show for PDF buttons */}
        {pdf.url !== "#" && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: isHovered ? "100%" : "0%",
              background: `linear-gradient(90deg, #FF6B00 0%, #FF8C33 50%, #FF6B00 100%)`,
              backgroundSize: "200% 100%",
              transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: 0,
            }}
          />
        )}
        {/* Icon and text with higher z-index */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
            opacity: pdf.url === "#" ? 0.5 : 1,
          }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2v4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span style={{ position: "relative", zIndex: 1 }}>{pdf.buttonText}</span>
      </button>
    </motion.div>
  );
}
