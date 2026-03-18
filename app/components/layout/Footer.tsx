"use client";

import Link from "next/link";
import "./footer.css";

interface FooterProps {
  onLegalClick?: () => void;
  onSitemapClick?: () => void;
  variant?: "sticky" | "static";
}

export function Footer({ onLegalClick, onSitemapClick, variant = "sticky" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer footer-${variant}`}>
      <div className="footer-content">
        <span className="footer-text">&copy; {currentYear} Forhemit Capital</span>
        <span className="footer-dot" />
        <span className="footer-text">All Rights Reserved</span>
        
        {onSitemapClick && (
          <>
            <span className="footer-dot" />
            <button className="footer-link" onClick={onSitemapClick}>
              Sitemap
            </button>
          </>
        )}
        
        {onLegalClick && (
          <>
            <span className="footer-dot" />
            <button className="footer-link" onClick={onLegalClick}>
              Legal
            </button>
          </>
        )}
        
        <span className="footer-dot" />
        <Link href="/admin" className="footer-link">
          Admin
        </Link>
      </div>
    </footer>
  );
}
