// ── SELECT INPUT COMPONENT ───────────────────────────────────────────────────

import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  required = false,
}: SelectInputProps) {
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className="dfs-field">
      <label className="dfs-label">
        {label}
        {required && <span className="dfs-required">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`dfs-select ${error ? "dfs-input-error" : ""}`}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="dfs-error">{error}</span>}
    </div>
  );
}
