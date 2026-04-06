"use client";

import React from "react";
import { FILTER_OPTIONS } from "../../constants";
import { QAFilter } from "../../types";

interface FilterBarProps {
  activeFilter: QAFilter;
  onFilterChange: (filter: QAFilter) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="lqa-filter-bar">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`lqa-filter-btn ${activeFilter === opt.value ? "active" : ""}`}
          onClick={() => onFilterChange(opt.value as QAFilter)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
