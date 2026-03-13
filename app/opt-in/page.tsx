"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "../components/layout/Footer";
import { useToast } from "../hooks/useToast";
import { SitemapModal } from "../components/modals/SitemapModal";
import { ToastContainer } from "../components/ui/Toast";
import "../privacy/privacy-page.css";
import "./opt-in-page.css";

export default function OptInPage() {
  const { toasts, removeToast, success, error: showError } = useToast();
  const [email, setEmail] = useState("");
  const [showSitemapModal, setShowSitemapModal] = useState(false);
  const [consents, setConsents] = useState({
    marketing: false,
    educational: false,
    opportunities: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError("Please enter your email address");
      return;
    }
    
    if (!consents.marketing && !consents.educational && !consents.opportunities) {
      showError("Please select at least one type of communication");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    success("Thank you! Your preferences have been saved.");
    setEmail("");
    setConsents({ marketing: false, educational: false, opportunities: false });
    setIsSubmitting(false);
  };

  const handleWithdraw = () => {
    success("Opt-out request received. You will be removed from our communications.");
  };

  return (
    <div className="legal-page-wrapper">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Logo Header */}
      <header className="legal-logo-header">
        <Link href="/" className="legal-logo-link">
          <span className="legal-logo-text">Forhemit</span>
          <span className="legal-logo-underline"></span>
        </Link>
      </header>

      <main className="legal-main">
        <section className="legal-hero">
          <div className="container">
            <span className="legal-eyebrow">Preferences</span>
            <h1 className="legal-title">Communication Preferences</h1>
            <p className="legal-subtitle">Manage your consent and stay connected</p>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="container">
            <div className="opt-in-content">
              {/* Opt-In Form */}
              <div className="opt-in-card">
                <h2>Subscribe to Updates</h2>
                <p className="opt-in-intro">
                  Stay informed about employee ownership strategies, ESOP insights, 
                  and opportunities to connect with Forhemit Capital.
                </p>

                <form onSubmit={handleSubmit} className="opt-in-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="consent-options">
                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={consents.marketing}
                        onChange={() => handleConsentChange("marketing")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Marketing Communications</strong>
                        <span>Updates about Forhemit services, events, and announcements</span>
                      </span>
                    </label>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={consents.educational}
                        onChange={() => handleConsentChange("educational")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Educational Content</strong>
                        <span>ESOP guides, industry insights, and succession planning resources</span>
                      </span>
                    </label>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={consents.opportunities}
                        onChange={() => handleConsentChange("opportunities")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Opportunities</strong>
                        <span>Career openings, partnership opportunities, and investment updates</span>
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="opt-in-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Update Preferences"}
                  </button>
                </form>

                <p className="opt-in-disclaimer">
                  By subscribing, you agree to our{" "}
                  <Link href="/privacy">Privacy Policy</Link> and{" "}
                  <Link href="/terms">Terms of Service</Link>. 
                  You can withdraw consent at any time.
                </p>
              </div>

              {/* Opt-Out Section */}
              <div className="opt-out-card">
                <h2>Withdraw Consent</h2>
                <p>
                  No longer wish to receive communications from us? You can withdraw 
                  your consent at any time. Please note that this will not affect 
                  transactional emails related to any active business relationship.
                </p>
                <button onClick={handleWithdraw} className="opt-out-btn">
                  Opt Out of All Communications
                </button>
              </div>

              {/* Your Rights Section */}
              <div className="rights-section">
                <h2>Your Privacy Rights</h2>
                <div className="rights-grid">
                  <div className="right-item">
                    <h3>Access</h3>
                    <p>Request a copy of the personal data we hold about you</p>
                  </div>
                  <div className="right-item">
                    <h3>Correction</h3>
                    <p>Update or correct inaccurate information</p>
                  </div>
                  <div className="right-item">
                    <h3>Deletion</h3>
                    <p>Request deletion of your personal information</p>
                  </div>
                  <div className="right-item">
                    <h3>Portability</h3>
                    <p>Receive your data in a structured, portable format</p>
                  </div>
                </div>
                <p className="rights-contact">
                  To exercise these rights, contact us at{" "}
                  <a href="mailto:privacy@forhemit.com">privacy@forhemit.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="static" onSitemapClick={() => setShowSitemapModal(true)} />

      <SitemapModal isOpen={showSitemapModal} onClose={() => setShowSitemapModal(false)} />
    </div>
  );
}
