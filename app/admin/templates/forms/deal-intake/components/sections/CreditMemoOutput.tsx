"use client";

import React from "react";
import { CreditMemoData } from "../../types";
import { generateStructuredCreditMemo } from "../../lib/creditMemoData";

interface CreditMemoOutputProps {
  data: CreditMemoData;
  onBack: () => void;
}

export function CreditMemoOutput({ data, onBack }: CreditMemoOutputProps) {
  const memo = generateStructuredCreditMemo({
    inputs: data.inputs,
    calculated: data.calculated,
    dscr: data.dscr,
    activeEbitda: data.activeEbitda,
  });

  const containerStyle: React.CSSProperties = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px",
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: "#fafafa",
    minHeight: "100vh",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "28px 32px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "24px",
    borderLeft: "6px solid #1e3a5f",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px 0",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#334155",
    margin: "0 0 8px 0",
  };

  const disclaimerStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "24px",
    overflow: "hidden",
  };

  const cardHeaderStyle: React.CSSProperties = {
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse" as const,
  };

  const rowStyle: React.CSSProperties = {
    borderBottom: "1px solid #e2e8f0",
  };

  const rowAlternateStyle: React.CSSProperties = {
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  };

  const labelCellStyle: React.CSSProperties = {
    padding: "16px 24px",
    width: "45%",
    fontSize: "15px",
    color: "#475569",
    fontWeight: 500,
    verticalAlign: "top" as const,
  };

  const labelBoldStyle: React.CSSProperties = {
    padding: "16px 24px",
    width: "45%",
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
    verticalAlign: "top" as const,
  };

  const valueCellStyle: React.CSSProperties = {
    padding: "16px 24px",
    fontSize: "16px",
    color: "#0f172a",
    fontWeight: 600,
    verticalAlign: "top" as const,
    textAlign: "right" as const,
  };

  const valueMonoStyle: React.CSSProperties = {
    padding: "16px 24px",
    fontSize: "18px",
    color: "#0f172a",
    fontWeight: 700,
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
    verticalAlign: "top" as const,
    textAlign: "right" as const,
  };

  const badgePassStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "6px",
    marginLeft: "12px",
    border: "1px solid #86efac",
  };

  const badgeFailStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "6px",
    marginLeft: "12px",
    border: "1px solid #fca5a5",
  };

  const badgeWarnStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "6px",
    marginLeft: "12px",
    border: "1px solid #fcd34d",
  };

  const badgePendingStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "6px",
    marginLeft: "12px",
    border: "1px solid #cbd5e1",
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#fef9c3",
    border: "2px solid #eab308",
    borderRadius: "12px",
    padding: "24px",
    marginTop: "32px",
  };

  const footerTextStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 700,
    color: "#854d0e",
    margin: 0,
    textAlign: "center" as const,
    lineHeight: 1.6,
  };

  const timestampStyle: React.CSSProperties = {
    textAlign: "center" as const,
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "20px",
    fontWeight: 500,
  };

  const backButtonStyle: React.CSSProperties = {
    padding: "12px 24px",
    backgroundColor: "#ffffff",
    border: "2px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    color: "#334155",
  };

  const getBadge = (highlight?: string) => {
    if (highlight === "good") return <span style={badgePassStyle}>PASS</span>;
    if (highlight === "danger") return <span style={badgeFailStyle}>FAIL</span>;
    if (highlight === "warn") return <span style={badgeWarnStyle}>CAUTION</span>;
    if (highlight === "neutral") return <span style={badgePendingStyle}>PENDING</span>;
    return null;
  };

  const isMonospaceValue = (value: string) => {
    return value.startsWith("$") || value.includes("x") || /^[\d.]+%$/.test(value);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={titleStyle}>{memo.header.title}</h1>
            <p style={subtitleStyle}>{memo.header.subtitle}</p>
            <p style={disclaimerStyle}>{memo.header.disclaimer}</p>
          </div>
          <button style={backButtonStyle} onClick={onBack}>
            ← Back to Form
          </button>
        </div>
      </div>

      {/* Sections */}
      {memo.sections.map((section, sectionIdx) => {
        const hasContent = section.rows.some(r => r.value || r.label);
        if (!hasContent) return null;

        return (
          <div key={section.id} style={cardStyle}>
            <div style={cardHeaderStyle}>{section.title}</div>
            <table style={tableStyle}>
              <tbody>
                {section.rows.map((row, idx) => {
                  if (!row.value && !row.label) return null;

                  const isHeader = /^[A-Z\s&]+$/.test(row.label);
                  const isMonospace = isMonospaceValue(row.value);
                  const rowStyleToUse = idx % 2 === 0 ? rowStyle : rowAlternateStyle;

                  return (
                    <tr key={idx} style={rowStyleToUse}>
                      <td style={isHeader ? labelBoldStyle : labelCellStyle}>
                        {row.label}
                      </td>
                      <td style={isMonospace ? valueMonoStyle : valueCellStyle}>
                        {row.value}
                        {getBadge(row.highlight)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Footer */}
      <div style={footerStyle}>
        <p style={footerTextStyle}>{memo.footer}</p>
      </div>

      <p style={timestampStyle}>
        Generated {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
