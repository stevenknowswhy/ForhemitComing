"use client";

import React from "react";
import { STEPS } from "../../constants";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="erm-stepper-bar">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`erm-step-item ${
              currentStep === step.id
                ? "active"
                : currentStep > step.id
                ? "done"
                : ""
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <span className="erm-step-num">{step.id}</span>
            <span className="erm-step-label">{step.label}</span>
          </div>
          {index < STEPS.length - 1 && <div className="erm-step-sep" />}
        </React.Fragment>
      ))}
    </div>
  );
}
