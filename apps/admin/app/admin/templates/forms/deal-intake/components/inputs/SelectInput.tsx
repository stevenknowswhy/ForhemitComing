"use client";

import React from "react";

interface SelectInputProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
  placeholder?: string;
}

export function SelectInput({
  value,
  onChange,
  label,
  options,
  placeholder = "Select...",
}: SelectInputProps) {
  return (
    <div className="di-field">
      <label className="di-label">{label}</label>
      <select
        className="di-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
