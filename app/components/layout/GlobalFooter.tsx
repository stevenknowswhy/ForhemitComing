"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { LegalModal } from "../modals/LegalModal";
import { SitemapModal } from "../modals/SitemapModal";

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

      <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </>
  );
}
