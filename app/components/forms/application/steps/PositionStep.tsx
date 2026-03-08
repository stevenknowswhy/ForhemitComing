"use client";

import { ResumeUpload } from "../components/ResumeUpload";
import { POSITIONS } from "../types";

interface PositionStepProps {
  position: string;
  otherPosition: string;
  resumeUrl: string;
  submitWithoutResume: boolean;
  onPositionChange: (value: string) => void;
  onOtherPositionChange: (value: string) => void;
  onResumeUpload: (url: string) => void;
  onResumeRemove: () => void;
  onToggleWithoutResume: (checked: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
  canSubmit: boolean;
}

export function PositionStep({
  position,
  otherPosition,
  resumeUrl,
  submitWithoutResume,
  onPositionChange,
  onOtherPositionChange,
  onResumeUpload,
  onResumeRemove,
  onToggleWithoutResume,
  onContinue,
  onBack,
  canSubmit
}: PositionStepProps) {
  return (
    <div className="form-step active">
      <div className="step-content">
        <label className="typeform-label">What position interests you?</label>
        <select 
          className="typeform-input typeform-select"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
        >
          <option value="" disabled>Select a position</option>
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        
        {position === "Other" && (
          <input 
            type="text" 
            className="typeform-input"
            placeholder="Please specify your position"
            value={otherPosition}
            onChange={(e) => onOtherPositionChange(e.target.value)}
          />
        )}

        <div className="upload-section">
          <label className="typeform-label">Upload your resume</label>
          <ResumeUpload 
            resumeUrl={resumeUrl}
            onUpload={onResumeUpload}
            onRemove={onResumeRemove}
          />
          
          {!resumeUrl && (
            <div className="resume-toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox"
                  checked={submitWithoutResume}
                  onChange={(e) => onToggleWithoutResume(e.target.checked)}
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
        <button className="nav-link-btn back-link" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <button 
          className="nav-link-btn continue-link" 
          onClick={onContinue}
          disabled={!canSubmit}
        >
          Review Application
        </button>
      </div>
    </div>
  );
}
