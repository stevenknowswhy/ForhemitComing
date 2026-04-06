"use client";

import { useState } from "react";
import { ModalDialog } from "../ui/ModalDialog";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LegalTab = "privacy" | "terms" | "accessibility";

export function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>("privacy");

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Legal"
      overlayClassName="legal-modal-overlay"
      className="legal-modal-content"
      closeButtonClassName="legal-modal-close"
      closeButtonAriaLabel="Close legal"
    >
        <div className="legal-tabs">
          <button
            className={`legal-tab ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
          <button
            className={`legal-tab ${activeTab === "terms" ? "active" : ""}`}
            onClick={() => setActiveTab("terms")}
          >
            Terms
          </button>
          <button
            className={`legal-tab ${activeTab === "accessibility" ? "active" : ""}`}
            onClick={() => setActiveTab("accessibility")}
          >
            Accessibility
          </button>
        </div>

        <div className="legal-content">
          {activeTab === "privacy" && <PrivacyContent />}
          {activeTab === "terms" && <TermsContent />}
          {activeTab === "accessibility" && <AccessibilityContent />}
        </div>
    </ModalDialog>
  );
}

function PrivacyContent() {
  return (
    <div className="legal-section active">
      <h2>Privacy Policy</h2>
      <p>Last updated: March 2026</p>
      <div className="legal-text">
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you fill out our application form. This may include your name, email address, phone number, and resume.</p>

        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to evaluate your application, communicate with you about your application status, and improve our services.</p>

        <h3>Information Sharing</h3>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only as required by law or to protect our rights.</p>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="legal-section active">
      <h2>Terms of Use</h2>
      <p>Last updated: March 2026</p>
      <div className="legal-text">
        <h3>Acceptance of Terms</h3>
        <p>By accessing and using Forhemit&apos;s website and services, you accept and agree to be bound by these Terms of Use.</p>

        <h3>Use of Services</h3>
        <p>Our services are intended for individuals seeking employment or partnership opportunities with Forhemit. You agree to provide accurate and complete information.</p>

        <h3>Intellectual Property</h3>
        <p>All content, trademarks, and materials on this website are owned by Forhemit and protected by intellectual property laws.</p>
      </div>
    </div>
  );
}

function AccessibilityContent() {
  return (
    <div className="legal-section active">
      <h2>Accessibility Statement</h2>
      <p>Last updated: March 2026</p>
      <div className="legal-text">
        <h3>Our Commitment</h3>
        <p>Forhemit is committed to ensuring digital accessibility for all users, including those with disabilities.</p>

        <h3>Measures to Support Accessibility</h3>
        <p>We continually work to improve accessibility through proper HTML structure, keyboard navigation support, and screen reader compatibility.</p>

        <h3>Contact Us</h3>
        <p>If you encounter any accessibility issues, please contact us at accessibility@forhemit.com.</p>
      </div>
    </div>
  );
}
