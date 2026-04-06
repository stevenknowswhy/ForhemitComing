"use client";

import React from "react";
import { DealInputs, OpenItem } from "../../types";

interface OpenItemsStepProps {
  inputs: DealInputs;
  onUpdateOpenItem: (index: number, resolved: boolean) => void;
  onUpdateNotes: (notes: string) => void;
}

export function OpenItemsStep({
  inputs,
  onUpdateOpenItem,
  onUpdateNotes,
}: OpenItemsStepProps) {
  const { openItems, lenderNotes } = inputs;

  return (
    <div className="di-step-content">
      <div className="di-section-label">Open items & notes</div>

      <p className="di-intro-text">
        Check off items resolved before submitting to a lender. Unresolved items
        will be flagged in the credit memo output.
      </p>

      <div className="di-open-items-list">
        {openItems.map((item, index) => (
          <div key={index} className="di-open-item">
            <div
              className={`di-open-item-dot ${item.resolved ? "checked" : ""}`}
              onClick={() => onUpdateOpenItem(index, !item.resolved)}
            >
              {item.resolved ? "✓" : ""}
            </div>
            <div>
              <div className="di-open-item-title">{item.title}</div>
              <div className="di-open-item-desc">{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="di-field" style={{ marginTop: "1.5rem" }}>
        <label className="di-label">Additional notes for lender</label>
        <textarea
          className="di-textarea"
          value={lenderNotes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Any additional context, qualifications, or deal-specific notes to include in the credit memo..."
          rows={4}
        />
      </div>
    </div>
  );
}
