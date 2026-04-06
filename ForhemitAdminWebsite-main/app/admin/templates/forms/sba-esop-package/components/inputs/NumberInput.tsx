"use client";

import React from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  min?: number;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  min = 0,
}: NumberInputProps) {
  return (
    <div className="pkg-field-group">
      <label className="pkg-field-label">
        {label}
        {required && <span className="pkg-req">*</span>}
      </label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        min={min}
        className={`pkg-input ${error ? "pkg-input-error" : ""}`}
      />
      {hint && <div className="pkg-field-hint">{hint}</div>}
      {error && <div className="pkg-field-error">{error}</div>}
    </div>
  );
}
