"use client";

import React from "react";
import { RecipientType } from "../../types";
import { RECIPIENT_OPTIONS } from "../../constants";

interface RecipientTabsProps {
  activeType: RecipientType;
  onTypeChange: (type: RecipientType) => void;
}

export function RecipientTabs({ activeType, onTypeChange }: RecipientTabsProps) {
  return (
    <div className="ilg-recipient-tabs">
      {RECIPIENT_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`ilg-tab-btn ${activeType === option.value ? "active" : ""}`}
          onClick={() => onTypeChange(option.value)}
        >
          <span className="ilg-tab-indicator" />
          {option.label}
        </button>
      ))}
    </div>
  );
}
