"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { GalleryItemProps } from "../types/gallery";
import { galleryTheme, getImageCredit } from "../lib/galleryData";

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
      aria-label={`${slide.index + 1} of ${5}: ${slide.title}`}
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
          flexDirection: "column",
          overflow: "hidden",
          background: "#0e0e0c",
          isolation: "isolate",
        }}
      >
        {/* Image Container - 55% of card height */}
        <div
          className="gallery-image-wrapper"
          style={{
            position: "relative",
            width: "100%",
            height: "55%",
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
              opacity: 0, // Hide until loaded - placeholder shows through
            }}
            onLoad={(e) => {
              // Fade in image when loaded
              const img = e.currentTarget as HTMLImageElement;
              img.style.transition = "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
              img.style.opacity = "1";
            }}
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

        {/* Content Area */}
        <div
          className="gallery-content"
          style={{
            padding: "2rem",
            background: galleryTheme.colors.backgroundSecondary,
            borderTop: `1px solid ${galleryTheme.colors.muted}40`,
            flex: "1",
            display: "flex",
            flexDirection: "column",
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
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
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
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: galleryTheme.colors.textSecondary,
              width: "100%",
              whiteSpace: "pre-line",
              marginBottom: 0,
            }}
          >
            {slide.subtitle.replace(/\[Download PDF: .+?\]/, "").trim()}
          </motion.p>
        </div>
      </motion.div>
    </motion.article>
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
