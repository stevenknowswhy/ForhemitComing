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

interface ContactSubmission {
  _id: Id<"contactSubmissions">;
  _creationTime: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  contactType: string;
  interest?: string;
  company?: string;
  message: string;
  source?: string;
  status?: string;
  createdAt: number;
  updatedAt?: number;
}

export default function ContactsPage() {
  const [contactStatus, setContactStatus] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  const contacts = useQuery(
    api.contactSubmissions.list,
    { limit: 100, status: (contactStatus as any) || undefined }
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

  const isEdited = (item: ContactSubmission) => {
    return item.updatedAt && item.updatedAt > item.createdAt;
  };

  const handleEdit = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setEditModalOpen(true);
  };

  const handleDelete = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contact Submissions</h1>
        <p className="admin-page-subtitle">
          Manage incoming contact form submissions
        </p>
      </div>

      <div className="admin-section-header">
        <h2>All Submissions</h2>
        <select
          value={contactStatus}
          onChange={(e) => setContactStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {!contacts ? (
        <div className="admin-loading">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="admin-empty-state">No contact submissions found</div>
      ) : (
        <div className="admin-cards-grid">
          {(contacts as ContactSubmission[]).map((contact) => (
            <div key={contact._id} className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title-row">
                  <span className="admin-card-title">
                    {contact.firstName} {contact.lastName}
                  </span>
                  {isEdited(contact) && (
                    <span
                      className="admin-edited-badge"
                      title={`Edited on ${formatDate(contact.updatedAt!)}`}
                    >
                      (edited)
                    </span>
                  )}
                </div>
                <span
                  className="admin-status-badge"
                  style={{ backgroundColor: getStatusBadge(contact.status) }}
                >
                  {contact.status || "new"}
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
                  {contact.email}
                </span>
                {contact.phone && (
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
                    {formatPhoneNumber(contact.phone)}
                  </span>
                )}
                <span className="admin-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatDate(contact.createdAt)}
                </span>
              </div>

              <div className="admin-card-tags">
                <span className="admin-tag">
                  {getContactTypeLabel(contact.contactType)}
                </span>
                {contact.interest && (
                  <span className="admin-tag admin-tag-secondary">
                    {getInterestLabel(contact.interest)}
                  </span>
                )}
                {contact.company && (
                  <span className="admin-tag admin-tag-tertiary">
                    {contact.company}
                  </span>
                )}
              </div>

              <div className="admin-card-message">{contact.message}</div>
              {contact.source && (
                <div className="admin-card-source">Source: {contact.source}</div>
              )}

              <div className="admin-card-actions">
                <button
                  className="admin-action-btn edit"
                  onClick={() => handleEdit(contact)}
                  title="Edit"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  className="admin-action-btn delete"
                  onClick={() => handleDelete(contact)}
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
        entity={selectedContact as Record<string, unknown> | null}
        entityType="contactSubmission"
        onSuccess={() => setSelectedContact(null)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        entityId={selectedContact?._id || null}
        entityType="contactSubmission"
        entityName={
          selectedContact
            ? `${selectedContact.firstName} ${selectedContact.lastName}`
            : ""
        }
        onSuccess={() => setSelectedContact(null)}
      />
    </div>
  );
}
