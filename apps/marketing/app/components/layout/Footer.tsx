"use client";

import Link from "next/link";
import "./footer.css";

interface FooterProps {
  onLegalClick?: () => void;
  onSitemapClick?: () => void;
  variant?: "sticky" | "static";
}

const OWNER_LINKS = [
  { href: "/business-owners", label: "For Business Owners" },
  { href: "/four-month-path", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

const PROFESSION_LINKS = [
  { href: "/legal-practices", label: "Attorneys" },
  { href: "/brokers", label: "Brokers" },
  { href: "/accounting-firms", label: "CPAs" },
  { href: "/wealth-managers", label: "Wealth Managers" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
  { href: "/the-exit-crisis", label: "The Exit Crisis" },
  { href: "/beyond-the-balance-sheet", label: "Beyond the Balance Sheet" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ onLegalClick, onSitemapClick, variant = "sticky" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <footer className={`footer footer-${variant}`}>
      <div className="footer-main">
        <div className="footer-col footer-col-brand">
          <span className="footer-wordmark">Forhemit</span>
          <p className="footer-tagline">
            100% employee-ownership succession — sell your business to your
            employees, at full price.
          </p>
          <p className="footer-contact">
            <a href="tel:+15104054330" className="footer-nav-link">
              (510) 405-4330
            </a>
            <a href="mailto:contact@forhemit.com" className="footer-nav-link">
              contact@forhemit.com
            </a>
            <span>55 9th Street, San Francisco, CA</span>
          </p>
        </div>

        <nav className="footer-col" aria-label="For owners">
          <p className="footer-heading">For Owners</p>
          {OWNER_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="footer-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="For professionals">
          <p className="footer-heading">For Professionals</p>
          {PROFESSION_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="footer-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="Company">
          <p className="footer-heading">Company</p>
          {COMPANY_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="footer-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

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

        <span className="footer-dot" />
        <Link href="/privacy" className="footer-link">
          Privacy
        </Link>
        <span className="footer-dot" />
        <Link href="/terms" className="footer-link">
          Terms
        </Link>

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
