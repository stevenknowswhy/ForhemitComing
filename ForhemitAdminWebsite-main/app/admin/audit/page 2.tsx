"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Edit2, Trash2, FileText } from "lucide-react";
import "../admin.css";

interface AuditLog {
  _id: string;
  _creationTime: number;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  timestamp: number;
  changes?: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

interface AuditStats {
  total: number;
  byAction: {
    create: number;
    update: number;
    delete: number;
  };
}

export default function AuditPage() {
  const auditLogs = useQuery(api.auditLogs?.list, { limit: 100 });
  const auditStats = useQuery(api.auditLogs?.getStats, {});

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FileText size={14} style={{ color: "var(--color-success)" }} />;
      case "update":
        return <Edit2 size={14} style={{ color: "var(--color-info)" }} />;
      case "delete":
        return <Trash2 size={14} style={{ color: "var(--color-error)" }} />;
      default:
        return null;
    }
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contactSubmission: "Contact",
      jobApplication: "Application",
      earlyAccessSignup: "Early Access",
    };
    return labels[type] || type;
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Audit Log</h1>
        <p className="admin-page-subtitle">
          Track all changes to submissions and applications
        </p>
      </div>

      {!auditLogs ? (
        <div className="admin-loading">Loading audit logs...</div>
      ) : (
        <>
          {auditStats && (
            <div className="admin-audit-stats">
              <div className="admin-audit-stat">
                <span className="admin-audit-stat-value">{auditStats.total}</span>
                <span className="admin-audit-stat-label">Total Actions</span>
              </div>
              <div className="admin-audit-stat">
                <span
                  className="admin-audit-stat-value"
                  style={{ color: "var(--color-success)" }}
                >
                  {auditStats.byAction.create}
                </span>
                <span className="admin-audit-stat-label">Created</span>
              </div>
              <div className="admin-audit-stat">
                <span
                  className="admin-audit-stat-value"
                  style={{ color: "var(--color-info)" }}
                >
                  {auditStats.byAction.update}
                </span>
                <span className="admin-audit-stat-label">Updated</span>
              </div>
              <div className="admin-audit-stat">
                <span
                  className="admin-audit-stat-value"
                  style={{ color: "var(--color-error)" }}
                >
                  {auditStats.byAction.delete}
                </span>
                <span className="admin-audit-stat-label">Deleted</span>
              </div>
            </div>
          )}

          <div className="admin-audit-list">
            {auditLogs.length === 0 ? (
              <div className="admin-empty-state">No audit logs found</div>
            ) : (
              (auditLogs as AuditLog[]).map((log) => (
                <div key={log._id} className="admin-audit-item">
                  <div className="admin-audit-header">
                    <div className="admin-audit-action">
                      {getActionIcon(log.action)}
                      <span className={`admin-action-${log.action}`}>
                        {log.action}
                      </span>
                    </div>
                    <span className="admin-audit-entity">
                      {getEntityTypeLabel(log.entityType)}
                    </span>
                    <span className="admin-audit-time">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  {log.changes && log.changes.length > 0 && (
                    <div className="admin-audit-changes">
                      {log.changes.map((change, idx) => (
                        <div key={idx} className="admin-audit-change">
                          <span className="admin-audit-field">
                            {change.field}:
                          </span>
                          <span className="admin-audit-old">
                            {change.oldValue || "(empty)"}
                          </span>
                          <span className="admin-audit-arrow">→</span>
                          <span className="admin-audit-new">
                            {change.newValue || "(empty)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
