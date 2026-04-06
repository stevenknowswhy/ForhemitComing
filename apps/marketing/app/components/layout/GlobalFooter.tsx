"use client";

import { useState, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import SitemapModal from "../modals/SitemapModal";

// Lazy load legal modal only (sitemap stays eager so the footer control works on first click)
const LegalModal = lazy(() =>
  import("../modals/LegalModal").then((mod) => ({
    default: mod.LegalModal,
  })),
);

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

  // Always use document-flow footer. The old "sticky" variant targeted a missing
  // `.footer-sticky` rule, so only `.footer` applied — `position: fixed` + z-index
  // sat on top of the homepage hero and swallowed clicks (looked like "dead" links).
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
      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </>
  );
}
