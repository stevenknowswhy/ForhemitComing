"use client";

import React from "react";

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  rows = 3,
}: TextAreaProps) {
  const hasError = !!error;

  return (
    <div className={`lqa-field ${hasError ? "has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="lqa-req">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={hasError ? "invalid" : value ? "valid" : ""}
      />
      {hint && <span className="lqa-hint">{hint}</span>}
      {hasError && <span className="lqa-error-msg">{error}</span>}
    </div>
  );
}
