// ── TEXT INPUT COMPONENT ─────────────────────────────────────────────────────

import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "date" | "datetime-local";
  hint?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  required = false,
  type = "text",
  hint,
}: TextInputProps) {
  return (
    <div className="dfs-field">
      <label className="dfs-label">
        {label}
        {required && <span className="dfs-required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`dfs-input ${error ? "dfs-input-error" : ""}`}
      />
      {hint && <span className="dfs-hint">{hint}</span>}
      {error && <span className="dfs-error">{error}</span>}
    </div>
  );
}
