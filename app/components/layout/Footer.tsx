"use client";

import "./footer.css";

interface FooterProps {
  onLegalClick?: () => void;
  onSitemapClick?: () => void;
  variant?: "sticky" | "static";
}

const DEFAULT_ADMIN_LOGIN_URL = "https://www.forhemit.website";

export function Footer({ onLegalClick, onSitemapClick, variant = "sticky" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const loginUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || DEFAULT_ADMIN_LOGIN_URL;

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
        
        <>
          <span className="footer-dot" />
          <a
            href={loginUrl}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Login
          </a>
        </>
      </div>
    </footer>
  );
}
