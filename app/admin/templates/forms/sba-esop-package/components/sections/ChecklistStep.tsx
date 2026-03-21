"use client";

import React, { useState } from "react";
import { ComplianceChecklist } from "../../types";
import { CHECKLIST_ITEMS } from "../../constants";

interface ChecklistStepProps {
  inputs: ComplianceChecklist;
  onUpdate: (key: keyof ComplianceChecklist, value: boolean) => void;
}

export function ChecklistStep({ inputs, onUpdate }: ChecklistStepProps) {
  const [showWarning, setShowWarning] = useState(false);

  const allChecked = Object.values(inputs).every(Boolean);

  const handleToggle = (key: keyof ComplianceChecklist) => {
    onUpdate(key, !inputs[key]);
    if (showWarning && !allChecked) {
      setShowWarning(false);
    }
  };

  const handleAttemptProceed = () => {
    if (!allChecked) {
      setShowWarning(true);
    }
  };

  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>SBA compliance checklist</h2>
        <p>
          All 10 items must be confirmed before the package can be generated. These
          are hard requirements for guaranty eligibility — do not submit with
          unchecked items.
        </p>
      </div>

      <div className="pkg-amber-box">
        <div className="pkg-box-label">Complete before proceeding</div>
        <p>
          The Stewardship Agreement must be reviewed by SBA district counsel before
          the loan application is submitted. Request a written non-affiliation
          determination under 13 CFR 121.301 before term sheet issuance. This
          protects the lender&apos;s guaranty eligibility and creates a safe harbor for
          the credit committee.
        </p>
      </div>

      <div className="pkg-checklist">
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`pkg-checklist-item ${inputs[item.key] ? "checked" : ""}`}
            onClick={() => handleToggle(item.key)}
          >
            <input
              type="checkbox"
              checked={inputs[item.key]}
              onChange={(e) => {
                // Prevent double-toggle by stopping the click from bubbling
                e.stopPropagation();
                handleToggle(item.key);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <label onClick={(e) => e.preventDefault()}>{item.label}</label>
          </div>
        ))}
      </div>

      {showWarning && (
        <div className="pkg-warning-box">
          <strong>All 10 items must be confirmed.</strong>
          Check each item to confirm it has been addressed before generating the
          package.
        </div>
      )}

      {/* Hidden button for step validation */}
      <button
        type="button"
        onClick={handleAttemptProceed}
        style={{ display: "none" }}
        id="checklist-validate-trigger"
      />
    </div>
  );
}
