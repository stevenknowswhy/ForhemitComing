"use client";

import React from "react";
import { STEPS } from "../../constants";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="pkg-step-indicator">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div
            key={step.id}
            className={`pkg-step-item ${isActive ? "active" : ""} ${
              isCompleted ? "completed" : ""
            } ${isClickable ? "clickable" : ""}`}
            onClick={() => isClickable && onStepClick!(index)}
          >
            <div className="pkg-step-dot">
              {isCompleted ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span className="pkg-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
