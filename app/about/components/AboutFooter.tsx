"use client";

import { galleryTheme } from "../lib/galleryData";

/**
 * About Footer - Minimal footer for gallery page
 */
export function AboutFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="about-footer"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        background: `linear-gradient(to top, ${galleryTheme.colors.background} 0%, transparent 100%)`,
        pointerEvents: "none", // Let clicks pass through to gallery
      }}
    >
      <div
        className="about-footer-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          fontFamily: galleryTheme.fonts.mono,
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: `${galleryTheme.colors.textSecondary}80`,
          textTransform: "uppercase",
          pointerEvents: "auto",
        }}
      >
        <span>&copy; {currentYear} Forhemit Capital</span>
        <span
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: `${galleryTheme.colors.muted}60`,
          }}
        />
        <span>All Rights Reserved</span>
      </div>
    </footer>
  );
}
