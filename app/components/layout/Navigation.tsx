"use client";

import Link from "next/link";

interface NavigationProps {
  variant?: "dark" | "light";
}

export function Navigation({ variant = "dark" }: NavigationProps) {
  const isDark = variant === "dark";

  return (
    <nav className={`minimal-nav ${isDark ? "" : "light-nav"}`}>
      <Link href="/about" className="nav-link">
        About
      </Link>
      <Link href="/introduction" className="nav-link">
        Introduction
      </Link>
    </nav>
  );
}
