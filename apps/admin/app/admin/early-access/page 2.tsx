"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2 } from "lucide-react";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { Id } from "@/convex/_generated/dataModel";
import "../admin.css";

interface EarlyAccessSignup {
  _id: Id<"earlyAccessSignups">;
  _creationTime: number;
  email: string;
  source?: string;
  createdAt: number;
  updatedAt?: number;
}

export default function EarlyAccessPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState<EarlyAccessSignup | null>(null);

  const earlyAccess = useQuery(api.earlyAccessSignups.list, { limit: 100 });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEdited = (item: EarlyAccessSignup) => {
    return item.updatedAt && item.updatedAt > item.createdAt;
  };

  const handleDelete = (signup: EarlyAccessSignup) => {
    setSelectedSignup(signup);
    setDeleteModalOpen(true);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Early Access Signups</h1>
        <p className="admin-page-subtitle">
          Manage early access waitlist signups
        </p>
      </div>

      <div className="admin-section-header">
        <h2>All Signups</h2>
      </div>

      {!earlyAccess ? (
        <div className="admin-loading">Loading...</div>
      ) : earlyAccess.length === 0 ? (
        <div className="admin-empty-state">No early access signups found</div>
      ) : (
        <div className="admin-cards-grid">
          {(earlyAccess as EarlyAccessSignup[]).map((signup) => (
            <div key={signup._id} className="admin-card admin-card-simple">
              <div className="admin-card-header">
                <div className="admin-card-title-row">
                  <span className="admin-card-title">{signup.email}</span>
                  {isEdited(signup) && (
                    <span
                      className="admin-edited-badge"
                      title={`Edited on ${formatDate(signup.updatedAt!)}`}
                    >
                      (edited)
                    </span>
                  )}
                </div>
                <span className="admin-date-badge">
                  {formatDate(signup.createdAt)}
                </span>
              </div>
              {signup.source && (
                <div className="admin-card-source">Source: {signup.source}</div>
              )}
              <div className="admin-card-actions">
                <button
                  className="admin-action-btn delete"
                  onClick={() => handleDelete(signup)}
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

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        entityId={selectedSignup?._id || null}
        entityType="earlyAccessSignup"
        entityName={selectedSignup?.email || ""}
        onSuccess={() => setSelectedSignup(null)}
      />
    </div>
  );
}
