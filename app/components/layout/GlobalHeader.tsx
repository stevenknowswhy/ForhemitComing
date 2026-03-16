"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./GlobalHeader.css";

export function GlobalHeader() {
  const pathname = usePathname();
  
  // Hide on home page
  if (pathname === "/") {
    return null;
  }
  
  // Hide on coming-soon page
  if (pathname === "/coming-soon") {
    return null;
  }

  return (
    <header className="global-header">
      <Link href="/" className="global-logo-link">
        <span className="global-logo-text">Forhemit</span>
        <span className="global-logo-underline" />
      </Link>
    </header>
  );
}
