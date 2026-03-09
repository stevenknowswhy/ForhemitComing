"use client";

interface IntroStepProps {
  onContinue: () => void;
}

export function IntroStep({ onContinue }: IntroStepProps) {
  return (
    <div className="form-step active">
      <div className="step-content">
        <h2>Join Our Movement</h2>
        <p className="step-subtitle">Work That Matters</p>
        <p className="step-description">
          This isn&apos;t just a job. It&apos;s a mission. Every day, we&apos;re saving companies, individuals, families, and communities who depend on them. You&apos;re not managing assets. You&apos;re protecting livelihoods. That&apos;s work we do together.
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
