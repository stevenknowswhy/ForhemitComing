"use client";

import React from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  min?: number;
  step?: number;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  hint,
  min = 0,
  step = 0.01,
}: NumberInputProps) {
  const hasError = !!error;

  return (
    <div className={`lqa-field ${hasError ? "has-error" : ""}`} id={`f-${id}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="lqa-req">*</span>}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        min={min}
        step={step}
        className={hasError ? "invalid" : value ? "valid" : ""}
      />
      {hasError && <span className="lqa-validation-icon error">!</span>}
      {!hasError && value && <span className="lqa-validation-icon check">✓</span>}
      {hint && <span className={`lqa-hint ${hasError ? "error" : ""}`}>{hint}</span>}
      {hasError && <span className="lqa-error-msg">{error}</span>}
    </div>
  );
}
