"use client";

import React from "react";
import { ValidationError } from "../../types";

interface ValidationSummaryProps {
  errors: ValidationError[];
}

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="lqa-validation-summary show">
      <h4>Please correct the following errors:</h4>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}
