"use client";

import React from "react";
import { NAVY } from "../../constants";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  accent?: string;
}

export function Section({ title, children, accent }: SectionProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          borderBottom: `2px solid ${accent || NAVY}`,
          paddingBottom: 5,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accent || NAVY,
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
