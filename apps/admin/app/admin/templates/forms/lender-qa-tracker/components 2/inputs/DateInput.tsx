"use client";

import React from "react";

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  required,
  error,
  hint,
}: DateInputProps) {
  const hasError = !!error;

  return (
    <div className={`lqa-field ${hasError ? "has-error" : ""}`} id={`f-${id}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="lqa-req">*</span>}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? "invalid" : value ? "valid" : ""}
      />
      {hint && <span className={`lqa-hint ${hasError ? "error" : ""}`}>{hint}</span>}
      {hasError && <span className="lqa-error-msg">{error}</span>}
    </div>
  );
}
