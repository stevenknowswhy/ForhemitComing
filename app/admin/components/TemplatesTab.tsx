"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import DocumentPreviewModal from "../templates/DocumentPreviewModal";
import GeneratedDocumentsLog from "../templates/GeneratedDocumentsLog";
import "../templates.css";

const TemplateBuilderGuide = lazy(() =>
  import("../templates/forms/TemplateBuilderGuide")
);

export default function TemplatesTab() {
  const router = useRouter();
  const templates = useQuery(api.documentTemplates.list, {});
  const forceSeedAll = useMutation(api.documentTemplates.forceSeedAll);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] =
    useState<Id<"documentTemplates"> | null>(null);
  const [activeTemplateName, setActiveTemplateName] = useState("");
  const [activeFormKey, setActiveFormKey] = useState("");
  const [reprintData, setReprintData] = useState<
    Record<string, unknown> | undefined
  >();
  const [seeded, setSeeded] = useState(false);

  // Seed templates if less than 2 exist (excluding the guide)
  useEffect(() => {
    if (templates && templates.length < 2 && !seeded) {
      forceSeedAll({}).then(() => setSeeded(true));
    }
  }, [templates, seeded, forceSeedAll]);

  // Filter out the Template Builder Guide from the cards
  const templateCards = templates?.filter((t) => t.slug !== "template-builder-guide") ?? [];

  // Force refresh templates (add missing ones)
  const handleRefreshTemplates = useCallback(async () => {
    await forceSeedAll({});
    router.refresh();
  }, [forceSeedAll, router]);

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
        <div className="section-header-actions">
          <button
            type="button"
            className="template-btn template-btn-secondary"
            onClick={() => setGuideOpen(true)}
          >
            📖 Template Builder Guide
          </button>
          <button
            type="button"
            className="template-btn template-btn-secondary"
            onClick={handleRefreshTemplates}
          >
            🔄 Refresh Templates
          </button>
        </div>
      </div>

      {/* Template Cards */}
      <div className="templates-grid">
        {templateCards.map((template) => (
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

      {/* Template Builder Guide Modal */}
      {guideOpen && (
        <div className="modal-overlay" onClick={() => setGuideOpen(false)}>
          <div className="modal-content guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Template Builder Guide</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setGuideOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <Suspense fallback={<div>Loading guide...</div>}>
                <TemplateBuilderGuide />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
