"use client";

import React from "react";
import { ThemeColor } from "../../types";

interface CalloutProps {
  theme: ThemeColor;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ theme, title, children }: CalloutProps) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 6,
        marginBottom: 16,
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: theme.color,
            marginBottom: 5,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 12,
          color: theme.color,
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </div>
  );
}
