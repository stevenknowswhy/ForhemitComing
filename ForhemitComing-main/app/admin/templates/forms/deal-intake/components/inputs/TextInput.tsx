"use client";

import React from "react";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
}

export function TextInput({
  value,
  onChange,
  label,
  placeholder = "",
  error,
}: TextInputProps) {
  return (
    <div className="di-field">
      <label className="di-label">{label}</label>
      <input
        type="text"
        className={`di-input ${error ? "di-input-error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="di-error">{error}</span>}
    </div>
  );
}
