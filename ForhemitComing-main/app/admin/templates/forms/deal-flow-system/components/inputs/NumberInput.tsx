// ── NUMBER INPUT COMPONENT ───────────────────────────────────────────────────

import React from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  hint?: string;
  suffix?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  required = false,
  min,
  max,
  hint,
  suffix,
}: NumberInputProps) {
  return (
    <div className="dfs-field">
      <label className="dfs-label">
        {label}
        {required && <span className="dfs-required">*</span>}
      </label>
      <div className="dfs-input-wrap">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`dfs-input ${error ? "dfs-input-error" : ""}`}
        />
        {suffix && <span className="dfs-input-suffix">{suffix}</span>}
      </div>
      {hint && <span className="dfs-hint">{hint}</span>}
      {error && <span className="dfs-error">{error}</span>}
    </div>
  );
}
