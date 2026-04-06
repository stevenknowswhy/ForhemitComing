"use client";

import { TOTAL_STEPS } from "../types";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-step">Step {currentStep} of {TOTAL_STEPS}</span>
        <span className="progress-percent">{progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-dots">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div 
            key={i} 
            className={`progress-dot ${i + 1 <= currentStep ? 'active' : ''} ${i + 1 === currentStep ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
