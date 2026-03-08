"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import "./page.css";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const joinParam = searchParams?.get("join");

  const [showModal, setShowModal] = useState(joinParam === "true");
  const [step, setStep] = useState(1);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    position: "",
    otherPosition: "",
    resumeUrl: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [submitWithoutResume, setSubmitWithoutResume] = useState(false);

  const positions = [
    "Investment Analyst",
    "Portfolio Manager",
    "Operations Director",
    "Legal Counsel",
    "Business Development",
    "Other"
  ];

  const totalSteps = 6;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData({ firstName: "", lastName: "", phone: "", email: "", position: "", otherPosition: "", resumeUrl: "" });
    setIsUploading(false);
    setSubmitWithoutResume(false);
    // Clear the join parameter from URL
    router.push("/", { scroll: false });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showLegalModal) setShowLegalModal(false);
      if (showEmailInput) {
        setShowEmailInput(false);
        setEmail("");
      }
    }
    if (e.key === "Enter" && step >= 2 && step <= 4) {
      e.preventDefault();
      nextStep();
    }
  }, [showEmailInput, step, showLegalModal]);

  useEffect(() => {
    if (showModal || showEmailInput || showLegalModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, showEmailInput, showLegalModal, handleKeyDown]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const canProceed = () => {
    switch (step) {
      case 2: return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0;
      case 3: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 4: return formData.phone.replace(/\D/g, "").length === 10;
      case 5: return formData.position && (formData.position !== "Other" || formData.otherPosition.trim());
      default: return true;
    }
  };

  const canSubmit = () => {
    return formData.position && (formData.position !== "Other" || formData.otherPosition.trim()) && (submitWithoutResume || formData.resumeUrl);
  };

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>
      
      <nav className="minimal-nav">
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/introduction" className="nav-link">Introduction</Link>
      </nav>
      
      <main className="hero">
        <div className="container">
          <h1 className="brand-title">FORHEMIT</h1>
          <p className="brand-subtitle">PRIVATE EQUITY</p>
          
          <div className="cta-group">
            <button 
              id="join-btn" 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Join the Movement
            </button>
            <div className="early-access-wrapper">
              {!showEmailInput ? (
                <button 
                  id="early-access-btn" 
                  className="btn btn-secondary"
                  onClick={() => setShowEmailInput(true)}
                >
                  Get Early Access
                </button>
              ) : (
                <div id="email-reveal" className="email-reveal">
                  <div className="email-input-wrapper">
                    <input
                      type="email"
                      id="email-input"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="email-clear-btn"
                      onClick={() => {
                        setEmail("");
                        setShowEmailInput(false);
                      }}
                      aria-label="Close"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    id="submit-email"
                    className="btn-icon"
                    onClick={() => {
                      alert("Thank you! We'll be in touch soon.");
                      setEmail("");
                      setShowEmailInput(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <button className="footer-link" onClick={() => setShowLegalModal(true)}>Legal</button>
      </footer>

      {/* Legal Modal */}
      {showLegalModal && (
        <div className="legal-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLegalModal(false)}>
          <div className="legal-modal-content">
            <button className="legal-modal-close" onClick={() => setShowLegalModal(false)}>&times;</button>

            <div className="legal-tabs">
              <button
                className={`legal-tab ${legalTab === "privacy" ? "active" : ""}`}
                onClick={() => setLegalTab("privacy")}
              >
                Privacy
              </button>
              <button
                className={`legal-tab ${legalTab === "terms" ? "active" : ""}`}
                onClick={() => setLegalTab("terms")}
              >
                Terms of Use
              </button>
              <button
                className={`legal-tab ${legalTab === "accessibility" ? "active" : ""}`}
                onClick={() => setLegalTab("accessibility")}
              >
                Accessibility
              </button>
            </div>

            <div className="legal-content">
              {legalTab === "privacy" && (
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
              )}

              {legalTab === "terms" && (
                <div className="legal-section active">
                  <h2>Terms of Use</h2>
                  <p>Last updated: March 2026</p>
                  <div className="legal-text">
                    <h3>Acceptance of Terms</h3>
                    <p>By accessing and using Forhemit's website and services, you accept and agree to be bound by these Terms of Use.</p>

                    <h3>Use of Services</h3>
                    <p>Our services are intended for individuals seeking employment or partnership opportunities with Forhemit. You agree to provide accurate and complete information.</p>

                    <h3>Intellectual Property</h3>
                    <p>All content, trademarks, and materials on this website are owned by Forhemit and protected by intellectual property laws.</p>
                  </div>
                </div>
              )}

              {legalTab === "accessibility" && (
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div id="modal-overlay" className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <button className="modal-close" onClick={closeModal}>&times;</button>
          <div className="modal-content">
            
            {/* Progress Bar with Steps */}
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-step">Step {step} of {totalSteps}</span>
                <span className="progress-percent">{Math.round(((step - 1) / (totalSteps - 1)) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
              </div>
              <div className="progress-dots">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`progress-dot ${i + 1 <= step ? 'active' : ''} ${i + 1 === step ? 'current' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className="modal-grid">
              {/* Image - shows at top on mobile, right on desktop */}
              <div className="modal-image-side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/recruit-face.jpg" alt="Join Forhemit" className="portrait-img"/>
              </div>

              <div className="modal-form-side">
                {/* Step 1 - Intro */}
                {step === 1 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <h2>Join the Movement</h2>
                      <p className="step-description">
                        We&apos;re looking for visionary minds to reshape the landscape of private equity. 
                        Ready to lead?
                      </p>
                    </div>
                    <div className="button-row">
                      <div></div>
                      <button className="nav-link-btn continue-link" onClick={nextStep}>
                        Let&apos;s begin
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 2 - First & Last Name */}
                {step === 2 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <label className="typeform-label">What&apos;s your name?</label>
                      <input 
                        type="text" 
                        className="typeform-input"
                        placeholder="First name"
                        autoFocus
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                      <input 
                        type="text" 
                        className="typeform-input"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                      <p className="hint">Press Enter to continue</p>
                    </div>
                    <div className="button-row">
                      <button className="nav-link-btn back-link" onClick={prevStep}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                      <button 
                        className="nav-link-btn continue-link" 
                        onClick={nextStep}
                        disabled={!canProceed()}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 - Email */}
                {step === 3 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <label className="typeform-label">What&apos;s your email address?</label>
                      <input 
                        type="email" 
                        className="typeform-input"
                        placeholder="john@example.com"
                        autoFocus
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      <p className="hint">Press Enter to continue</p>
                    </div>
                    <div className="button-row">
                      <button className="nav-link-btn back-link" onClick={prevStep}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                      <button 
                        className="nav-link-btn continue-link" 
                        onClick={nextStep}
                        disabled={!canProceed()}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 - Phone */}
                {step === 4 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <label className="typeform-label">What&apos;s your phone number?</label>
                      <p className="input-subtext">US phone numbers only</p>
                      <input 
                        type="tel" 
                        className="typeform-input"
                        placeholder="(555) 555-5555"
                        autoFocus
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: formatPhoneNumber(e.target.value)})}
                      />
                      <p className="hint">Press Enter to continue</p>
                    </div>
                    <div className="button-row">
                      <button className="nav-link-btn back-link" onClick={prevStep}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                      <button 
                        className="nav-link-btn continue-link" 
                        onClick={nextStep}
                        disabled={!canProceed()}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 5 - Position & Resume */}
                {step === 5 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <label className="typeform-label">What position interests you?</label>
                      <select 
                        className="typeform-input typeform-select"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                      >
                        <option value="" disabled>Select a position</option>
                        {positions.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      
                      {formData.position === "Other" && (
                        <input 
                          type="text" 
                          className="typeform-input"
                          placeholder="Please specify your position"
                          value={formData.otherPosition}
                          onChange={(e) => setFormData({...formData, otherPosition: e.target.value})}
                        />
                      )}

                      <div className="upload-section">
                        <label className="typeform-label">Upload your resume</label>
                        {formData.resumeUrl ? (
                          <div className="upload-success-card">
                            <div className="upload-success-icon">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <path d="M9 15l2 2 4-4"/>
                              </svg>
                            </div>
                            <div className="upload-success-content">
                              <span className="upload-success-title">Resume uploaded</span>
                              <span className="upload-success-subtitle">Your file is ready for review</span>
                            </div>
                            <button 
                              className="upload-remove-btn"
                              onClick={() => setFormData({...formData, resumeUrl: ""})}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="upload-dropzone">
                            <div className="upload-dropzone-content">
                              <div className="upload-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="17,8 12,3 7,8"/>
                                  <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                              </div>
                              <div className="upload-text">
                                <span className="upload-primary-text">Drop your resume here</span>
                                <span className="upload-secondary-text">or click to browse</span>
                              </div>
                              <div className="upload-formats">
                                <span className="format-badge">PDF</span>
                                <span className="format-badge">DOC</span>
                                <span className="format-badge">DOCX</span>
                                <span className="format-size">up to 8MB</span>
                              </div>
                            </div>
                            <UploadButton
                              endpoint="resumeUploader"
                              onUploadBegin={() => setIsUploading(true)}
                              onClientUploadComplete={(res) => {
                                setIsUploading(false);
                                if (res?.[0]) {
                                  setFormData({...formData, resumeUrl: res[0].url});
                                }
                              }}
                              onUploadError={(error: Error) => {
                                setIsUploading(false);
                                alert(`ERROR! ${error.message}`);
                              }}
                              appearance={{
                                button: `upload-btn-hidden ${isUploading ? 'uploading' : ''}`,
                                allowedContent: "upload-hint-hidden"
                              }}
                              content={{
                                button: isUploading ? "" : "",
                                allowedContent: ""
                              }}
                            />
                            {isUploading && (
                              <div className="upload-loading">
                                <div className="upload-spinner"></div>
                                <span>Uploading...</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Toggle for submitting without resume */}
                        {!formData.resumeUrl && !isUploading && (
                          <div className="resume-toggle">
                            <label className="toggle-label">
                              <input 
                                type="checkbox"
                                checked={submitWithoutResume}
                                onChange={(e) => setSubmitWithoutResume(e.target.checked)}
                                className="toggle-input"
                              />
                              <span className="toggle-slider"></span>
                              <span className="toggle-text">Submit without resume</span>
                            </label>
                            {submitWithoutResume && (
                              <p className="toggle-hint">You can share your resume later via email</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="button-row">
                      <button className="nav-link-btn back-link" onClick={prevStep}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                      <button 
                        className="nav-link-btn continue-link" 
                        onClick={nextStep}
                        disabled={!canSubmit()}
                      >
                        Review Application
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 6 - Preview */}
                {step === 6 && (
                  <div className="form-step active">
                    <div className="step-content">
                      <label className="typeform-label">Review your application</label>
                      <div className="preview-card">
                        <div className="preview-section">
                          <span className="preview-label">Name</span>
                          <span className="preview-value">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="preview-section">
                          <span className="preview-label">Email</span>
                          <span className="preview-value">{formData.email}</span>
                        </div>
                        <div className="preview-section">
                          <span className="preview-label">Phone</span>
                          <span className="preview-value">{formData.phone}</span>
                        </div>
                        <div className="preview-section">
                          <span className="preview-label">Position</span>
                          <span className="preview-value">{formData.position === "Other" ? formData.otherPosition : formData.position}</span>
                        </div>
                        <div className="preview-section">
                          <span className="preview-label">Resume</span>
                          <span className="preview-value">
                            {formData.resumeUrl ? (
                              <span className="preview-status uploaded">Uploaded</span>
                            ) : (
                              <span className="preview-status pending">Will send later</span>
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="preview-hint">Please review your information before submitting</p>
                    </div>
                    <div className="button-row">
                      <button className="nav-link-btn back-link" onClick={prevStep}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                      </button>
                      <button 
                        className="nav-link-btn continue-link" 
                        onClick={nextStep}
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 7 - Thank You */}
                {step === 7 && (
                  <div className="form-step active success-step">
                    <div className="success-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <h2>Thank You!</h2>
                    <p className="step-description">
                      Your application has been received. Our team will review your profile and get back to you shortly.
                    </p>
                    <button className="typeform-btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
