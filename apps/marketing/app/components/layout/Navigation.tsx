"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import "./navigation.css";

interface NavigationProps {
  variant?: "dark" | "light";
}

// Primary navigation items (hide current page)
const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/business-owners", label: "For Business Owners" },
  { href: "/contact", label: "Contact" },
];

// Always show this link
const permanentLinks = [{ href: "/brokers", label: "Brokers" }];

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

  // Filter out current page from primary navigation
  const visibleNavItems = navItems.filter((item) => {
    // Exact match for home, startsWith for others
    if (item.href === "/") {
      return pathname !== "/";
    }
    return !pathname?.startsWith(item.href);
  });

  // Combine with permanent links (always show Brokers)
  const allNavItems = [...visibleNavItems, ...permanentLinks];

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
            {allNavItems.map((item) => (
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
        </>
      )}
    </nav>
  );
}
