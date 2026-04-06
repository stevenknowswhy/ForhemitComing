"use client";

import React from "react";
import { TARGET_DSCR } from "../../constants";

interface DSCRBarProps {
  label: string;
  value: number;
  color: string;
  max?: number;
}

export function DSCRBar({ label, value, color, max = 2.5 }: DSCRBarProps) {
  const width = Math.min((value / max) * 100, 100);
  const thPct = (TARGET_DSCR / max) * 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#374151",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color,
          }}
        >
          {value.toFixed(2)}x
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 8,
          backgroundColor: "#e5e7eb",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${width}%`,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -4,
            left: `${thPct}%`,
            width: 2,
            height: 16,
            backgroundColor: "#dc2626",
            transform: "translateX(-50%)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 14,
            left: `${thPct}%`,
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "#dc2626",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "nowrap",
          }}
        >
          {TARGET_DSCR}x min
        </span>
      </div>
    </div>
  );
}
