"use client";

import Link from "next/link";
import "./sitemap-modal.css";

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SitemapSection {
  title: string;
  links: { label: string; href: string }[];
}

const sitemapSections: SitemapSection[] = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact / Introduction", href: "/introduction" },
    ],
  },
  {
    title: "For Business Owners",
    links: [
      { label: "Business Owners Overview", href: "/business-owners" },
      { label: "Financial & Accounting", href: "/financial-accounting" },
    ],
  },
  {
    title: "Professional Partners",
    links: [
      { label: "Accounting Firms", href: "/accounting-firms" },
      { label: "Brokers", href: "/brokers" },
      { label: "Lenders", href: "/lenders" },
      { label: "Appraisers", href: "/appraisers" },
      { label: "Legal Practices", href: "/legal-practices" },
      { label: "Wealth Managers", href: "/wealth-managers" },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Communication Preferences", href: "/opt-in" },
    ],
  },
];

export function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="sitemap-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sitemap-modal-content">
        <button className="sitemap-modal-close" onClick={onClose} aria-label="Close sitemap">
          &times;
        </button>

        <div className="sitemap-header">
          <h2>Sitemap</h2>
          <p>Navigate to any page on our website</p>
        </div>

        <div className="sitemap-grid">
          {sitemapSections.map((section) => (
            <div key={section.title} className="sitemap-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onClose}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sitemap-footer">
          <p>&copy; {new Date().getFullYear()} Forhemit Capital. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
