"use client";

import React from "react";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: TextInputProps) {
  return (
    <div className="erm-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="erm-req">*</span>}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="erm-error">{error}</span>}
    </div>
  );
}
