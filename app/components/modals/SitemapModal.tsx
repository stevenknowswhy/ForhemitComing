"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { ModalDialog } from "../ui/ModalDialog";
import "./sitemap-modal.css";

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SitemapLink {
  label: string;
  href: string;
}

interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

const sitemapSections: SitemapSection[] = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "The Exit Crisis", href: "/the-exit-crisis" },
      { label: "FAQ", href: "/faq" },
      { label: "Beyond the Balance Sheet", href: "/beyond-the-balance-sheet" },
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

function SitemapAccordionSection({
  section,
  onLinkClick,
}: {
  section: SitemapSection;
  onLinkClick: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="sitemap-accordion-item">
      <button
        className={`sitemap-accordion-trigger ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>{section.title}</span>
        <ChevronDown className="sitemap-accordion-icon" size={20} />
      </button>
      <div
        className={`sitemap-accordion-content ${isExpanded ? "expanded" : ""}`}
      >
        <ul>
          {section.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onLinkClick}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SitemapDesktopSection({
  section,
  onLinkClick,
}: {
  section: SitemapSection;
  onLinkClick: () => void;
}) {
  return (
    <div className="sitemap-section">
      <h3>{section.title}</h3>
      <ul>
        {section.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={onLinkClick}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Sitemap"
      overlayClassName="sitemap-modal-overlay"
      className="sitemap-modal-content"
      closeButtonClassName="sitemap-modal-close"
      closeButtonAriaLabel="Close sitemap"
      renderCloseButton={({ onClose, className, ariaLabel }) => (
        <button className={className} onClick={onClose} aria-label={ariaLabel} type="button">
          <X size={20} />
        </button>
      )}
    >
        <div className="sitemap-header">
          <h2>Sitemap</h2>
          <p>Navigate to any page on our website</p>
        </div>

        {/* Desktop Layout - Multi-column Grid */}
        <div className="sitemap-grid-desktop">
          {sitemapSections.map((section) => (
            <SitemapDesktopSection
              key={section.title}
              section={section}
              onLinkClick={onClose}
            />
          ))}
        </div>

        {/* Mobile Layout - Accordion */}
        <div className="sitemap-accordion-mobile">
          {sitemapSections.map((section) => (
            <SitemapAccordionSection
              key={section.title}
              section={section}
              onLinkClick={onClose}
            />
          ))}
        </div>

        <div className="sitemap-footer">
          <p>
            &copy; {new Date().getFullYear()} Forhemit PBC. All Rights
            Reserved.
          </p>
        </div>
    </ModalDialog>
  );
}
