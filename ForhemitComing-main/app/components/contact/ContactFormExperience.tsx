"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ui/Toast";
import "../modals/contact-modal.css";

export interface ContactFormExperienceProps {
  source: string;
  variant: "modal" | "page";
  /** Called when the user dismisses the success state (modal uses this to close). */
  onAfterSuccessDismiss?: () => void;
}

const VALID_CONTACT_TYPES = new Set([
  "business-owner",
  "partner",
  "existing-business",
  "website-visitor",
  "marketing",
]);

const VALID_INTERESTS = new Set([
  "esop-transition",
  "accounting",
  "legal",
  "lending",
  "broker",
  "wealth",
  "appraisal",
  "career",
  "general",
]);

const PARTNER_INTERESTS = new Set(["accounting", "legal", "lending", "broker", "wealth", "appraisal"]);

export function ContactFormExperience({
  source,
  variant,
  onAfterSuccessDismiss,
}: ContactFormExperienceProps) {
  const searchParams = useSearchParams();
  const [revealedSection, setRevealedSection] = useState<"none" | "contact" | "message" | "success">("none");
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    contactType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, success, error: showError } = useToast();

  const submitContact = useMutation(api.contactSubmissions.submit);
  const sendEmailNotification = useAction(api.emails.sendContactFormNotification);

  useEffect(() => {
    const qs = searchParams.toString();
    if (!qs) return;

    const ctRaw = searchParams.get("contactType") ?? searchParams.get("type");
    const intRaw = searchParams.get("interest");

    let contactType = ctRaw && VALID_CONTACT_TYPES.has(ctRaw) ? ctRaw : "";
    const interest = intRaw && VALID_INTERESTS.has(intRaw) ? intRaw : "";

    if (interest && !contactType) {
      if (interest === "esop-transition") contactType = "business-owner";
      else if (PARTNER_INTERESTS.has(interest)) contactType = "partner";
    }

    if (!contactType && !interest) return;

    setFormData((prev) => ({
      ...prev,
      ...(contactType ? { contactType } : {}),
      ...(interest ? { interest } : {}),
    }));
    if (contactType) {
      setRevealedSection("contact");
    }
  }, [searchParams]);

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
    return (
      formData.message.trim() !== "" &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== ""
    );
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

    try {
      if (!formData.contactType || !formData.firstName || !formData.lastName || !formData.email || !formData.message) {
        showError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      await submitContact({
        contactType: formData.contactType as
          | "business-owner"
          | "partner"
          | "existing-business"
          | "website-visitor"
          | "marketing",
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        interest: (formData.interest as
          | "esop-transition"
          | "accounting"
          | "legal"
          | "lending"
          | "broker"
          | "wealth"
          | "appraisal"
          | "career"
          | "general"
          | undefined) || undefined,
        message: formData.message.trim(),
        source,
      });

      try {
        await sendEmailNotification({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          contactType: formData.contactType,
          interest: formData.interest || undefined,
          message: formData.message.trim(),
          source,
        });
      } catch {
        console.error("Failed to send email notification");
      }

      setIsSubmitting(false);
      setShowPreview(false);
      setRevealedSection("success");
      success("Message sent successfully! We'll get back to you shortly.");
    } catch (err) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";

      if (errorMessage.includes("Duplicate submission")) {
        showError("You recently submitted a message. Please wait a moment before sending another.");
      } else {
        showError(errorMessage);
      }
    }
  };

  const handleSuccessClose = () => {
    setRevealedSection("none");
    setShowPreview(false);
    setFormData({
      contactType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      interest: "",
      message: "",
    });
    onAfterSuccessDismiss?.();
  };

  const getContactTypeLabel = (value: string) => {
    const labels: Record<string, string> = {
      "business-owner": "Business Owner (ESOP Transition)",
      partner: "Partner (Accounting, Legal, Lending, etc.)",
      "existing-business": "Existing Portfolio Business",
      "website-visitor": "General Inquiry",
      marketing: "Marketing / Vendor Services",
    };
    return labels[value] || value;
  };

  const getInterestLabel = (value: string) => {
    const labels: Record<string, string> = {
      "esop-transition": "ESOP Transition",
      accounting: "Accounting Partnership",
      legal: "Legal Partnership",
      lending: "Lending Partnership",
      broker: "Business Broker Partnership",
      wealth: "Wealth Management Partnership",
      appraisal: "Appraisal / Valuation Partnership",
      career: "Career Opportunities",
      general: "General Inquiry",
    };
    return labels[value] || value || "Not specified";
  };

  const layoutClassName =
    variant === "page" ? "contact-modal-layout contact-page-layout" : "contact-modal-layout";

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className={layoutClassName}>
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-info-text">
                <span className="contact-info-label">Email</span>
                <a href="mailto:contact@forhemit.com" className="contact-info-link">
                  contact@forhemit.com
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contact-info-text">
                <span className="contact-info-label">Location</span>
                <span className="contact-info-value">55 9th St., San Francisco, CA</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
                <div className="contact-info-text">
                  <span className="contact-info-label">Phone</span>
                  <a href="tel:+14242534019" className="contact-info-link">
                    424-253-4019
                  </a>
                </div>
            </div>
          </div>

          <div className="contact-info-divider"></div>

          <div className="contact-info-note">
            <p>
              Whether you&apos;re a business owner exploring ESOP transitions, a professional seeking partnership
              opportunities, or simply curious about our stewardship model — we&apos;d love to hear from you.
            </p>
          </div>
        </div>

        <div className="contact-form-section">
          {revealedSection === "success" ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h3 className="contact-success-title">Message Sent!</h3>
              <p className="contact-success-message">
                Thank you for reaching out. We&apos;ll get back to you shortly.
              </p>
              <button className="form-btn form-btn-success-close" type="button" onClick={handleSuccessClose}>
                {variant === "page" ? "Send another message" : "Close"}
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
                  <span className="review-value">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="review-section">
                  <span className="review-label">Email</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                {(formData.phone || formData.company || formData.interest) && (
                  <div className="review-section">
                    <span className="review-label">Additional Info</span>
                    <span className="review-value">
                      {formData.phone && `Phone: ${formData.phone}`}
                      {formData.phone && formData.company && " • "}
                      {formData.company && `Company: ${formData.company}`}
                      {(formData.phone || formData.company) && formData.interest && " • "}
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
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Edit
                </button>
                <button type="submit" className="form-btn form-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <form
              className="progressive-form-simple"
              onSubmit={(e) => {
                e.preventDefault();
                handleShowPreview();
              }}
            >
              <div className="form-step-simple">
                <select
                  id="contact-type"
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleContactTypeChange}
                  required
                  className="form-select"
                >
                  <option value="">How can we help you? *</option>
                  <option value="business-owner">Business Owner (ESOP Transition)</option>
                  <option value="partner">Partner (Accounting, Legal, Lending, etc.)</option>
                  <option value="existing-business">Existing Portfolio Business</option>
                  <option value="website-visitor">General Inquiry</option>
                  <option value="marketing">Marketing / Vendor Services</option>
                </select>
              </div>

              <div className={`form-step-simple reveal-section ${revealedSection !== "none" ? "revealed" : ""}`}>
                <div className="form-group form-group-full">
                  <select
                    id="contact-interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Area of Interest (optional)</option>
                    <option value="esop-transition">ESOP Transition</option>
                    <option value="accounting">Accounting Partnership</option>
                    <option value="legal">Legal Partnership</option>
                    <option value="lending">Lending Partnership</option>
                    <option value="broker">Business Broker Partnership</option>
                    <option value="wealth">Wealth Management Partnership</option>
                    <option value="appraisal">Appraisal / Valuation Partnership</option>
                    <option value="career">Career Opportunities</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      id="contact-firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleContactBlur}
                      placeholder="First name *"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="contact-lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleContactBlur}
                      placeholder="Last name *"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleContactBlur}
                      placeholder="Email *"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleContactBlur}
                      placeholder="Phone"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group form-group-full">
                  <input
                    type="text"
                    id="contact-company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company (optional)"
                    className="form-input"
                  />
                </div>
              </div>

              <div className={`form-step-simple reveal-section ${revealedSection === "message" ? "revealed" : ""}`}>
                <div className="form-group form-group-full">
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message *"
                    rows={4}
                    required
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="form-btn form-btn-primary" disabled={!canShowPreview()}>
                  Review Message
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
