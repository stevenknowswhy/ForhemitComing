"use client";

import { useState } from "react";
import "./contact-modal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 1 | 2 | 3 | 4 | 5;

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState({
    contactType: "",
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.contactType !== "";
      case 2:
        return formData.name.trim() !== "" && formData.email.trim() !== "";
      case 3:
        return true; // Optional step
      case 4:
        return formData.message.trim() !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    // User can now review and manually close
  };

  const handleSuccessClose = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({ contactType: "", name: "", email: "", company: "", interest: "", message: "" });
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "How can we help you?";
      case 2:
        return "Who should we contact?";
      case 3:
        return "Tell us more (Optional)";
      case 4:
        return "What's your message?";
      case 5:
        return "Ready to send?";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Select the option that best describes you";
      case 2:
        return "We'll use this to get back to you";
      case 3:
        return "Share additional details about your company and interests";
      case 4:
        return "Tell us about your situation and how we can help";
      case 5:
        return "Review your information before sending";
    }
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
            {isSubmitted ? (
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
            ) : (
              <div className="progressive-form">
                {/* Progress Indicator */}
                <div className="form-progress">
                  <div className="progress-steps">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`progress-step ${
                          step < currentStep ? "completed" : step === currentStep ? "active" : ""
                        }`}
                      >
                        <div className="step-number">
                          {step < currentStep ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        {step < 5 && <div className="step-line" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Title */}
                <div className="step-header">
                  <h3 className="step-title">{getStepTitle()}</h3>
                  <p className="step-subtitle">{getStepSubtitle()}</p>
                </div>

                {/* Form Steps */}
                <form className="contact-form" onSubmit={handleSubmit}>
                  {/* Step 1: Contact Type */}
                  <div className={`form-step ${currentStep === 1 ? "active" : "hidden"}`}>
                    <div className="contact-type-options">
                      {[
                        { value: "business-owner", label: "Business Owner", desc: "Exploring ESOP transition" },
                        { value: "partner", label: "Partner", desc: "Accounting, Legal, Lending, etc." },
                        { value: "existing-business", label: "Existing Business", desc: "Portfolio company" },
                        { value: "website-visitor", label: "General Inquiry", desc: "Questions about Forhemit" },
                        { value: "marketing", label: "Marketing / Vendor", desc: "Services & partnerships" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`contact-type-option ${formData.contactType === option.value ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="contactType"
                            value={option.value}
                            checked={formData.contactType === option.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="option-content">
                            <span className="option-label">{option.label}</span>
                            <span className="option-desc">{option.desc}</span>
                          </div>
                          <div className="option-check">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Name & Email */}
                  <div className={`form-step ${currentStep === 2 ? "active" : "hidden"}`}>
                    <div className="form-fields-stack">
                      <div className="form-group">
                        <label htmlFor="contact-name" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          required
                          className="form-input"
                          autoFocus
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Company & Interest (Optional) */}
                  <div className={`form-step ${currentStep === 3 ? "active" : "hidden"}`}>
                    <div className="form-fields-stack">
                      <div className="form-group">
                        <label htmlFor="contact-company" className="form-label">Company</label>
                        <input
                          type="text"
                          id="contact-company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Corp (optional)"
                          className="form-input"
                          autoFocus
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-interest" className="form-label">Area of Interest</label>
                        <select
                          id="contact-interest"
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select an option (optional)</option>
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
                  </div>

                  {/* Step 4: Message */}
                  <div className={`form-step ${currentStep === 4 ? "active" : "hidden"}`}>
                    <div className="form-group form-group-full">
                      <label htmlFor="contact-message" className="form-label">Your Message *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your situation and how we can help..."
                        rows={5}
                        required
                        className="form-textarea"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Step 5: Review */}
                  <div className={`form-step ${currentStep === 5 ? "active" : "hidden"}`}>
                    <div className="form-review">
                      <div className="review-section">
                        <span className="review-label">Contact Type</span>
                        <span className="review-value">{getContactTypeLabel(formData.contactType)}</span>
                      </div>
                      <div className="review-section">
                        <span className="review-label">Name</span>
                        <span className="review-value">{formData.name}</span>
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
                  </div>

                  {/* Navigation Buttons */}
                  <div className="form-navigation">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="form-btn form-btn-secondary"
                        onClick={handleBack}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                    )}
                    
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        className="form-btn form-btn-primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                      >
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    ) : (
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
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
