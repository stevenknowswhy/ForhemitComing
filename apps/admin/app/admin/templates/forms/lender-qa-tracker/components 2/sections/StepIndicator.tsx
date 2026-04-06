"use client";

import React from "react";
import { STEPS } from "../../constants";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  hasErrors?: boolean;
}

export function StepIndicator({ currentStep, onStepClick, hasErrors }: StepIndicatorProps) {
  return (
    <div className="lqa-stepper-wrap">
      <div className="lqa-stepper">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          const showError = hasErrors && step.id === 1 && !isDone;

          return (
            <button
              key={step.id}
              className={`lqa-step-tab ${isActive ? "active" : ""} ${isDone ? "done" : ""} ${showError ? "error" : ""}`}
              onClick={() => onStepClick(step.id)}
            >
              <span className="lqa-step-num">{step.num}</span>
              {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
