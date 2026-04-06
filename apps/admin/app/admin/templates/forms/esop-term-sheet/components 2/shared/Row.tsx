"use client";

import React from "react";

interface RowProps {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  bold?: boolean;
  indent?: boolean;
  sub?: boolean;
  note?: string;
  highlight?: boolean;
}

export function Row({
  label,
  value,
  bold,
  indent,
  sub,
  note,
  highlight,
}: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "5px 0",
        paddingLeft: indent ? 16 : 0,
        borderBottom: "1px solid #f3f4f6",
        backgroundColor: highlight ? "#f0f9ff" : "transparent",
      }}
    >
      <div style={{ maxWidth: "63%" }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: bold ? 700 : 400,
            color: bold ? "#0f172a" : sub ? "#9ca3af" : "#374151",
            fontStyle: sub ? "italic" : "normal",
          }}
        >
          {label}
        </div>
        {note && (
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 11,
              color: "#6b7280",
              lineHeight: 1.4,
              marginTop: 2,
            }}
          >
            {note}
          </div>
        )}
      </div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          fontWeight: bold ? 700 : 400,
          color: bold ? "#0f172a" : "#374151",
          textAlign: "right",
          minWidth: 130,
        }}
      >
        {value}
      </div>
    </div>
  );
}
