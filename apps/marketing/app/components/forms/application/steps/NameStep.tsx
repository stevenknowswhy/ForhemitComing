"use client";

interface NameStepProps {
  firstName: string;
  lastName: string;
  onChange: (field: "firstName" | "lastName", value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function NameStep({ firstName, lastName, onChange, onContinue, onBack, canProceed }: NameStepProps) {
  return (
    <div className="form-step active">
      <div className="step-content">
        <label className="typeform-label">What&apos;s your name?</label>
        <input 
          type="text" 
          className="typeform-input"
          placeholder="First name"
          autoFocus
          value={firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
        />
        <input 
          type="text" 
          className="typeform-input"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
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
