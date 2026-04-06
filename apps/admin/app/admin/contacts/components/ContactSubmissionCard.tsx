"use client";

import { Edit2, Trash2, StickyNote, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPhoneNumber } from "@/app/lib/formatters";
import type { ContactSubmissionRow } from "../lib/filterContacts";
import { Id } from "@/convex/_generated/dataModel";

interface ContactSubmissionCardProps {
  contact: ContactSubmissionRow;
  formatDate: (ts: number) => string;
  getStatusBadge: (status: string | undefined) => string;
  getContactTypeLabel: (value: string) => string;
  getInterestLabel: (value: string) => string;
  isEdited: (item: ContactSubmissionRow) => boolean;
  onEdit: (contact: ContactSubmissionRow) => void;
  onDelete: (contact: ContactSubmissionRow) => void;
  onAddNote: (contact: ContactSubmissionRow) => void;
}

export function ContactSubmissionCard({
  contact,
  formatDate,
  getStatusBadge,
  getContactTypeLabel,
  getInterestLabel,
  isEdited,
  onEdit,
  onDelete,
  onAddNote,
}: ContactSubmissionCardProps) {
  const removeNote = useMutation(api.contactSubmissions.removeAdminNote);
  const notes = contact.adminNotes ?? [];

  const handleRemoveNote = async (noteId: string) => {
    if (!confirm("Remove this note?")) return;
    await removeNote({ id: contact._id as Id<"contactSubmissions">, noteId });
  };

  return (
    <article className="admin-card contacts-submission-card">
      <div className="admin-card-header contacts-card-header">
        <div className="admin-card-title-row">
          <span className="admin-card-title">
            {contact.firstName} {contact.lastName}
          </span>
          {isEdited(contact) && (
            <span
              className="admin-edited-badge"
              title={`Edited on ${formatDate(contact.updatedAt!)}`}
            >
              edited
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

      <div className="admin-card-meta contacts-card-meta">
        <span className="admin-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {contact.email}
        </span>
        {contact.phone ? (
          <span className="admin-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {formatPhoneNumber(contact.phone)}
          </span>
        ) : null}
        <span className="admin-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatDate(contact.createdAt)}
        </span>
      </div>

      <div className="admin-card-tags contacts-card-tags">
        <span className="admin-tag">{getContactTypeLabel(contact.contactType)}</span>
        {contact.interest ? (
          <span className="admin-tag admin-tag-secondary">{getInterestLabel(contact.interest)}</span>
        ) : null}
        {contact.company ? (
          <span className="admin-tag admin-tag-tertiary">{contact.company}</span>
        ) : null}
      </div>

      <div className="admin-card-message contacts-card-message">{contact.message}</div>

      {contact.source ? (
        <div className="admin-card-source contacts-card-source">Source: {contact.source}</div>
      ) : null}

      {notes.length > 0 ? (
        <div className="contacts-admin-notes">
          <div className="contacts-admin-notes-label">Internal notes</div>
          <ul className="contacts-admin-notes-list">
            {notes.map((n) => (
              <li key={n.id} className="contacts-admin-note-item">
                <div className="contacts-admin-note-text">{n.text}</div>
                <div className="contacts-admin-note-footer">
                  <time dateTime={new Date(n.createdAt).toISOString()}>{formatDate(n.createdAt)}</time>
                  <button
                    type="button"
                    className="contacts-admin-note-remove"
                    onClick={() => handleRemoveNote(n.id)}
                    title="Remove note"
                    aria-label="Remove note"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="admin-card-actions contacts-card-actions">
        <button type="button" className="admin-action-btn note" onClick={() => onAddNote(contact)}>
          <StickyNote size={14} />
          Note
        </button>
        <button type="button" className="admin-action-btn edit" onClick={() => onEdit(contact)}>
          <Edit2 size={14} />
          Edit
        </button>
        <button type="button" className="admin-action-btn delete" onClick={() => onDelete(contact)}>
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  );
}
