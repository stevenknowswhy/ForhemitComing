"use client";

import React from "react";

interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  required,
}: DateInputProps) {
  return (
    <div className="erm-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="erm-req">*</span>}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
