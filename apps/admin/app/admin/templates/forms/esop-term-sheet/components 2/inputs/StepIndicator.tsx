"use client";

import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { number: 1, label: "Deal Basics" },
  { number: 2, label: "Financing" },
  { number: 3, label: "Costs" },
  { number: 4, label: "Review" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="term-progress">
      {STEPS.map((step) => (
        <div
          key={step.number}
          className={`term-progress-step ${
            step.number <= currentStep ? "completed" : ""
          } ${step.number === currentStep ? "active" : ""}`}
        >
          <span className="term-progress-number">{step.number}</span>
          <span className="term-progress-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
