"use client";

import React, { useRef, useState, useCallback, Suspense, lazy, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getFormEntry, type TemplateFormHandle } from "./registry";
import { exportToCSV, exportToJSON, exportToExcel } from "@/app/lib/export-utils";

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
  const [generationError, setGenerationError] = useState<string | null>(null);
  const logGeneration = useMutation(api.generatedDocuments.create);

  // Dynamically resolve the form component from the registry
  const FormComponent = useMemo(() => {
    if (!formKey) return null;
    const entry = getFormEntry(formKey);
    if (!entry) return null;
    return lazy(entry.component);
  }, [formKey]);

  // Detect if device is mobile
  const isMobileDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth < 768;
    const userAgent = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
    return width || userAgent;
  }, []);

  // Server-side PDF generation for mobile
  const generateServerSidePDF = useCallback(async (): Promise<boolean> => {
    if (!formRef.current || !templateId) return false;
    
    const container = formRef.current.getContainerRef();
    if (!container) return false;

    try {
      // Get form data
      const formData = formRef.current.getFormData();
      
      // Get HTML content with forced light theme
      const htmlContent = container.innerHTML;
      
      // Call server-side API
      const response = await fetch('/api/pdf-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          templateId,
          templateName,
          htmlContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const entry = formKey ? getFormEntry(formKey) : null;
      const prefix = entry?.label?.replace(/\s+/g, "-") ?? "Document";
      const timestamp = new Date().toISOString().slice(0, 10);
      
      link.href = url;
      link.download = `${prefix}_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Log generation
      await logGeneration({
        templateId,
        templateName,
        formData: JSON.stringify(formData),
        action: "pdf-download-server",
        generatedBy: "admin",
      });

      return true;
    } catch (error) {
      console.error("Server-side PDF generation failed:", error);
      return false;
    }
  }, [templateId, templateName, formKey, logGeneration]);

  // Client-side PDF generation (html2canvas) for desktop
  const generateClientSidePDF = useCallback(async () => {
    if (!formRef.current || !templateId) return;

    try {
      const container = formRef.current.getContainerRef();
      if (!container) return;

      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import("jspdf");

      // Force light theme before capturing
      const originalTheme = container.getAttribute('data-theme');
      container.setAttribute('data-theme', 'light');
      container.setAttribute('data-pdf', 'true');

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Restore original theme
      if (originalTheme) {
        container.setAttribute('data-theme', originalTheme);
      } else {
        container.removeAttribute('data-theme');
      }
      container.removeAttribute('data-pdf');

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

      const entry = formKey ? getFormEntry(formKey) : null;
      const prefix = entry?.label?.replace(/\s+/g, "-") ?? "Document";
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`${prefix}_${timestamp}.pdf`);

      const formData = formRef.current.getFormData();
      await logGeneration({
        templateId,
        templateName,
        formData: JSON.stringify(formData),
        action: "pdf-download-client",
        generatedBy: "admin",
      });
    } catch (error) {
      console.error("Client-side PDF generation failed:", error);
      throw error;
    }
  }, [templateId, templateName, formKey, logGeneration]);

  const handleDownloadPDF = useCallback(async () => {
    if (!formRef.current || !templateId) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Prefer form's own PDF generator (jsPDF-based, proper page breaks)
      if (formRef.current.generatePDF) {
        await formRef.current.generatePDF();

        // Log the generation
        const formData = formRef.current.getFormData();
        await logGeneration({
          templateId,
          templateName,
          formData: JSON.stringify(formData),
          action: "pdf-download",
          generatedBy: "admin",
        });
      } else {
        // Fallback: html2canvas approach
        const isMobile = isMobileDevice();
        if (isMobile) {
          const serverSuccess = await generateServerSidePDF();
          if (!serverSuccess) {
            console.warn("Server-side PDF failed, falling back to client-side");
            await generateClientSidePDF();
          }
        } else {
          await generateClientSidePDF();
        }
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setGenerationError("PDF generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [templateId, templateName, isMobileDevice, generateServerSidePDF, generateClientSidePDF, logGeneration]);

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
    // Use form's custom print if available (prints contract only, not form UI)
    if (formRef.current.printContract) {
      formRef.current.printContract();
    } else {
      window.print();
    }
  }, [templateId, templateName, logGeneration]);

  const handleExportCSV = useCallback(async () => {
    if (!formRef.current || !templateId) return;
    const formData = formRef.current.getFormData();
    const entry = formKey ? getFormEntry(formKey) : null;
    const prefix = entry?.label?.replace(/\s+/g, "-") ?? templateName.replace(/\s+/g, "-");
    exportToCSV(formData, prefix);
    await logGeneration({
      templateId,
      templateName,
      formData: JSON.stringify(formData),
      action: "export-csv",
      generatedBy: "admin",
    });
  }, [templateId, templateName, formKey, logGeneration]);

  const handleExportJSON = useCallback(async () => {
    if (!formRef.current || !templateId) return;
    const formData = formRef.current.getFormData();
    const entry = formKey ? getFormEntry(formKey) : null;
    const prefix = entry?.label?.replace(/\s+/g, "-") ?? templateName.replace(/\s+/g, "-");
    exportToJSON(formData, prefix);
    await logGeneration({
      templateId,
      templateName,
      formData: JSON.stringify(formData),
      action: "export-json",
      generatedBy: "admin",
    });
  }, [templateId, templateName, formKey, logGeneration]);

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
              className="template-action-btn template-action-export"
              onClick={handleExportCSV}
              title="Export as CSV"
            >
              📊 CSV
            </button>
            <button
              type="button"
              className="template-action-btn template-action-export"
              onClick={handleExportJSON}
              title="Export as JSON"
            >
              🗂️ JSON
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

        {/* Error Message */}
        {generationError && (
          <div className="pdf-generation-error" style={{ 
            padding: '12px 24px', 
            background: '#fee2e2', 
            color: '#991b1b',
            borderBottom: '1px solid #fecaca'
          }}>
            {generationError}
          </div>
        )}

        {/* Form Content — dynamically loaded from registry */}
        <div className="template-modal-body" data-pdf="true">
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
