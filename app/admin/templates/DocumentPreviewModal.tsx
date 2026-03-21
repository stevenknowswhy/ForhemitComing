"use client";

import React, { useRef, useState, useCallback, Suspense, lazy, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getFormEntry, type TemplateFormHandle } from "./registry";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: Id<"documentTemplates"> | null;
  templateName: string;
  /** formKey from the Convex template record — determines which form to render */
  formKey?: string;
  initialFormData?: Record<string, unknown>;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  templateId,
  templateName,
  formKey,
  initialFormData,
}: DocumentPreviewModalProps) {
  const formRef = useRef<TemplateFormHandle>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const logGeneration = useMutation(api.generatedDocuments.create);

  // Dynamically resolve the form component from the registry
  const FormComponent = useMemo(() => {
    if (!formKey) return null;
    const entry = getFormEntry(formKey);
    if (!entry) return null;
    return lazy(entry.component);
  }, [formKey]);

  const handleDownloadPDF = useCallback(async () => {
    if (!formRef.current || !templateId) return;
    setIsGenerating(true);

    try {
      const container = formRef.current.getContainerRef();
      if (!container) return;

      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      const pageHeight = pdfHeight;
      const totalPages = Math.ceil(scaledHeight / pageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -(i * pageHeight),
          scaledWidth,
          scaledHeight
        );
      }

      // Use the registry label for the filename
      const entry = formKey ? getFormEntry(formKey) : null;
      const prefix = entry?.label?.replace(/\s+/g, "-") ?? "Document";
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`${prefix}_${timestamp}.pdf`);

      const formData = formRef.current.getFormData();
      await logGeneration({
        templateId,
        templateName,
        formData: JSON.stringify(formData),
        action: "pdf-download",
        generatedBy: "admin",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [templateId, templateName, formKey, logGeneration]);

  const handlePrint = useCallback(async () => {
    if (!formRef.current || !templateId) return;
    const formData = formRef.current.getFormData();
    await logGeneration({
      templateId,
      templateName,
      formData: JSON.stringify(formData),
      action: "print",
      generatedBy: "admin",
    });
    window.print();
  }, [templateId, templateName, logGeneration]);

  if (!isOpen) return null;

  return (
    <div className="template-modal-overlay" onClick={onClose}>
      <div
        className="template-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="template-modal-header">
          <h2 className="template-modal-title">{templateName}</h2>
          <div className="template-modal-actions">
            <button
              type="button"
              className="template-action-btn template-action-print"
              onClick={handlePrint}
            >
              🖨️ Print
            </button>
            <button
              type="button"
              className="template-action-btn template-action-pdf"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="template-spinner" />
                  Generating…
                </>
              ) : (
                "📄 Download PDF"
              )}
            </button>
            <button
              type="button"
              className="template-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Content — dynamically loaded from registry */}
        <div className="template-modal-body">
          {FormComponent ? (
            <Suspense
              fallback={
                <div className="templates-loading">Loading form…</div>
              }
            >
              <FormComponent
                ref={formRef}
                initialData={initialFormData}
              />
            </Suspense>
          ) : (
            <div className="templates-loading">
              No form registered for template key: <code>{formKey}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
