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
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <footer className={`footer footer-${variant}`}>
      <div className="footer-content">
        <span className="footer-text">&copy; {currentYear} Forhemit PBC</span>
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
        
        {adminUrl ? (
          <>
            <span className="footer-dot" />
            <a
              href={adminUrl}
              className="footer-link"
              target="_blank"
              rel="noreferrer"
            >
              Admin
            </a>
          </>
        ) : null}
      </div>
    </footer>
  );
}
