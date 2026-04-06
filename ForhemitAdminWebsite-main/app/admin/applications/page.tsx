"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Edit2, Trash2 } from "lucide-react";
import { formatPhoneNumber } from "@/app/lib/formatters";
import EditModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { Id } from "@/convex/_generated/dataModel";
import "../admin.css";

interface JobApplication {
  _id: Id<"jobApplications">;
  _creationTime: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  otherPosition?: string;
  resumeUrl?: string;
  status?: string;
  createdAt: number;
  updatedAt?: number;
}

export default function ApplicationsPage() {
  const [appStatus, setAppStatus] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const applications = useQuery(
    api.jobApplications.list,
    { limit: 100, status: (appStatus as any) || undefined }
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
      reviewing: "#8b5cf6",
      "interview-scheduled": "#ec4899",
      rejected: "#ef4444",
      hired: "#22c55e",
    };
    return statusColors[status || "new"] || "#6b7280";
  };

  const isEdited = (item: JobApplication) => {
    return item.updatedAt && item.updatedAt > item.createdAt;
  };

  const handleEdit = (app: JobApplication) => {
    setSelectedApp(app);
    setEditModalOpen(true);
  };

  const handleDelete = (app: JobApplication) => {
    setSelectedApp(app);
    setDeleteModalOpen(true);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Job Applications</h1>
        <p className="admin-page-subtitle">
          Manage incoming job applications
        </p>
      </div>

      <div className="admin-section-header">
        <h2>All Applications</h2>
        <select
          value={appStatus}
          onChange={(e) => setAppStatus(e.target.value)}
          className="admin-filter-select"
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
        <div className="admin-loading">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="admin-empty-state">No job applications found</div>
      ) : (
        <div className="admin-cards-grid">
          {(applications as JobApplication[]).map((app) => (
            <div key={app._id} className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title-row">
                  <span className="admin-card-title">
                    {app.firstName} {app.lastName}
                  </span>
                  {isEdited(app) && (
                    <span
                      className="admin-edited-badge"
                      title={`Edited on ${formatDate(app.updatedAt!)}`}
                    >
                      (edited)
                    </span>
                  )}
                </div>
                <span
                  className="admin-status-badge"
                  style={{ backgroundColor: getStatusBadge(app.status) }}
                >
                  {app.status || "new"}
                </span>
              </div>

              <div className="admin-card-meta">
                <span className="admin-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {app.email}
                </span>
                <span className="admin-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {formatPhoneNumber(app.phone)}
                </span>
              </div>

              <div className="admin-card-tags">
                <span className="admin-tag">
                  {app.position === "Other" ? app.otherPosition : app.position}
                </span>
                {app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-tag admin-tag-link"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Resume
                  </a>
                ) : (
                  <span className="admin-tag admin-tag-muted">No Resume</span>
                )}
              </div>

              <div className="admin-card-date">
                Applied: {formatDate(app.createdAt)}
              </div>

              <div className="admin-card-actions">
                <button
                  className="admin-action-btn edit"
                  onClick={() => handleEdit(app)}
                  title="Edit"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  className="admin-action-btn delete"
                  onClick={() => handleDelete(app)}
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

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        entity={selectedApp as Record<string, unknown> | null}
        entityType="jobApplication"
        onSuccess={() => setSelectedApp(null)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        entityId={selectedApp?._id || null}
        entityType="jobApplication"
        entityName={
          selectedApp ? `${selectedApp.firstName} ${selectedApp.lastName}` : ""
        }
        onSuccess={() => setSelectedApp(null)}
      />
    </div>
  );
}
