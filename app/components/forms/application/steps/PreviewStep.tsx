"use client";

import { ApplicationData } from "../types";

interface PreviewStepProps {
  formData: ApplicationData;
  onSubmit: () => void;
  onBack: () => void;
}

export function PreviewStep({ formData, onSubmit, onBack }: PreviewStepProps) {
  const displayPosition = formData.position === "Other" 
    ? formData.otherPosition 
    : formData.position;

  return (
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
            <span className="preview-value">{displayPosition}</span>
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
        <button className="nav-link-btn back-link" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <button 
          className="nav-link-btn continue-link" 
          onClick={onSubmit}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
