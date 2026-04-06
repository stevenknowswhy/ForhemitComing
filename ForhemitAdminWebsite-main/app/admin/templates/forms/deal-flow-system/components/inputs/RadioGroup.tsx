// ── RADIO GROUP COMPONENT ────────────────────────────────────────────────────

import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: (string | RadioOption)[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  columns = 1,
}: RadioGroupProps) {
  const normalizedOptions: RadioOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`dfs-radio-group dfs-cols-${columns}`}>
      {normalizedOptions.map((opt) => (
        <label key={opt.value} className="dfs-radio-label">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="dfs-radio"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
