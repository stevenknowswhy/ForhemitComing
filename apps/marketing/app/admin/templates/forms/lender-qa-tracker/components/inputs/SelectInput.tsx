"use client";

import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  hint?: string;
}

export function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  required,
  error,
  hint,
}: SelectInputProps) {
  const hasError = !!error;

  return (
    <div className={`lqa-field ${hasError ? "has-error" : ""}`} id={`f-${id}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="lqa-req">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? "invalid" : value ? "valid" : ""}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <span className="lqa-hint">{hint}</span>}
      {hasError && <span className="lqa-error-msg">{error}</span>}
    </div>
  );
}
