"use client";

import React from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  error?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
  step,
  hint,
  error,
}: NumberInputProps) {
  return (
    <div className="erm-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="erm-req">*</span>}
      </label>
      <input
        type="number"
        id={id}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      {hint && <span className="erm-hint">{hint}</span>}
      {error && <span className="erm-error">{error}</span>}
    </div>
  );
}
