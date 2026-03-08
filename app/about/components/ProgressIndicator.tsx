"use client";

import { motion } from "framer-motion";
import { ProgressIndicatorProps } from "../types/gallery";
import { galleryTheme } from "../lib/galleryData";

/**
 * Progress Indicator - Shows current position in gallery
 * Click to jump to specific slides
 */
export function ProgressIndicator({
  total,
  current,
  onSelect,
}: ProgressIndicatorProps) {
  if (total <= 1) return null;

  return (
    <div
      className="progress-indicator"
      role="tablist"
      aria-label="Gallery navigation"
      style={{
        position: "fixed",
        bottom: "48px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1.25rem",
        background: "rgba(14, 14, 12, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: `1px solid ${galleryTheme.colors.muted}30`,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <ProgressDot
          key={index}
          index={index}
          isActive={index === current}
          onClick={() => onSelect(index)}
        />
      ))}

      {/* Slide counter */}
      <span
        className="progress-counter"
        aria-live="polite"
        style={{
          fontFamily: galleryTheme.fonts.mono,
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: galleryTheme.colors.textSecondary,
          marginLeft: "0.5rem",
          paddingLeft: "0.75rem",
          borderLeft: `1px solid ${galleryTheme.colors.muted}40`,
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/**
 * Individual progress dot
 */
interface ProgressDotProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function ProgressDot({ index, isActive, onClick }: ProgressDotProps) {
  return (
    <button
      className={`progress-dot ${isActive ? "progress-dot-active" : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-label={`Go to slide ${index + 1}`}
      style={{
        width: isActive ? "32px" : "10px",
        height: "10px",
        borderRadius: "5px",
        background: isActive
          ? galleryTheme.colors.accent
          : `${galleryTheme.colors.muted}60`,
        border: "none",
        cursor: "pointer",
        padding: 0,
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        outline: "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = galleryTheme.colors.accentLight;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = `${galleryTheme.colors.muted}60`;
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${galleryTheme.colors.accent}60`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Animated fill for active state */}
      {isActive && (
        <motion.div
          className="progress-dot-fill"
          layoutId="activeDot"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, ${galleryTheme.colors.accent}, ${galleryTheme.colors.accentLight})`,
            borderRadius: "5px",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
    </button>
  );
}
