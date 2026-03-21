"use client";

import React from "react";
import { CreditMemoData } from "../../types";
import { generateStructuredCreditMemo } from "../../lib/creditMemoData";

interface CreditMemoOutputProps {
  data: CreditMemoData;
  onBack: () => void;
}

function HighlightBadge({
  highlight,
}: {
  highlight: "good" | "warn" | "danger" | "neutral";
}) {
  const styles = {
    good: {
      background: "#eaf3de",
      color: "#3b6d11",
      border: "1px solid #c4e0a0",
    },
    warn: {
      background: "#fef6e6",
      color: "#92400e",
      border: "1px solid #fcd34d",
    },
    danger: {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    },
    neutral: {
      background: "#f5f5f4",
      color: "#57534e",
      border: "1px solid #d6d3d1",
    },
  };

  const labels = {
    good: "PASS",
    warn: "CAUTION",
    danger: "FAIL",
    neutral: "PENDING",
  };

  return (
    <span
      style={{
        ...styles[highlight],
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginLeft: "8px",
      }}
    >
      {labels[highlight]}
    </span>
  );
}

export function CreditMemoOutput({ data, onBack }: CreditMemoOutputProps) {
  const memo = generateStructuredCreditMemo({
    inputs: data.inputs,
    calculated: data.calculated,
    dscr: data.dscr,
    activeEbitda: data.activeEbitda,
  });

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "2px solid #1e3a5f",
          paddingBottom: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1e3a5f",
                margin: "0 0 8px 0",
              }}
            >
              {memo.header.title}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#475569",
                margin: "0 0 4px 0",
                fontWeight: 500,
              }}
            >
              {memo.header.subtitle}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {memo.header.disclaimer}
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            ← Back to Form
          </button>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {memo.sections.map((section) => (
          <div
            key={section.id}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "12px 16px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1e3a5f",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {section.title}
              </h2>
            </div>
            <div style={{ padding: "8px 0" }}>
              {section.rows.map((row, idx) =>
                row.value || row.label ? (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      padding: "8px 16px",
                      borderBottom:
                        idx < section.rows.length - 1 ? "1px solid #f1f5f9" : "none",
                      marginLeft: row.indent ? "16px" : 0,
                    }}
                  >
                    <span
                      style={{
                        width: row.indent ? "200px" : "180px",
                        flexShrink: 0,
                        fontSize: "13px",
                        color: row.label ? "#64748b" : "transparent",
                        fontWeight: row.label.match(/^[A-Z\s]+$/) ? 600 : 400,
                      }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        color: row.highlight === "danger" ? "#b91c1c" : "#1e293b",
                        fontWeight: row.highlight ? 500 : 400,
                        fontFamily:
                          row.value.startsWith("$") || row.value.includes("x")
                            ? '"SF Mono", Monaco, monospace'
                            : "inherit",
                      }}
                    >
                      {row.value}
                      {row.highlight && <HighlightBadge highlight={row.highlight} />}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#fefce8",
          border: "1px solid #fde047",
          borderRadius: "8px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#713f12",
            margin: 0,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {memo.footer}
        </p>
      </div>

      {/* Generated timestamp */}
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#94a3b8",
          marginTop: "16px",
        }}
      >
        Generated {new Date().toLocaleDateString()} at{" "}
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
