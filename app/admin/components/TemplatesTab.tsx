"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import DocumentPreviewModal from "../templates/DocumentPreviewModal";
import GeneratedDocumentsLog from "../templates/GeneratedDocumentsLog";
import "../templates.css";

export default function TemplatesTab() {
  const templates = useQuery(api.documentTemplates.list, {});
  const seedTemplates = useMutation(api.documentTemplates.seed);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] =
    useState<Id<"documentTemplates"> | null>(null);
  const [activeTemplateName, setActiveTemplateName] = useState("");
  const [activeFormKey, setActiveFormKey] = useState("");
  const [reprintData, setReprintData] = useState<
    Record<string, unknown> | undefined
  >();
  const [seeded, setSeeded] = useState(false);

  // Seed templates on first load if empty
  useEffect(() => {
    if (templates && templates.length === 0 && !seeded) {
      seedTemplates({}).then(() => setSeeded(true));
    }
  }, [templates, seeded, seedTemplates]);

  const openPreview = useCallback(
    (id: Id<"documentTemplates">, name: string, formKey?: string, data?: string) => {
      setActiveTemplateId(id);
      setActiveTemplateName(name);
      setActiveFormKey(formKey || "");
      if (data) {
        try {
          setReprintData(JSON.parse(data));
        } catch {
          setReprintData(undefined);
        }
      } else {
        setReprintData(undefined);
      }
      setPreviewOpen(true);
    },
    []
  );

  const handleReprint = useCallback(
    (formDataJson: string) => {
      if (activeTemplateId && activeTemplateName) {
        openPreview(activeTemplateId, activeTemplateName, activeFormKey, formDataJson);
      }
    },
    [activeTemplateId, activeTemplateName, activeFormKey, openPreview]
  );

  if (!templates) {
    return <div className="templates-loading">Loading templates…</div>;
  }

  return (
    <div className="templates-tab">
      {/* Section Header */}
      <div className="section-header">
        <h2>Document Templates</h2>
      </div>

      {/* Template Cards */}
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template._id} className="template-card">
            <div className="template-card-header">
              <div className="template-card-badge">
                {template.category ?? "Document"}
              </div>
              <div
                className={`template-card-status template-status-${template.status}`}
              >
                {template.status}
              </div>
            </div>

            <h3 className="template-card-name">{template.name}</h3>
            <p className="template-card-desc">{template.description}</p>

            <div className="template-card-meta">
              <span>v{template.version}</span>
              {template.updatedAt && (
                <span>
                  Updated{" "}
                  {new Date(template.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="template-card-actions">
              <button
                type="button"
                className="template-btn template-btn-primary"
                onClick={() =>
                  openPreview(template._id, template.name, template.formKey)
                }
              >
                📝 Preview &amp; Fill
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generation Log */}
      {activeTemplateId && (
        <GeneratedDocumentsLog
          templateId={activeTemplateId}
          onReprint={handleReprint}
        />
      )}

      {/* Show general log if no template selected */}
      {!activeTemplateId && templates.length > 0 && (
        <>
          <div className="templates-log-prompt">
            <p>Select a template above to view its generation history, or view all history below.</p>
          </div>
          <GeneratedDocumentsLog onReprint={() => {}} />
        </>
      )}

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        templateId={activeTemplateId}
        templateName={activeTemplateName}
        formKey={activeFormKey}
        initialFormData={reprintData}
      />
    </div>
  );
}
