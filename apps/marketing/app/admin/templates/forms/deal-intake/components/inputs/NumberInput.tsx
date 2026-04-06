"use client";

import React from "react";

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  hint?: string;
}

export function NumberInput({
  value,
  onChange,
  label,
  placeholder = "",
  prefix,
  suffix,
  min,
  max,
  step,
  error,
  hint,
}: NumberInputProps) {
  return (
    <div className="di-field">
      <label className="di-label">{label}</label>
      <div className="di-input-wrap">
        {prefix && <span className="di-prefix">{prefix}</span>}
        <input
          type="number"
          className={`di-input ${prefix ? "di-input-prefixed" : ""} ${
            suffix ? "di-input-suffixed" : ""
          } ${error ? "di-input-error" : ""}`}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
        {suffix && <span className="di-suffix">{suffix}</span>}
      </div>
      {hint && <span className="di-hint">{hint}</span>}
      {error && <span className="di-error">{error}</span>}
    </div>
  );
}
