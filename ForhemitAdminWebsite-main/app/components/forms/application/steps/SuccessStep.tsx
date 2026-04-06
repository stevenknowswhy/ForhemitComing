"use client";

interface SuccessStepProps {
  onClose: () => void;
}

export function SuccessStep({ onClose }: SuccessStepProps) {
  return (
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
      <button className="typeform-btn btn-secondary" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
