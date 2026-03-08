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

  // Animation variants for slide transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.85,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : galleryTheme.animation.slideTransition,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.85,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { ...galleryTheme.animation.slideTransition, stiffness: 400 },
    }),
  };

  // Scale variants for the card itself (Netflix-style)
  const getCardTransition = () => {
    if (prefersReducedMotion) return { duration: 0 };
    return {
      type: "tween" as const,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      duration: 0.4,
    };
  };

  const cardVariants = {
    active: {
      scale: 1,
      filter: "blur(0px)",
      opacity: 1,
      zIndex: 10,
      transition: getCardTransition(),
    },
    adjacent: {
      scale: 0.92,
      filter: prefersReducedMotion ? "blur(0px)" : "blur(2px)",
      opacity: 0.4,
      zIndex: 5,
      transition: getCardTransition(),
    },
    inactive: {
      scale: 0.85,
      filter: prefersReducedMotion ? "blur(0px)" : "blur(4px)",
      opacity: 0,
      zIndex: 0,
      transition: getCardTransition(),
    },
  };

  const getCardState = () => {
    if (isActive) return "active";
    if (isAdjacent) return "adjacent";
    return "inactive";
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
        padding: "2rem",
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
        animate={getCardState()}
        style={{
          width: "100%",
          maxWidth: "1200px",
          height: "100%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(26, 18, 9, 0.8)",
          boxShadow: isActive
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 90, 43, 0.2)"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Image Container - 16:9 Aspect Ratio */}
        <div
          className="gallery-image-wrapper"
          style={{
            position: "relative",
            width: "100%",
            flex: "1 1 auto",
            minHeight: 0,
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

          <motion.p
            className="gallery-subtitle"
            variants={textVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            custom={2}
            style={{
              fontFamily: galleryTheme.fonts.body,
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: galleryTheme.colors.textSecondary,
              maxWidth: "600px",
            }}
          >
            {slide.subtitle}
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
