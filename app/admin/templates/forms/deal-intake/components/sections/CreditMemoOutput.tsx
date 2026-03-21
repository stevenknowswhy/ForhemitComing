"use client";

import React from "react";
import { CreditMemoData } from "../../types";
import { generateCreditMemo } from "../../lib/creditMemo";

interface CreditMemoOutputProps {
  data: CreditMemoData;
  onBack: () => void;
}

export function CreditMemoOutput({ data, onBack }: CreditMemoOutputProps) {
  const memoText = generateCreditMemo({
    inputs: data.inputs,
    calculated: data.calculated,
    dscr: data.dscr,
    activeEbitda: data.activeEbitda,
  });

  return (
    <div className="di-output-area">
      <div className="di-output-header">
        <h2>Credit memo preview</h2>
        <button className="di-btn-back" onClick={onBack}>
          ← Back to form
        </button>
      </div>
      <pre className="di-output-text">{memoText}</pre>
    </div>
  );
}
