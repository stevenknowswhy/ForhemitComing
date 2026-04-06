"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface GeneratedDocumentsLogProps {
  templateId?: Id<"documentTemplates">;
  onReprint?: (formData: string) => void;
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function actionLabel(action: string): string {
  switch (action) {
    case "pdf-download":
      return "📄 PDF Download";
    case "print":
      return "🖨️ Print";
    case "preview":
      return "👁️ Preview";
    default:
      return action;
  }
}

function summarizeFormData(json: string): string {
  try {
    const data = JSON.parse(json);
    const price = data.purchasePrice
      ? `$${Number(data.purchasePrice).toLocaleString()}`
      : "—";
    const stage = data.stage ?? "—";
    return `${price} · ${stage}`;
  } catch {
    return "—";
  }
}

export default function GeneratedDocumentsLog({
  templateId,
  onReprint,
}: GeneratedDocumentsLogProps) {
  const allDocs = useQuery(api.generatedDocuments.list, { limit: 50 });
  const templateDocs = useQuery(
    api.generatedDocuments.getByTemplate,
    templateId ? { templateId, limit: 50 } : "skip"
  );

  const docs = templateId ? templateDocs : allDocs;

  if (!docs) {
    return (
      <div className="generated-log-loading">Loading generation log…</div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="generated-log-empty">
        <p>No documents have been generated yet.</p>
        <p className="generated-log-hint">
          Use the form above to generate your first document.
        </p>
      </div>
    );
  }

  return (
    <div className="generated-log-container">
      <h3 className="generated-log-title">Generation History</h3>
      <table className="generated-log-table">
        <thead>
          <tr>
            <th>Template</th>
            <th>Action</th>
            <th>Parameters</th>
            <th>Generated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc._id}>
              <td className="generated-log-name">{doc.templateName}</td>
              <td>{actionLabel(doc.action)}</td>
              <td className="generated-log-params">
                {summarizeFormData(doc.formData)}
              </td>
              <td className="generated-log-time">
                {formatDateTime(doc.createdAt)}
              </td>
              <td>
                {onReprint && (
                  <button
                    type="button"
                    className="generated-log-reprint"
                    onClick={() => onReprint(doc.formData)}
                  >
                    ↻ Reprint
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
