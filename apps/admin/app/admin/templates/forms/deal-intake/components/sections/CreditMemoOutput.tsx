"use client";

import React from "react";
import { CreditMemoData } from "../../types";
import { generateStructuredCreditMemo } from "../../lib/creditMemoData";

interface CreditMemoOutputProps {
  data: CreditMemoData;
  onBack: () => void;
}

function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  return <span className={`di-memo-badge ${status}`}>{status}</span>;
}

export function CreditMemoOutput({ data, onBack }: CreditMemoOutputProps) {
  const memo = generateStructuredCreditMemo({
    inputs: data.inputs,
    calculated: data.calculated,
    dscr: data.dscr,
    activeEbitda: data.activeEbitda,
  });

  return (
    <div className="di-memo-container">
      {/* Header */}
      <div className="di-memo-header">
        <div className="di-memo-header-actions">
          <div>
            <h1 className="di-memo-title">{memo.header.title}</h1>
            <p className="di-memo-subtitle">{memo.header.subtitle}</p>
            <p className="di-memo-disclaimer">{memo.header.disclaimer}</p>
          </div>
          <button className="di-memo-back-btn" onClick={onBack}>
            ← Back to Form
          </button>
        </div>
      </div>

      {/* Sections */}
      {memo.sections.map((section) => {
        const hasContent = section.rows.some((r) => r.value || r.label);
        if (!hasContent) return null;

        return (
          <div key={section.id} className="di-memo-section">
            <div className="di-memo-section-header">
              <h2 className="di-memo-section-title">{section.title}</h2>
            </div>
            <table className="di-memo-table">
              <tbody>
                {section.rows.map((row, idx) => {
                  if (!row.value && !row.label) return null;

                  const isHeader = /^[A-Z\s&]+$/.test(row.label);
                  const highlightClass = row.highlight
                    ? `highlight-${row.highlight}`
                    : "";
                  const indentClass = row.indent ? "indent" : "";

                  return (
                    <tr
                      key={idx}
                      className={`di-memo-row ${indentClass}`}
                    >
                      <td
                        className={`di-memo-label ${isHeader ? "bold" : ""}`}
                      >
                        {row.label}
                      </td>
                      <td className={`di-memo-value ${highlightClass}`}>
                        {row.value}
                        {row.highlight && <StatusBadge status={row.highlight} />}
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
      <div className="di-memo-footer">
        <p className="di-memo-footer-text">{memo.footer}</p>
      </div>

      <p className="di-memo-timestamp">
        Generated {new Date().toLocaleDateString()} at{" "}
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
