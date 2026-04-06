"use client";

import React from "react";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  type?: "text" | "email";
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  hint,
  type = "text",
}: TextInputProps) {
  const hasError = !!error;

  return (
    <div className={`lqa-field ${hasError ? "has-error" : ""}`} id={`f-${id}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="lqa-req">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={hasError ? "invalid" : value ? "valid" : ""}
      />
      {hasError && <span className="lqa-validation-icon error">!</span>}
      {!hasError && value && <span className="lqa-validation-icon check">✓</span>}
      {hint && !hasError && <span className="lqa-hint">{hint}</span>}
      {hasError && <span className="lqa-error-msg">{error}</span>}
    </div>
  );
}
