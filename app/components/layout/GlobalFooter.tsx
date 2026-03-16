"use client";

import { useState, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

// Lazy load modals for better performance (code splitting)
const LegalModal = lazy(() => import("../modals/LegalModal").then((mod) => ({ 
  default: mod.LegalModal 
})));
const SitemapModal = lazy(() => import("../modals/SitemapModal").then((mod) => ({ 
  default: mod.SitemapModal 
})));

export function GlobalFooter() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const pathname = usePathname();

  // Hide footer on coming-soon page
  if (pathname === "/coming-soon") {
    return null;
  }

  return (
    <>
      <Footer
        variant="static"
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
