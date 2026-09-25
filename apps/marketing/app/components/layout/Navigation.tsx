"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import "./navigation.css";

interface NavigationProps {
  variant?: "dark" | "light";
}

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Grouped menu sheet covering every public marketing page (P1-4) — mirrors
 * the footer sitemap's information architecture with the product and
 * resources surfaced in the header instead of modal-only.
 */
const navGroups: NavGroup[] = [
  {
    label: "Product",
    items: [{ href: "/signal-os", label: "Signal OS" }],
  },
  {
    label: "For Business Owners",
    items: [
      { href: "/business-owners", label: "Business Owners Overview" },
      { href: "/financial-accounting", label: "Financial & Accounting" },
    ],
  },
  {
    label: "For Professional Partners",
    items: [
      { href: "/brokers", label: "Brokers" },
      { href: "/broker-screening", label: "Broker Deal Screening" },
      { href: "/accounting-firms", label: "Accounting Firms" },
      { href: "/legal-practices", label: "Legal Practices" },
      { href: "/wealth-managers", label: "Wealth Managers" },
      { href: "/appraisers", label: "Appraisers" },
      { href: "/lenders", label: "Lenders" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/four-month-path", label: "Four Month Path" },
      { href: "/the-exit-crisis", label: "The Exit Crisis" },
      { href: "/beyond-the-balance-sheet", label: "Beyond the Balance Sheet" },
      { href: "/introduction", label: "Introduction Hub" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

// Referral-channel links that stay visible even on their own page.
const permanentHrefs = new Set(["/brokers"]);

/** Hide the link to the page you're already on (exact match for home). */
function filterNavGroup(
  group: NavGroup,
  pathname: string | null,
): NavGroup | null {
  const items = group.items.filter((item) => {
    if (permanentHrefs.has(item.href)) return true;
    if (item.href === "/") return pathname !== "/";
    return !pathname?.startsWith(item.href);
  });
  return items.length > 0 ? { label: group.label, items } : null;
}

/** In dev, prefetching every in-view route can saturate Turbopack and feel like a hang. */
const navPrefetch = process.env.NODE_ENV === "production";

export function Navigation({ variant = "dark" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide navigation on coming-soon page
  if (pathname === "/coming-soon") {
    return null;
  }

  // Hide navigation on blog pages (blog has its own navigation)
  if (pathname?.startsWith("/blog")) {
    return null;
  }

  // Hide navigation on admin pages (admin has its own header)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Per-group current-page filter; drop groups left empty (e.g. Product on /signal-os)
  const visibleGroups = navGroups
    .map((group) => filterNavGroup(group, pathname))
    .filter((group): group is NavGroup => group !== null);

  return (
    <nav
      className={`minimal-nav ${variant === "light" ? "light-nav" : ""}`}
      ref={menuRef}
    >
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Hamburger Menu Button */}
      <button
        className={`hamburger-btn touch-target-icon ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Bottom Sheet Mobile Nav (Phase 2 upgrade from dropdown) */}
      {isOpen && (
        <>
          {/* Overlay for dismiss (thumb friendly, respects top chrome) */}
          <div 
            className="nav-overlay" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* Full-width bottom sheet — thumb-reachable, reuses Phase 1 touch-target and chrome patterns */}
          <div className="nav-bottom-sheet">
            <div className="nav-sheet-handle" aria-hidden="true" />
            {visibleGroups.map((group) => (
              <div key={group.label} className="nav-sheet-group">
                <p className="nav-sheet-group-label">{group.label}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={navPrefetch}
                    className="nav-bottom-sheet-item touch-target"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}
