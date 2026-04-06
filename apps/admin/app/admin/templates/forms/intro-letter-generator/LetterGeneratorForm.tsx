"use client";

import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { TemplateFormHandle } from "../../registry";
import { useLetterGenerator } from "./hooks/useLetterGenerator";
import {
  RecipientTabs,
  ContactInfoSection,
  SenderInfoSection,
  CompanyInfoSection,
  LetterPreview,
} from "./components/sections";

const LetterGeneratorForm = forwardRef<TemplateFormHandle, { initialData?: Record<string, unknown> }>(
  function LetterGeneratorForm({ initialData }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      inputs,
      renderedLetter,
      setRecipientType,
      updateContactField,
      updateSenderField,
      updateCompanyField,
      resetForm,
    } = useLetterGenerator(initialData as unknown as Partial<typeof inputs>);

    // Imperative handle for PDF generation
    useImperativeHandle(
      ref,
      () => ({
        getFormData: () => inputs as unknown as Record<string, unknown>,
        getContainerRef: () => containerRef.current,
      }),
      [inputs]
    );

    return (
      <div className="ilg-container" ref={containerRef}>
        {/* Top Bar */}
        <div className="ilg-topbar">
          <div className="ilg-topbar-brand">
            Forhemit <span>Letter Generator</span>
          </div>
          <div className="ilg-topbar-actions">
            <button className="ilg-btn-reset" onClick={resetForm}>
              ↺ Reset
            </button>
            <button className="ilg-btn-pdf" onClick={() => window.print()}>
              ⬇ Print / Save PDF
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="ilg-workspace">
          {/* Sidebar */}
          <div className="ilg-sidebar">
            {/* Recipient Type */}
            <div>
              <div className="ilg-section-label">Recipient Type</div>
              <RecipientTabs
                activeType={inputs.recipientType}
                onTypeChange={setRecipientType}
              />
            </div>

            {/* Contact Info */}
            <div>
              <div className="ilg-section-label">Contact Info</div>
              <ContactInfoSection contact={inputs.contact} onUpdateField={updateContactField} />
            </div>

            {/* Your Info */}
            <div>
              <div className="ilg-section-label">Your Details</div>
              <SenderInfoSection sender={inputs.sender} onUpdateField={updateSenderField} />
            </div>

            {/* Company Info */}
            <div>
              <div className="ilg-section-label">Forhemit Details</div>
              <CompanyInfoSection
                company={inputs.company}
                onUpdateField={updateCompanyField}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="ilg-preview-panel">
            <LetterPreview letter={renderedLetter} />
          </div>
        </div>
      </div>
    );
  }
);

export default LetterGeneratorForm;
export { LetterGeneratorForm };
