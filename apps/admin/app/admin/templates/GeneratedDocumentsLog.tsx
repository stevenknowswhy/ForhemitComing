"use client";

import React, { useState, useEffect } from "react";

interface GeneratedDocumentsLogProps {
  templateId?: string;
  onReprint?: (formData: string) => void;
}

interface GenerationRecord {
  id: string;
  template_id: string;
  template_name: string;
  form_data: string;
  action: string;
  generated_by: string | null;
  status: string;
  created_at: string;
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-US", {
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
    case "pdf-download-server":
      return "📄 PDF (Server)";
    case "pdf-download-client":
      return "📄 PDF (Client)";
    case "print":
      return "🖨️ Print";
    case "preview":
      return "👁️ Preview";
    case "export-csv":
      return "📊 CSV Export";
    case "export-json":
      return "🗂️ JSON Export";
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
  const [docs, setDocs] = useState<GenerationRecord[] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (templateId) params.set("templateId", templateId);
    params.set("limit", "50");

    fetch(`/api/ghost/generation-log?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDocs(data.generations);
        else setDocs([]);
      })
      .catch(() => setDocs([]));
  }, [templateId]);

  if (docs === null) {
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
            <tr key={doc.id}>
              <td className="generated-log-name">{doc.template_name}</td>
              <td>{actionLabel(doc.action)}</td>
              <td className="generated-log-params">
                {summarizeFormData(doc.form_data)}
              </td>
              <td className="generated-log-time">
                {formatDateTime(doc.created_at)}
              </td>
              <td>
                {onReprint && (
                  <button
                    type="button"
                    className="generated-log-reprint"
                    onClick={() => onReprint(doc.form_data)}
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
