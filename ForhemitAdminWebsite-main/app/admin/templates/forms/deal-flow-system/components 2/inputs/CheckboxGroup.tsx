// ── CHECKBOX GROUP COMPONENT ─────────────────────────────────────────────────

import React from "react";

interface CheckboxOption {
  key: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: 1 | 2 | 3;
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  columns = 1,
}: CheckboxGroupProps) {
  const toggleOption = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className={`dfs-checkbox-group dfs-cols-${columns}`}>
      {options.map((opt) => (
        <label key={opt.key} className="dfs-checkbox-label">
          <input
            type="checkbox"
            checked={selected.includes(opt.key)}
            onChange={() => toggleOption(opt.key)}
            className="dfs-checkbox"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
