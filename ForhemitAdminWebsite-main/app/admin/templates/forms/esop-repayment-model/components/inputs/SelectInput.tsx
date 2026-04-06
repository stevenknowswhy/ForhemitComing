"use client";

import React from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string | number;
  options: SelectOption[];
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
}

export function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
  required,
  hint,
}: SelectInputProps) {
  return (
    <div className="erm-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="erm-req">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <span className="erm-hint">{hint}</span>}
    </div>
  );
}
