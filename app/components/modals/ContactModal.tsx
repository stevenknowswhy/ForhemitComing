"use client";

import { useState } from "react";
import "./contact-modal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [revealedSection, setRevealedSection] = useState<"none" | "contact" | "message" | "success">("none");
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    contactType: "",
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, contactType: value });
    if (value && revealedSection === "none") {
      setRevealedSection("contact");
    }
  };

  const canShowMessage = () => {
    return formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== "";
  };

  const canShowPreview = () => {
    return formData.message.trim() !== "" && formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== "";
  };

  const handleContactBlur = () => {
    if (canShowMessage() && revealedSection === "contact") {
      setRevealedSection("message");
    }
  };

  const handleShowPreview = () => {
    if (canShowPreview()) {
      setShowPreview(true);
    }
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowPreview(false);
    setRevealedSection("success");
  };

  const handleSuccessClose = () => {
    setRevealedSection("none");
    setShowPreview(false);
    setFormData({ contactType: "", firstName: "", lastName: "", email: "", company: "", interest: "", message: "" });
    onClose();
  };

  const getContactTypeLabel = (value: string) => {
    const labels: Record<string, string> = {
      "business-owner": "Business Owner (ESOP Transition)",
      "partner": "Partner (Accounting, Legal, Lending, etc.)",
      "existing-business": "Existing Portfolio Business",
      "website-visitor": "General Inquiry",
      "marketing": "Marketing / Vendor Services",
    };
    return labels[value] || value;
  };

  const getInterestLabel = (value: string) => {
    const labels: Record<string, string> = {
      "esop-transition": "ESOP Transition",
      "accounting": "Accounting Partnership",
      "legal": "Legal Partnership",
      "lending": "Lending Partnership",
      "broker": "Business Broker Partnership",
      "wealth": "Wealth Management Partnership",
      "career": "Career Opportunities",
      "general": "General Inquiry",
    };
    return labels[value] || value || "Not specified";
  };

  return (
    <div className="contact-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="contact-modal-content">
        <button className="contact-modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="contact-modal-layout">
          {/* Left Side - Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-header">
              <h2 className="contact-info-title">Let&apos;s Connect</h2>
              <p className="contact-info-subtitle">
                Ready to explore partnership opportunities? We&apos;re here to help.
              </p>
            </div>

            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">Email</span>
                  <a href="mailto:contact@forhemit.com" className="contact-info-link">contact@forhemit.com</a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">Location</span>
                  <span className="contact-info-value">San Francisco, CA 94103</span>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">Phone</span>
                  <span className="contact-info-value">(415) XXX-XXXX</span>
                </div>
              </div>
            </div>

            <div className="contact-info-divider"></div>

            <div className="contact-info-note">
              <p>
                Whether you&apos;re a business owner exploring ESOP transitions, 
                a professional seeking partnership opportunities, or simply curious 
                about our stewardship model — we&apos;d love to hear from you.
              </p>
            </div>
          </div>

          {/* Right Side - Progressive Form */}
          <div className="contact-form-section">
            {revealedSection === "success" ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                </div>
                <h3 className="contact-success-title">Message Sent!</h3>
                <p className="contact-success-message">
                  Thank you for reaching out. We&apos;ll get back to you shortly.
                </p>
                <button className="form-btn form-btn-success-close" onClick={handleSuccessClose}>
                  Close
                </button>
              </div>
            ) : showPreview ? (
              <div className="form-preview-container">
                <div className="preview-header">
                  <h3 className="preview-title">Preview Your Message</h3>
                  <p className="preview-subtitle">Review before sending</p>
                </div>

                <div className="form-review">
                  <div className="review-section">
                    <span className="review-label">Contact Type</span>
                    <span className="review-value">{getContactTypeLabel(formData.contactType)}</span>
                  </div>
                  <div className="review-section">
                    <span className="review-label">Name</span>
                    <span className="review-value">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="review-section">
                    <span className="review-label">Email</span>
                    <span className="review-value">{formData.email}</span>
                  </div>
                  {(formData.company || formData.interest) && (
                    <div className="review-section">
                      <span className="review-label">Additional Info</span>
                      <span className="review-value">
                        {formData.company && `Company: ${formData.company}`}
                        {formData.company && formData.interest && " • "}
                        {formData.interest && `Interest: ${getInterestLabel(formData.interest)}`}
                      </span>
                    </div>
                  )}
                  <div className="review-section review-section-message">
                    <span className="review-label">Message</span>
                    <span className="review-value review-message">{formData.message}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="preview-actions">
                  <button type="button" className="form-btn form-btn-secondary" onClick={handleBackToForm}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    type="submit"
                    className="form-btn form-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <form className="progressive-form-simple" onSubmit={(e) => { e.preventDefault(); handleShowPreview(); }}>
                {/* Step 1: Contact Type */}
                <div className="form-step-simple">
                  <label htmlFor="contact-type" className="form-label">How can we help you? *</label>
                  <select
                    id="contact-type"
                    name="contactType"
                    value={formData.contactType}
                    onChange={handleContactTypeChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select who you are...</option>
                    <option value="business-owner">Business Owner (ESOP Transition)</option>
                    <option value="partner">Partner (Accounting, Legal, Lending, etc.)</option>
                    <option value="existing-business">Existing Portfolio Business</option>
                    <option value="website-visitor">General Inquiry</option>
                    <option value="marketing">Marketing / Vendor Services</option>
                  </select>
                </div>

                {/* Step 2: Contact Fields (revealed after selection) */}
                <div className={`form-step-simple reveal-section ${revealedSection !== "none" ? "revealed" : ""}`}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-firstName" className="form-label">First Name *</label>
                      <input
                        type="text"
                        id="contact-firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleContactBlur}
                        placeholder="First name"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-lastName" className="form-label">Last Name *</label>
                      <input
                        type="text"
                        id="contact-lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleContactBlur}
                        placeholder="Last name"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">Email *</label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleContactBlur}
                        placeholder="you@company.com"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-company" className="form-label">Company</label>
                      <input
                        type="text"
                        id="contact-company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company (optional)"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="contact-interest" className="form-label">Area of Interest</label>
                    <select
                      id="contact-interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select an area of interest (optional)</option>
                      <option value="esop-transition">ESOP Transition</option>
                      <option value="accounting">Accounting Partnership</option>
                      <option value="legal">Legal Partnership</option>
                      <option value="lending">Lending Partnership</option>
                      <option value="broker">Business Broker Partnership</option>
                      <option value="wealth">Wealth Management Partnership</option>
                      <option value="career">Career Opportunities</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Step 3: Message (revealed after contact fields) */}
                <div className={`form-step-simple reveal-section ${revealedSection === "message" ? "revealed" : ""}`}>
                  <div className="form-group form-group-full">
                    <label htmlFor="contact-message" className="form-label">Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your situation and how we can help..."
                      rows={4}
                      required
                      className="form-textarea"
                    />
                  </div>

                  {/* Preview Button */}
                  <button
                    type="submit"
                    className="form-btn form-btn-primary"
                    disabled={!canShowPreview()}
                  >
                    Review Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
