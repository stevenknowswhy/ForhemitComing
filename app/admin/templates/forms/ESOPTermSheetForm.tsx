"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import type { TemplateFormHandle } from "../registry";

const ESOPTermSheetForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown> }
>(function ESOPTermSheetForm({ initialData }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [showTermSheet, setShowTermSheet] = useState(false);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({}),
    getContainerRef: () => containerRef.current,
  }));

  return (
    <div ref={containerRef} className="term-form-container">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Mono:wght@400;500;600&display=swap');`}</style>
      {!showTermSheet ? (
        <div className="term-form-wrapper">
          <div className="term-form-header">
            <h2 className="term-form-title">ESOP Term Sheet Calculator</h2>
            <p className="term-form-subtitle">
              Enter your deal details to generate a customized term sheet with SBA-compliant calculations
            </p>
          </div>
          <div>Test Form Content</div>
        </div>
      ) : (
        <div>
          <div className="term-header">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#7dd3fc", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
                  Presented by
                </div>
                <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 21, fontWeight: 700, marginBottom: 3 }}>
                  Forhemit Stewardship Management Co.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 2 }}>
                  Customized Term Sheet
                </div>
                <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 24, fontWeight: 700 }}>
                  $10,000,000
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ESOPTermSheetForm;