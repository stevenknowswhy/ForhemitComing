"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from "react";
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
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Seed templates if less than 2 exist (excluding the guide)
  useEffect(() => {
    if (templates && templates.length < 2 && !seeded) {
      forceSeedAll({}).then(() => setSeeded(true));
    }
  }, [templates, seeded, forceSeedAll]);

  // Filter out the Template Builder Guide from the cards
  const baseTemplates = templates?.filter((t) => t.slug !== "template-builder-guide") ?? [];
  
  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set<string>();
    baseTemplates.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [baseTemplates]);
  
  // Filter templates based on search and filters
  const templateCards = useMemo(() => {
    return baseTemplates.filter((template) => {
      // Search filter (name, description, slug)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.slug.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (categoryFilter !== "all" && template.category !== categoryFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && template.status !== statusFilter) {
        return false;
      }
      
      return true;
    });
  }, [baseTemplates, searchQuery, categoryFilter, statusFilter]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  }, []);
  
  // Check if any filters are active
  const hasActiveFilters = searchQuery || categoryFilter !== "all" || statusFilter !== "all";

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
      
      {/* Search and Filter Controls */}
      <div className="templates-filter-bar">
        <div className="templates-search">
          {!searchQuery && <span className="templates-search-icon">🔍</span>}
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`templates-search-input${searchQuery ? " templates-search-input--filled" : ""}`}
          />
          {searchQuery && (
            <button
              type="button"
              className="templates-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="templates-filters">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          
          {hasActiveFilters && (
            <button
              type="button"
              className="templates-clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Results Count */}
      <div className="templates-results-info">
        Showing {templateCards.length} of {baseTemplates.length} templates
        {hasActiveFilters && " (filtered)"}
      </div>

      {/* Template Cards */}
      {templateCards.length > 0 ? (
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
      ) : (
        <div className="templates-empty-state">
          <div className="templates-empty-state-icon">🔍</div>
          <h3>No templates found</h3>
          <p>
            No templates match your current search and filter criteria.
            {hasActiveFilters && (
              <> Try adjusting your filters or{" "}
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-brand)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    padding: 0,
                  }}
                >
                  clear all filters
                </button>
                .</>
            )}
          </p>
        </div>
      )}

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
