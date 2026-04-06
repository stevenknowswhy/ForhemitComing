"use client";

interface EmailStepProps {
  email: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function EmailStep({ email, onChange, onContinue, onBack, canProceed }: EmailStepProps) {
  return (
    <div className="form-step active">
      <div className="step-content">
        <label className="typeform-label">What&apos;s your email address?</label>
        <input 
          type="email" 
          className="typeform-input"
          placeholder="john@example.com"
          autoFocus
          value={email}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="hint">Press Enter to continue</p>
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
          disabled={!canProceed}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
