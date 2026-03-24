"use client";

import React from "react";

interface NumInputProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function NumInput({
  value,
  onChange,
  label,
  prefix = "$",
  suffix = "",
  placeholder = "",
}: NumInputProps) {
  return (
    <div className="term-form-field">
      <label className="term-form-label">{label}</label>
      <div className="term-input-wrapper">
        {prefix && <span className="term-input-prefix">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          className="term-form-input"
          value={value}
          onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
          placeholder={placeholder}
        />
        {suffix && <span className="term-input-suffix">{suffix}</span>}
      </div>
    </div>
  );
}
