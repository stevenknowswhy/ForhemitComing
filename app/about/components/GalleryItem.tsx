"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GalleryItemProps } from "../types/gallery";
import { galleryTheme, getImageCredit, gallerySlides } from "../lib/galleryData";

/**
 * Individual gallery slide component
 * Features Netflix-inspired scale animations and depth effects
 */
export function GalleryItem({
  slide,
  isActive,
  isAdjacent,
  direction,
}: GalleryItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Smooth slide animation - entering slides over exiting
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 100, damping: 28, mass: 1.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      transition: {
        x: { type: "spring" as const, stiffness: 100, damping: 28, mass: 1.2 },
      },
    }),
  };

  // Card scale variants with z-index layering
  const cardVariants = {
    active: {
      scale: 1,
      opacity: 1,
      zIndex: 10,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
    adjacent: {
      scale: 0.92,
      opacity: 0,
      zIndex: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            delay: delay * 0.15,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
          },
    }),
  };

  return (
    <motion.article
      className="gallery-item"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        willChange: isActive ? "transform, opacity" : "auto",
      }}
      aria-hidden={!isActive}
      role="group"
      aria-roledescription="slide"
      aria-label={`${slide.index + 1} of ${gallerySlides.length}: ${slide.title}`}
    >
      <motion.div
        className="gallery-card"
        variants={cardVariants}
        animate={isActive ? "active" : "adjacent"}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1600px",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          background: "#0e0e0c",
          isolation: "isolate",
        }}
      >
        {/* Image Container - Left column */}
        <div
          className="gallery-image-wrapper"
          style={{
            position: "relative",
            width: "50%",
            height: "100%",
            flexShrink: 0,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${galleryTheme.colors.muted}20 0%, ${galleryTheme.colors.backgroundSecondary}40 100%)`,
          }}
        >
          {/* Placeholder gradient background */}
          <div
            className="gallery-image-placeholder"
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                135deg,
                hsl(${30 + slide.index * 30}, 30%, ${15 + slide.index * 5}%) 0%,
                hsl(${40 + slide.index * 25}, 25%, ${10 + slide.index * 3}%) 100%
              )`,
            }}
          />

          {/* Decorative pattern overlay */}
          <div
            className="gallery-pattern-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(circle at 30% 70%, rgba(139, 90, 43, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(201, 168, 108, 0.1) 0%, transparent 50%)
              `,
            }}
          />

          {/* Image (lazy loaded for non-active slides) */}
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={isActive}
            loading={isActive ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{
              objectFit: "cover",
              opacity: imageLoaded && !imageError ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {/* Image credit */}
          <ImageCredit slideId={slide.id} isActive={isActive} />

          {/* Accent tag overlay */}
          {slide.accent && (
            <motion.span
              className="gallery-accent-tag"
              variants={textVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              custom={0}
              style={{
                position: "absolute",
                top: "1.5rem",
                left: "1.5rem",
                fontFamily: galleryTheme.fonts.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: galleryTheme.colors.accentLight,
                padding: "0.5rem 1rem",
                background: "rgba(14, 14, 12, 0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: "4px",
                border: `1px solid ${galleryTheme.colors.accent}40`,
              }}
            >
              {slide.accent}
            </motion.span>
          )}
        </div>

        {/* Content Area - Right column */}
        <div
          className="gallery-content"
          style={{
            padding: "2.5rem",
            background: galleryTheme.colors.backgroundSecondary,
            borderLeft: `1px solid ${galleryTheme.colors.muted}40`,
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <motion.h2
            className="gallery-title"
            variants={textVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            custom={1}
            style={{
              fontFamily: galleryTheme.fonts.heading,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: galleryTheme.colors.textPrimary,
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            {slide.title}
          </motion.h2>

          {slide.subtitleAccent && (
            <motion.p
              className="gallery-subtitle-accent"
              variants={textVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              custom={2}
              style={{
                fontFamily: galleryTheme.fonts.mono,
                fontSize: "0.75rem",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: galleryTheme.colors.accent,
                marginBottom: "1rem",
              }}
            >
              {slide.subtitleAccent}
            </motion.p>
          )}

          <motion.p
            className="gallery-subtitle"
            variants={textVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            custom={slide.subtitleAccent ? 3 : 2}
            style={{
              fontFamily: galleryTheme.fonts.body,
              fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: galleryTheme.colors.textSecondary,
              width: "100%",
              whiteSpace: "pre-line",
              marginBottom: slide.extendedContent ? "1rem" : 0,
            }}
          >
            {slide.subtitle.replace(/\[Download PDF: .+?\]/, "").trim()}
          </motion.p>

          {/* Read More Button */}
          {slide.extendedContent && (
            <motion.button
              variants={textVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              custom={slide.subtitleAccent ? 4 : 3}
              onClick={() => setIsModalOpen(true)}
              style={{
                fontFamily: galleryTheme.fonts.mono,
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: galleryTheme.colors.accent,
                background: "transparent",
                border: `1px solid ${galleryTheme.colors.accent}50`,
                borderRadius: "4px",
                padding: "0.6rem 1.2rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${galleryTheme.colors.accent}15`;
                e.currentTarget.style.borderColor = galleryTheme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${galleryTheme.colors.accent}50`;
              }}
            >
              Read More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.button>
          )}
        </div>

        {/* Extended Content Modal - Rendered via Portal */}
        <ModalPortal isOpen={isModalOpen && !!slide.extendedContent}>
          <ExtendedContentModal
            title={slide.title}
            content={slide.extendedContent || ""}
            onClose={() => setIsModalOpen(false)}
          />
        </ModalPortal>
      </motion.div>
    </motion.article>
  );
}

/**
 * Modal Portal - Renders modal outside the gallery container
 * This is needed because position:fixed doesn't work inside transformed elements
 */
function ModalPortal({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>{children}</AnimatePresence>,
    document.body
  );
}

/**
 * Extended Content Modal - Displays full article content
 */
function ExtendedContentModal({
  title,
  content,
  onClose,
}: {
  title: string;
  content: string;
  onClose: () => void;
}) {
  // Parse markdown-like content
  const parseContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];
    let key = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={key++} style={{ height: "1rem" }} />);
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h3
            key={key++}
            style={{
              fontFamily: galleryTheme.fonts.heading,
              fontSize: "1.1rem",
              fontWeight: 600,
              color: galleryTheme.colors.textPrimary,
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
              letterSpacing: "-0.01em",
            }}
          >
            {trimmed.replace("## ", "")}
          </h3>
        );
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h4
            key={key++}
            style={{
              fontFamily: galleryTheme.fonts.heading,
              fontSize: "0.95rem",
              fontWeight: 600,
              color: galleryTheme.colors.accent,
              marginTop: "1.25rem",
              marginBottom: "0.5rem",
            }}
          >
            {trimmed.replace("### ", "")}
          </h4>
        );
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        elements.push(
          <p
            key={key++}
            style={{
              fontFamily: galleryTheme.fonts.body,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: galleryTheme.colors.textPrimary,
              marginBottom: "0.5rem",
              lineHeight: 1.5,
            }}
          >
            {trimmed.replace(/\*\*/g, "")}
          </p>
        );
      } else {
        elements.push(
          <p
            key={key++}
            style={{
              fontFamily: galleryTheme.fonts.body,
              fontSize: "0.9rem",
              fontWeight: 300,
              color: galleryTheme.colors.textSecondary,
              marginBottom: "0.75rem",
              lineHeight: 1.7,
            }}
          >
            {trimmed}
          </p>
        );
      }
    }
    return elements;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "rgba(14, 14, 12, 0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "80vh",
          background: "#0e0e0c",
          borderRadius: "12px",
          border: `1px solid ${galleryTheme.colors.muted}40`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderBottom: `1px solid ${galleryTheme.colors.muted}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: galleryTheme.fonts.heading,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: galleryTheme.colors.textPrimary,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "transparent",
              border: `1px solid ${galleryTheme.colors.muted}50`,
              color: galleryTheme.colors.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${galleryTheme.colors.muted}30`;
              e.currentTarget.style.color = galleryTheme.colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = galleryTheme.colors.textSecondary;
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: "2rem",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {parseContent(content)}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Image Credit Component - Shows Unsplash photographer attribution
 */
function ImageCredit({ slideId, isActive }: { slideId: string; isActive: boolean }) {
  const credit = getImageCredit(slideId);

  return (
    <motion.a
      href={credit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="image-credit"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 0.7 : 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        fontFamily: galleryTheme.fonts.mono,
        fontSize: "0.6rem",
        letterSpacing: "0.05em",
        color: "#f5f0e8",
        textDecoration: "none",
        padding: "0.35rem 0.75rem",
        background: "rgba(14, 14, 12, 0.6)",
        backdropFilter: "blur(4px)",
        borderRadius: "4px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "opacity 0.3s ease",
        pointerEvents: isActive ? "auto" : "none",
        zIndex: 10,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.7";
      }}
    >
      Photo by {credit.photographer}
    </motion.a>
  );
}
