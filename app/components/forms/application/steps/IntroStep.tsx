"use client";

interface IntroStepProps {
  onContinue: () => void;
}

export function IntroStep({ onContinue }: IntroStepProps) {
  return (
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
        <button className="nav-link-btn continue-link" onClick={onContinue}>
          Let&apos;s begin
        </button>
      </div>
    </div>
  );
}
