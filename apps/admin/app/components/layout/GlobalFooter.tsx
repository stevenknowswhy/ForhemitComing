"use client";

import { useState, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

// Lazy load modals for better performance (code splitting)
const LegalModal = lazy(() => import("../modals/LegalModal").then((mod) => ({ 
  default: mod.LegalModal 
})));
const SitemapModal = lazy(() => import("../modals/SitemapModal"));

export function GlobalFooter() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const pathname = usePathname();

  // Hide footer on coming-soon page
  if (pathname === "/coming-soon") {
    return null;
  }

  // Hide footer on blog pages (blog has its own footer)
  if (pathname?.startsWith("/blog")) {
    return null;
  }

  // Hide footer on admin pages (admin has its own layout)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Use sticky footer on homepage to keep everything in viewport
  const isHomePage = pathname === "/";

  return (
    <>
      <Footer
        variant={isHomePage ? "sticky" : "static"}
        onLegalClick={() => setShowLegalModal(true)}
        onSitemapClick={() => setShowSitemapModal(true)}
      />

      {showLegalModal && (
        <Suspense fallback={null}>
          <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
        </Suspense>
      )}
      {showSitemapModal && (
        <Suspense fallback={null}>
          <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
        </Suspense>
      )}
    </>
  );
}
