"use client";

import React from "react";
import { Scenarios, Scenario } from "../../types";
import { fmt } from "../../lib/formatters";

interface ScenarioToggleProps {
  active: string;
  onChange: (id: string) => void;
  scenarios: Scenarios;
}

export function ScenarioToggle({ active, onChange, scenarios }: ScenarioToggleProps) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      {Object.values(scenarios).map((S: Scenario) => (
        <div
          key={S.id}
          onClick={() => onChange(S.id)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "14px 16px",
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.15s",
            border: `2px solid ${active === S.id ? S.color : "#e5e7eb"}`,
            backgroundColor: active === S.id ? S.bg : "#fff",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              color: S.color,
              marginBottom: 2,
            }}
          >
            {S.label}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#6b7280",
              marginBottom: 10,
            }}
          >
            {S.sub}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                Seller Cash
              </div>
              <div
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: S.color,
                }}
              >
                {fmt(S.sellerCash)}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: S.textColor,
                }}
              >
                {S.sellerCashPct}% of purchase price
              </div>
            </div>
            <div
              style={{
                borderLeft: `1px solid ${S.border}`,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                OCF DSCR
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#16a34a",
                }}
              >
                {S.dscr_ocf.toFixed(2)}x
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "#6b7280",
                }}
              >
                both metrics ≥ 1.25x
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
