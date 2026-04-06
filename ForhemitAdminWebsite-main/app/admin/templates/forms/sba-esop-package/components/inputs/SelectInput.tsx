"use client";

import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[] | string[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  required,
}: SelectInputProps) {
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className="pkg-field-group">
      <label className="pkg-field-label">
        {label}
        {required && <span className="pkg-req">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pkg-select"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <div className="pkg-field-hint">{hint}</div>}
    </div>
  );
}
