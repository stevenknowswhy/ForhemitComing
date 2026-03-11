"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavigationProps {
  variant?: "dark" | "light";
}

export function Navigation({ variant = "dark" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className={`minimal-nav ${variant === "light" ? "light-nav" : ""}`} ref={menuRef}>
      {/* Hamburger Menu Button */}
      <button
        className={`hamburger-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="nav-dropdown">
          <Link
            href="/about"
            className="nav-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/business-owners"
            className="nav-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            For Business Owners
          </Link>
          <Link
            href="/introduction"
            className="nav-dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            Introductions
          </Link>
        </div>
      )}
    </nav>
  );
}
