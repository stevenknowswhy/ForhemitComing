"use client";

import React from "react";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
}: TextAreaProps) {
  return (
    <div className="pkg-field-group">
      <label className="pkg-field-label">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="pkg-textarea"
      />
      {hint && <div className="pkg-field-hint">{hint}</div>}
    </div>
  );
}
