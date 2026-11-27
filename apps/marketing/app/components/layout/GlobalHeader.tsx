"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./GlobalHeader.css";

const PROFESSION_LINKS = [
  { href: "/legal-practices", label: "Attorneys" },
  { href: "/brokers", label: "Brokers" },
  { href: "/accounting-firms", label: "CPAs" },
  { href: "/wealth-managers", label: "Wealth Managers" },
];

export function GlobalHeader() {
  const pathname = usePathname();

  // Hide on coming-soon page
  if (pathname === "/coming-soon") {
    return null;
  }

  // Hide on the homepage (the ink homepage carries its own pill nav)
  if (pathname === "/") {
    return null;
  }

  // Hide on the ink subpages (they carry the ink pill nav, like the homepage)
  if (pathname === "/benefits" || pathname === "/how-we-do-it-differently") {
    return null;
  }

  // Hide on blog pages (blog has its own header)
  if (pathname.startsWith("/blog")) {
    return null;
  }

  // Hide on admin pages (admin has its own header)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="global-header">
      <Link
        href="/"
        className="global-logo-link"
        prefetch={process.env.NODE_ENV === "production"}
      >
        <span className="global-logo-text">Forhemit</span>
        <span className="global-logo-underline" />
      </Link>

      {/* Inline desktop nav (A10). Below 1024px the Navigation hamburger
          carries the same destinations in its grouped sheet. */}
      <nav className="global-nav" aria-label="Primary">
        <Link href="/business-owners" className="global-nav-link">
          For Owners
        </Link>
        <Link href="/four-month-path" className="global-nav-link">
          How It Works
        </Link>
        <Link href="/pricing" className="global-nav-link">
          Pricing
        </Link>
        <Link href="/about" className="global-nav-link">
          About
        </Link>
        <div className="global-nav-group">
          <button
            type="button"
            className="global-nav-link global-nav-group-btn"
            aria-haspopup="true"
          >
            For Professionals <span aria-hidden="true">▾</span>
          </button>
          <div className="global-nav-menu">
            {PROFESSION_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="global-nav-menu-item"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/faq" className="global-nav-link">
          FAQ
        </Link>
        <Link href="/contact" className="global-nav-link">
          Contact
        </Link>
        <Link href="/contact" className="global-nav-cta">
          Start your free assessment
        </Link>
      </nav>
    </header>
  );
}
