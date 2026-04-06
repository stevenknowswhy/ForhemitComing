"use client";

import React from "react";
import { STEPS } from "../../constants";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="di-step-bar">
      {STEPS.map((step, index) => (
        <div
          key={step.id}
          className={`di-step-pill ${
            index === currentStep ? "active" : index < currentStep ? "done" : ""
          }`}
          onClick={() => onStepClick?.(index)}
          style={{ cursor: onStepClick ? "pointer" : "default" }}
        >
          <span className="di-step-num">{step.num}</span>
          {step.label}
        </div>
      ))}
    </div>
  );
}
