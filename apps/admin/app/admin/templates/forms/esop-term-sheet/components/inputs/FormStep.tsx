"use client";

import React from "react";

interface FormStepProps {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
}

export function FormStep({ step, currentStep, title, children }: FormStepProps) {
  return (
    <div
      className={`term-form-step ${
        step === currentStep
          ? "active"
          : step < currentStep
          ? "completed"
          : "inactive"
      }`}
    >
      <div className="term-step-header">
        <div className="term-step-number">{step}</div>
        <h3 className="term-step-title">{title}</h3>
      </div>
      {step === currentStep && (
        <div className="term-step-content">{children}</div>
      )}
    </div>
  );
}
