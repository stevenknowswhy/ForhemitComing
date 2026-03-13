"use client";

import Link from "next/link";

interface FooterProps {
  onLegalClick?: () => void;
  onSitemapClick?: () => void;
  variant?: "sticky" | "static";
}

export function Footer({ onLegalClick, onSitemapClick, variant = "sticky" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const linkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.65rem",
    fontWeight: 400,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted-text)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s ease",
    position: "relative" as const,
    whiteSpace: "nowrap" as const,
  };

  const dotStyle = {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "var(--muted-text)",
    opacity: 0.6,
    flexShrink: 0,
  };

  return (
    <footer className={`footer footer-${variant}`}>
      <div
        className="footer-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "var(--muted-text)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        <span>&copy; {currentYear} Forhemit Capital</span>
        <span style={dotStyle} />
        <span style={{ whiteSpace: "nowrap" }}>All Rights Reserved</span>
        
        {onSitemapClick && (
          <>
            <span style={dotStyle} />
            <button
              className="footer-link"
              style={linkStyle}
              onClick={onSitemapClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--light-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted-text)";
              }}
            >
              Sitemap
            </button>
          </>
        )}
        
        {onLegalClick && (
          <>
            <span style={dotStyle} />
            <button
              className="footer-link"
              style={linkStyle}
              onClick={onLegalClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--light-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted-text)";
              }}
            >
              Legal
            </button>
          </>
        )}
        
        <span style={dotStyle} />
        <Link
          href="/admin"
          className="footer-link"
          style={{
            ...linkStyle,
            textDecoration: "none",
          }}
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
