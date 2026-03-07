"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { UploadButton } from "@/utils/uploadthing";
import "./page.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showEmailInput, setShowEmailInput] = useState(false);
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

  const positions = [
    "Investment Analyst",
    "Portfolio Manager",
    "Operations Director",
    "Legal Counsel",
    "Business Development",
    "Other"
  ];

  const totalSteps = 5;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData({ firstName: "", lastName: "", phone: "", email: "", position: "", otherPosition: "", resumeUrl: "" });
    setIsUploading(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && step >= 2 && step <= 4) {
      e.preventDefault();
      nextStep();
    }
  }, [step]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, handleKeyDown]);

  const canProceed = () => {
    switch (step) {
      case 2: return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0;
      case 3: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 4: return formData.phone.trim().length >= 10;
      case 5: return formData.position && (formData.position !== "Other" || formData.otherPosition.trim());
      default: return true;
    }
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
          <div className="logo-wrapper">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" id="logo">
              <rect width="100" height="100" rx="20" fill="url(#logo-gradient)"/>
              <path d="M35 75V25H65V35H45V45H60V55H45V75H35Z" fill="white"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6B00"/>
                  <stop offset="1" stopColor="#FF3D00"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
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
                  <input 
                    type="email" 
                    id="email-input" 
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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

      {/* Modal Overlay */}
      {showModal && (
        <div id="modal-overlay" className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            
            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
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
                      <input 
                        type="tel" 
                        className="typeform-input"
                        placeholder="+1 (555) 000-0000"
                        autoFocus
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                          <div className="upload-success">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            <span>Resume uploaded successfully</span>
                          </div>
                        ) : (
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
                              button: `upload-btn ${isUploading ? 'uploading' : ''}`,
                              allowedContent: "upload-hint"
                            }}
                            content={{
                              button: isUploading ? "Uploading..." : "Choose file",
                              allowedContent: "PDF, DOC, DOCX up to 8MB"
                            }}
                          />
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
                        disabled={!canProceed() || !formData.resumeUrl}
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 6 - Thank You */}
                {step === 6 && (
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
