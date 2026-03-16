"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatPhoneNumber } from "../lib/formatters";
import { LogOut, Edit2, Trash2, FileText, History } from "lucide-react";
import AdminLogin from "./login";
import EditModal from "./components/EditModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { Id } from "../../convex/_generated/dataModel";
import "./admin.css";

type TabType = "contacts" | "early-access" | "applications" | "stats" | "audit";

// Hook to check if Convex is ready
function useConvexReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timeout = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  return ready;
}

interface AdminContentProps {
  onLogout: () => void;
}

function AdminContent({ onLogout }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("contacts");
  const [contactStatus, setContactStatus] = useState<string>("");
  const [appStatus, setAppStatus] = useState<string>("");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<"contactSubmission" | "jobApplication" | "earlyAccessSignup">("contactSubmission");

  // Fetch data based on active tab
  const contacts = useQuery(
    api.contactSubmissions.list,
    activeTab === "contacts" ? { limit: 100, status: (contactStatus as any) || undefined } : "skip"
  );

  const earlyAccess = useQuery(
    api.earlyAccessSignups.list,
    activeTab === "early-access" ? { limit: 100 } : "skip"
  );

  const applications = useQuery(
    api.jobApplications.list,
    activeTab === "applications" ? { limit: 100, status: (appStatus as any) || undefined } : "skip"
  );

  const appStats = useQuery(
    api.jobApplications.getStats,
    activeTab === "stats" ? {} : "skip"
  );

  const auditLogs = useQuery(
    (api as any).auditLogs?.list,
    activeTab === "audit" ? { limit: 100 } : "skip"
  );

  const auditStats = useQuery(
    (api as any).auditLogs?.getStats,
    activeTab === "audit" ? {} : "skip"
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | undefined) => {
    const statusColors: Record<string, string> = {
      new: "#3b82f6",
      "in-progress": "#f59e0b",
      responded: "#10b981",
      closed: "#6b7280",
      reviewing: "#8b5cf6",
      "interview-scheduled": "#ec4899",
      rejected: "#ef4444",
      hired: "#22c55e",
    };
    return statusColors[status || "new"] || "#6b7280";
  };

  const getContactTypeLabel = (value: string) => {
    const labels: Record<string, string> = {
      "business-owner": "Business Owner",
      partner: "Partner",
      "existing-business": "Portfolio Business",
      "website-visitor": "General Inquiry",
      marketing: "Marketing/Vendor",
    };
    return labels[value] || value;
  };

  const getInterestLabel = (value: string) => {
    const labels: Record<string, string> = {
      "esop-transition": "ESOP Transition",
      accounting: "Accounting",
      legal: "Legal",
      lending: "Lending",
      broker: "Broker",
      wealth: "Wealth Management",
      career: "Career",
      general: "General",
    };
    return labels[value] || value;
  };

  const handleEdit = (entity: any, type: "contactSubmission" | "jobApplication") => {
    setSelectedEntity(entity);
    setSelectedEntityType(type);
    setEditModalOpen(true);
  };

  const handleDelete = (entity: any, type: "contactSubmission" | "jobApplication" | "earlyAccessSignup") => {
    setSelectedEntity(entity);
    setSelectedEntityType(type);
    setDeleteModalOpen(true);
  };

  const getEntityName = () => {
    if (!selectedEntity) return "";
    if (selectedEntityType === "earlyAccessSignup") {
      return selectedEntity.email;
    }
    return `${selectedEntity.firstName} ${selectedEntity.lastName}`;
  };

  const isEdited = (item: any) => {
    return item.updatedAt && item.updatedAt > item.createdAt;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FileText size={14} style={{ color: "#22c55e" }} />;
      case "update":
        return <Edit2 size={14} style={{ color: "#3b82f6" }} />;
      case "delete":
        return <Trash2 size={14} style={{ color: "#ef4444" }} />;
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
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Forhemit Admin</h1>
            <p className="admin-subtitle">Form Submissions Dashboard</p>
          </div>
          <button onClick={onLogout} className="admin-logout-button" title="Sign Out">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Contact Submissions
          {contacts && <span className="tab-badge">{contacts.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === "early-access" ? "active" : ""}`}
          onClick={() => setActiveTab("early-access")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
          </svg>
          Early Access
          {earlyAccess && <span className="tab-badge">{earlyAccess.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Job Applications
          {applications && <span className="tab-badge">{applications.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Statistics
        </button>
        <button
          className={`admin-tab ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
        >
          <History size={16} />
          Audit Log
        </button>
      </nav>

      <div className="admin-content">
        {/* Contact Submissions Tab */}
        {activeTab === "contacts" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Contact Submissions</h2>
              <select
                value={contactStatus}
                onChange={(e) => setContactStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {!contacts ? (
              <div className="loading-state">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="empty-state">No contact submissions found</div>
            ) : (
              <div className="submissions-grid">
                {contacts.map((contact) => (
                  <div key={contact._id} className="submission-card">
                    <div className="card-header">
                      <div className="card-title-row">
                        <span className="card-title">
                          {contact.firstName} {contact.lastName}
                        </span>
                        {isEdited(contact) && (
                          <span className="edited-badge" title={`Edited on ${formatDate(contact.updatedAt!)}`}>
                            (edited)
                          </span>
                        )}
                      </div>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusBadge(contact.status) }}
                      >
                        {contact.status || "new"}
                      </span>
                    </div>
                    <div className="card-meta">
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {formatPhoneNumber(contact.phone)}
                        </span>
                      )}
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                    <div className="card-tags">
                      <span className="tag">{getContactTypeLabel(contact.contactType)}</span>
                      {contact.interest && <span className="tag tag-secondary">{getInterestLabel(contact.interest)}</span>}
                      {contact.company && <span className="tag tag-tertiary">{contact.company}</span>}
                    </div>
                    <div className="card-message">{contact.message}</div>
                    {contact.source && <div className="card-source">Source: {contact.source}</div>}
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit"
                        onClick={() => handleEdit(contact, "contactSubmission")}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        className="card-action-btn delete"
                        onClick={() => handleDelete(contact, "contactSubmission")}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Early Access Tab */}
        {activeTab === "early-access" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Early Access Signups</h2>
            </div>

            {!earlyAccess ? (
              <div className="loading-state">Loading...</div>
            ) : earlyAccess.length === 0 ? (
              <div className="empty-state">No early access signups found</div>
            ) : (
              <div className="submissions-grid">
                {earlyAccess.map((signup) => (
                  <div key={signup._id} className="submission-card simple">
                    <div className="card-header">
                      <div className="card-title-row">
                        <span className="card-title">{signup.email}</span>
                        {isEdited(signup) && (
                          <span className="edited-badge" title={`Edited on ${formatDate(signup.updatedAt!)}`}>
                            (edited)
                          </span>
                        )}
                      </div>
                      <span className="date-badge">{formatDate(signup.createdAt)}</span>
                    </div>
                    {signup.source && <div className="card-source">Source: {signup.source}</div>}
                    <div className="card-actions">
                      <button
                        className="card-action-btn delete"
                        onClick={() => handleDelete(signup, "earlyAccessSignup")}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Job Applications Tab */}
        {activeTab === "applications" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Job Applications</h2>
              <select
                value={appStatus}
                onChange={(e) => setAppStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interview-scheduled">Interview Scheduled</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            {!applications ? (
              <div className="loading-state">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="empty-state">No job applications found</div>
            ) : (
              <div className="submissions-grid">
                {applications.map((app) => (
                  <div key={app._id} className="submission-card">
                    <div className="card-header">
                      <div className="card-title-row">
                        <span className="card-title">
                          {app.firstName} {app.lastName}
                        </span>
                        {isEdited(app) && (
                          <span className="edited-badge" title={`Edited on ${formatDate(app.updatedAt!)}`}>
                            (edited)
                          </span>
                        )}
                      </div>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusBadge(app.status) }}
                      >
                        {app.status || "new"}
                      </span>
                    </div>
                    <div className="card-meta">
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {app.email}
                      </span>
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {formatPhoneNumber(app.phone)}
                      </span>
                    </div>
                    <div className="card-tags">
                      <span className="tag">{app.position === "Other" ? app.otherPosition : app.position}</span>
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="tag tag-link">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Resume
                        </a>
                      ) : (
                        <span className="tag tag-muted">No Resume</span>
                      )}
                    </div>
                    <div className="card-date">Applied: {formatDate(app.createdAt)}</div>
                    <div className="card-actions">
                      <button
                        className="card-action-btn edit"
                        onClick={() => handleEdit(app, "jobApplication")}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        className="card-action-btn delete"
                        onClick={() => handleDelete(app, "jobApplication")}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Application Statistics</h2>
            </div>

            {!appStats ? (
              <div className="loading-state">Loading...</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{appStats.total}</div>
                  <div className="stat-label">Total Applications</div>
                </div>

                <div className="stat-section">
                  <h3>By Status</h3>
                  <div className="stat-bars">
                    {Object.entries(appStats.byStatus).map(([status, count]) => (
                      <div key={status} className="stat-bar-item">
                        <div className="stat-bar-header">
                          <span className="stat-bar-label">{status}</span>
                          <span className="stat-bar-value">{count}</span>
                        </div>
                        <div className="stat-bar-track">
                          <div
                            className="stat-bar-fill"
                            style={{
                              width: `${appStats.total > 0 ? (count / appStats.total) * 100 : 0}%`,
                              backgroundColor: getStatusBadge(status),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-section">
                  <h3>By Position</h3>
                  <div className="stat-list">
                    {Object.entries(appStats.byPosition)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([position, count]) => (
                        <div key={position} className="stat-list-item">
                          <span className="stat-list-label">{position}</span>
                          <span className="stat-list-value">{count as number}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === "audit" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Audit Log</h2>
            </div>

            {!auditLogs ? (
              <div className="loading-state">Loading...</div>
            ) : (
              <>
                {auditStats && (
                  <div className="audit-stats">
                    <div className="audit-stat">
                      <span className="audit-stat-value">{auditStats.total}</span>
                      <span className="audit-stat-label">Total Actions</span>
                    </div>
                    <div className="audit-stat">
                      <span className="audit-stat-value" style={{ color: "#22c55e" }}>
                        {auditStats.byAction.create}
                      </span>
                      <span className="audit-stat-label">Created</span>
                    </div>
                    <div className="audit-stat">
                      <span className="audit-stat-value" style={{ color: "#3b82f6" }}>
                        {auditStats.byAction.update}
                      </span>
                      <span className="audit-stat-label">Updated</span>
                    </div>
                    <div className="audit-stat">
                      <span className="audit-stat-value" style={{ color: "#ef4444" }}>
                        {auditStats.byAction.delete}
                      </span>
                      <span className="audit-stat-label">Deleted</span>
                    </div>
                  </div>
                )}

                <div className="audit-log-list">
                  {auditLogs.length === 0 ? (
                    <div className="empty-state">No audit logs found</div>
                  ) : (
                    auditLogs.map((log: any) => (
                      <div key={log._id} className="audit-log-item">
                        <div className="audit-log-header">
                          <div className="audit-log-action">
                            {getActionIcon(log.action)}
                            <span className={`audit-action-${log.action}`}>{log.action}</span>
                          </div>
                          <span className="audit-log-entity">{getEntityTypeLabel(log.entityType)}</span>
                          <span className="audit-log-time">{formatDate(log.timestamp)}</span>
                        </div>
                        {log.changes && log.changes.length > 0 && (
                          <div className="audit-log-changes">
                            {log.changes.map((change: any, idx: number) => (
                              <div key={idx} className="audit-change">
                                <span className="audit-field">{change.field}:</span>
                                <span className="audit-old">{change.oldValue || "(empty)"}</span>
                                <span className="audit-arrow">→</span>
                                <span className="audit-new">{change.newValue || "(empty)"}</span>
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
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        entity={selectedEntity}
        entityType={selectedEntityType as "contactSubmission" | "jobApplication"}
        onSuccess={() => {}}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        entityId={selectedEntity?._id || null}
        entityType={selectedEntityType}
        entityName={getEntityName()}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default function AdminPage() {
  const convexReady = useConvexReady();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }
    setIsAuthenticated(false);
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="loading-state" style={{ marginTop: "4rem" }}>
            Checking authentication...
          </div>
        </div>
      </main>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <AdminLogin onLogin={handleLogin} />
      </main>
    );
  }

  // Show admin content if authenticated
  return (
    <main className="admin-page">
      {!convexReady ? (
        <div className="admin-container">
          <div className="loading-state" style={{ marginTop: "4rem" }}>
            Initializing admin dashboard...
          </div>
        </div>
      ) : (
        <AdminContent onLogout={handleLogout} />
      )}
    </main>
  );
}
