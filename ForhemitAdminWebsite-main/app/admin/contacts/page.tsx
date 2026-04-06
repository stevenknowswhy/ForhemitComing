"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import EditModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "../admin.css";
import "./contacts.css";
import {
  filterContactSubmissions,
  type ContactSubmissionRow,
  type ContactListFilters,
} from "./lib/filterContacts";
import { ContactNoteModal, ContactSubmissionCard } from "./components";

const EMPTY_FILTERS: ContactListFilters = {
  search: "",
  status: "",
  contactType: "",
  interest: "",
  source: "",
};

export default function ContactsPage() {
  const [filters, setFilters] = useState<ContactListFilters>({ ...EMPTY_FILTERS });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmissionRow | null>(null);

  const contacts = useQuery(api.contactSubmissions.list, { limit: 400 });

  const filtered = useMemo(
    () => (contacts ? filterContactSubmissions(contacts as ContactSubmissionRow[], filters) : []),
    [contacts, filters]
  );

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((v) => String(v).trim() !== ""),
    [filters]
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

  const isEdited = (item: ContactSubmissionRow) => {
    return Boolean(item.updatedAt && item.updatedAt > item.createdAt);
  };

  const setFilter = <K extends keyof ContactListFilters>(key: K, value: ContactListFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="admin-page-container contacts-page-inner">
      <div className="admin-page-header contacts-page-header">
        <h1 className="admin-page-title">Contact submissions</h1>
        <p className="admin-page-subtitle">
          Search, filter, add internal notes, edit, or remove inbound messages from the site contact form.
        </p>
      </div>

      <section className="contacts-toolbar" aria-label="Search and filters">
        <div className="contacts-toolbar-row">
          <div className="contacts-search-wrap">
            <label htmlFor="contacts-search" className="contacts-search-label">
              Search
            </label>
            <input
              id="contacts-search"
              type="search"
              className="contacts-search-input"
              placeholder="Name, email, phone, company, message, notes…"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="contacts-filter-group">
            <label htmlFor="contacts-filter-status">Status</label>
            <select
              id="contacts-filter-status"
              className="contacts-filter-select"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="in-progress">In progress</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="contacts-filter-group">
            <label htmlFor="contacts-filter-type">Contact type</label>
            <select
              id="contacts-filter-type"
              className="contacts-filter-select"
              value={filters.contactType}
              onChange={(e) => setFilter("contactType", e.target.value)}
            >
              <option value="">All types</option>
              <option value="business-owner">Business owner</option>
              <option value="partner">Partner</option>
              <option value="existing-business">Portfolio business</option>
              <option value="website-visitor">General inquiry</option>
              <option value="marketing">Marketing / vendor</option>
            </select>
          </div>
          <div className="contacts-filter-group">
            <label htmlFor="contacts-filter-interest">Interest</label>
            <select
              id="contacts-filter-interest"
              className="contacts-filter-select"
              value={filters.interest}
              onChange={(e) => setFilter("interest", e.target.value)}
            >
              <option value="">All interests</option>
              <option value="esop-transition">ESOP transition</option>
              <option value="accounting">Accounting</option>
              <option value="legal">Legal</option>
              <option value="lending">Lending</option>
              <option value="broker">Broker</option>
              <option value="wealth">Wealth</option>
              <option value="career">Career</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="contacts-filter-group">
            <label htmlFor="contacts-filter-source">Source contains</label>
            <input
              id="contacts-filter-source"
              type="text"
              className="contacts-search-input"
              style={{ minWidth: "160px" }}
              placeholder="e.g. homepage"
              value={filters.source}
              onChange={(e) => setFilter("source", e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="contacts-toolbar-meta">
          <span className="contacts-count-pill">
            Showing <strong>{filtered.length}</strong>
            {contacts ? (
              <>
                {" "}
                of <strong>{contacts.length}</strong> loaded
              </>
            ) : null}
          </span>
          <button
            type="button"
            className="contacts-clear-btn"
            disabled={!hasActiveFilters}
            onClick={() => setFilters({ ...EMPTY_FILTERS })}
          >
            Clear filters
          </button>
        </div>
      </section>

      <div className="contacts-section-title">
        <h2>Submissions</h2>
      </div>

      {!contacts ? (
        <div className="admin-loading">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          {contacts.length === 0
            ? "No contact submissions yet."
            : "No submissions match your filters. Try clearing filters or broadening search."}
        </div>
      ) : (
        <div className="contacts-cards-grid">
          {filtered.map((contact) => (
            <ContactSubmissionCard
              key={contact._id}
              contact={contact}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              getContactTypeLabel={getContactTypeLabel}
              getInterestLabel={getInterestLabel}
              isEdited={isEdited}
              onEdit={(c) => {
                setSelectedContact(c);
                setEditModalOpen(true);
              }}
              onDelete={(c) => {
                setSelectedContact(c);
                setDeleteModalOpen(true);
              }}
              onAddNote={(c) => {
                setSelectedContact(c);
                setNoteModalOpen(true);
              }}
            />
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
          selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ""
        }
        onSuccess={() => setSelectedContact(null)}
      />

      <ContactNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        submissionId={selectedContact?._id ?? null}
        contactLabel={
          selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ""
        }
        onSaved={() => setSelectedContact(null)}
      />
    </div>
  );
}
