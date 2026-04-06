"use client";

import React from "react";
import { AMBER } from "../../constants";

interface OpenItemProps {
  number: number;
  title: string;
  detail: string;
}

export function OpenItem({ number, title, detail }: OpenItemProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        backgroundColor: AMBER.bg,
        border: `1px solid ${AMBER.border}`,
        borderRadius: 6,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          color: AMBER.color,
          minWidth: 22,
        }}
      >
        #{number}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            color: AMBER.color,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 12,
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}
