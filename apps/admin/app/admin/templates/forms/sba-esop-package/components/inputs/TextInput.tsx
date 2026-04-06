"use client";

import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "date";
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  type = "text",
}: TextInputProps) {
  return (
    <div className="pkg-field-group">
      <label className="pkg-field-label">
        {label}
        {required && <span className="pkg-req">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pkg-input ${error ? "pkg-input-error" : ""}`}
      />
      {hint && <div className="pkg-field-hint">{hint}</div>}
      {error && <div className="pkg-field-error">{error}</div>}
    </div>
  );
}
