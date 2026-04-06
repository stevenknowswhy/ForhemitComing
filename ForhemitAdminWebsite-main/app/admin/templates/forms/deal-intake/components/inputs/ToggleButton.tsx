"use client";

import React from "react";

interface ToggleOption {
  value: string;
  label: string;
  description?: string;
}

interface ToggleButtonProps {
  value: string;
  onChange: (v: string) => void;
  options: ToggleOption[];
  label?: string;
}

export function ToggleButton({
  value,
  onChange,
  options,
  label,
}: ToggleButtonProps) {
  return (
    <div className="di-field">
      {label && <label className="di-label">{label}</label>}
      <div className="di-toggle-row">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`di-toggle-btn ${value === opt.value ? "selected" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <strong>{opt.label}</strong>
            {opt.description && <span>{opt.description}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
