// ── CHECKBOX COMPONENT ───────────────────────────────────────────────────────

import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="dfs-checkbox-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="dfs-checkbox"
      />
      <span>{label}</span>
    </label>
  );
}
