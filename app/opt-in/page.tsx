"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ui/Toast";
import "../privacy/privacy-page.css";
import "./opt-in-page.css";

export default function OptInPage() {
  const { toasts, removeToast, success, error: showError } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consents, setConsents] = useState({
    marketingEmail: false,
    marketingSms: false,
    educational: false,
    opportunities: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Withdrawal form state
  const [withdrawEmail, setWithdrawEmail] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawTypes, setWithdrawTypes] = useState({
    email: false,
    sms: false,
    phone: false,
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWithdrawTypeChange = (key: keyof typeof withdrawTypes) => {
    setWithdrawTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const formatted = formatPhoneNumber(e.target.value);
    setter(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError("Please enter your email address");
      return;
    }
    
    if (consents.marketingSms && !phone) {
      showError("Please enter your phone number to receive SMS messages");
      return;
    }
    
    if (!consents.marketingEmail && !consents.marketingSms && !consents.educational && !consents.opportunities) {
      showError("Please select at least one type of communication");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    success("Thank you! Your preferences have been saved.");
    setEmail("");
    setPhone("");
    setConsents({ marketingEmail: false, marketingSms: false, educational: false, opportunities: false });
    setIsSubmitting(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawEmail && !withdrawPhone) {
      showError("Please enter your email or phone number to opt out");
      return;
    }
    
    if (!withdrawTypes.email && !withdrawTypes.sms && !withdrawTypes.phone) {
      showError("Please select at least one communication type to opt out of");
      return;
    }

    setIsWithdrawing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    success("Opt-out request received. You will be removed from the selected communications within 10 business days.");
    setWithdrawEmail("");
    setWithdrawPhone("");
    setWithdrawTypes({ email: false, sms: false, phone: false });
    setIsWithdrawing(false);
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
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number (for SMS)</label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e, setPhone)}
                        placeholder="(555) 123-4567"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div className="consent-options">
                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={consents.marketingEmail}
                        onChange={() => handleConsentChange("marketingEmail")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Email Marketing</strong>
                        <span>Updates about Forhemit services, events, and announcements</span>
                      </span>
                    </label>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={consents.marketingSms}
                        onChange={() => handleConsentChange("marketingSms")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>SMS/Text Messages</strong>
                        <span>Appointment reminders, updates, and notifications via text message</span>
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

                  {/* SMS Disclosure */}
                  {consents.marketingSms && (
                    <div className="sms-disclosure">
                      <p>
                        <strong>SMS Consent:</strong> By checking this box, you consent to receive 
                        text messages from Forhemit Capital. Message and data rates may apply. 
                        Message frequency varies. Reply STOP to opt out at any time. Reply HELP 
                        for assistance. See our <Link href="/privacy">Privacy Policy</Link> for 
                        more information.
                      </p>
                    </div>
                  )}

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
                <h2>Withdraw Consent / Opt Out</h2>
                <p>
                  No longer wish to receive communications from us? You can withdraw 
                  your consent at any time. Please note that this will not affect 
                  transactional communications related to any active business relationship.
                </p>

                <form onSubmit={handleWithdraw} className="opt-out-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="withdraw-email">Email Address</label>
                      <input
                        type="email"
                        id="withdraw-email"
                        value={withdrawEmail}
                        onChange={(e) => setWithdrawEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="withdraw-phone">Phone Number</label>
                      <input
                        type="tel"
                        id="withdraw-phone"
                        value={withdrawPhone}
                        onChange={(e) => handlePhoneChange(e, setWithdrawPhone)}
                        placeholder="(555) 123-4567"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <p className="opt-out-label">Select communication types to opt out of:</p>
                  <div className="consent-options">
                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={withdrawTypes.email}
                        onChange={() => handleWithdrawTypeChange("email")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Email Communications</strong>
                        <span>Unsubscribe from all marketing and promotional emails</span>
                      </span>
                    </label>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={withdrawTypes.sms}
                        onChange={() => handleWithdrawTypeChange("sms")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>SMS/Text Messages</strong>
                        <span>Stop receiving text messages (you can also reply STOP to any message)</span>
                      </span>
                    </label>

                    <label className="consent-checkbox">
                      <input
                        type="checkbox"
                        checked={withdrawTypes.phone}
                        onChange={() => handleWithdrawTypeChange("phone")}
                      />
                      <span className="checkmark"></span>
                      <span className="consent-label">
                        <strong>Phone Calls</strong>
                        <span>Opt out of marketing and promotional phone calls</span>
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="opt-out-btn"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Processing..." : "Opt Out of Selected Communications"}
                  </button>
                </form>

                <div className="opt-out-help">
                  <h4>Quick Opt-Out Options</h4>
                  <ul>
                    <li><strong>Text Messages:</strong> Reply <strong>STOP</strong> to any SMS you receive</li>
                    <li><strong>Emails:</strong> Click the <strong>Unsubscribe</strong> link in any email</li>
                    <li><strong>Phone:</strong> Call us at +1 (800) 555-0199</li>
                  </ul>
                  <p>
                    <strong>Note:</strong> You will receive a confirmation of your opt-out request. 
                    Allow up to 10 business days for processing.
                  </p>
                </div>
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
                  <a href="mailto:privacy@forhemit.com">privacy@forhemit.com</a> or{" "}
                  call <a href="tel:+18005550199">+1 (800) 555-0199</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
