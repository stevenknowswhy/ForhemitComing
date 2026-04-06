"use client";

import React from "react";
import { NAVY } from "../../constants";
import { Scenario } from "../../types";
import { fmt, pct } from "../../lib/formatters";

interface StackBarProps {
  scenario: Scenario;
}

export function StackBar({ scenario: S }: StackBarProps) {
  const segs = [
    { label: "SBA 7(a) Senior", value: S.sba, color: NAVY },
    { label: "ESOP Leveraged Loan", value: S.esop, color: "#2563eb" },
    { label: "Seller Note (standby)", value: S.note, color: "#94a3b8" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          height: 32,
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        {segs.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / S.total) * 100}%`,
              backgroundColor: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {s.value / S.total > 0.08 && (
              <span
                style={{
                  fontSize: 10,
                  color: "#fff",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                }}
              >
                {pct(s.value, S.total)}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {segs.map((s) => (
          <div
            key={s.label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: s.color,
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                color: "#374151",
              }}
            >
              {s.label}: {fmt(s.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
