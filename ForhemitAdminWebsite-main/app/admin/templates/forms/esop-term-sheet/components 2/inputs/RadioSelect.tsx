"use client";

import React from "react";

interface RadioOption {
  value: string | number;
  label: string;
  desc?: string;
}

interface RadioSelectProps {
  value: string | number;
  onChange: (v: string) => void;
  label: string;
  options: RadioOption[];
}

export function RadioSelect({
  value,
  onChange,
  label,
  options,
}: RadioSelectProps) {
  return (
    <div className="term-form-field">
      <label className="term-form-label">{label}</label>
      <div className="term-radio-group">
        {options.map((option) => (
          <label key={option.value} className="term-radio-option">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="term-radio-input"
            />
            <span className="term-radio-label">{option.label}</span>
            {option.desc && (
              <span className="term-radio-desc">{option.desc}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
