"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: Id<"contactSubmissions"> | Id<"jobApplications"> | Id<"earlyAccessSignups"> | null;
  entityType: "contactSubmission" | "jobApplication" | "earlyAccessSignup";
  entityName: string;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  entityId,
  entityType,
  entityName,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const deleteContact = useMutation(api.contactSubmissions.remove);
  const deleteApplication = useMutation(api.jobApplications.remove);
  const deleteEarlyAccess = useMutation(api.earlyAccessSignups.remove);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entityId) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      if (entityType === "contactSubmission") {
        await deleteContact({ id: entityId as Id<"contactSubmissions"> });
      } else if (entityType === "jobApplication") {
        await deleteApplication({ id: entityId as Id<"jobApplications"> });
      } else {
        await deleteEarlyAccess({ id: entityId as Id<"earlyAccessSignups"> });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const getEntityTypeLabel = () => {
    switch (entityType) {
      case "contactSubmission":
        return "Contact Submission";
      case "jobApplication":
        return "Job Application";
      case "earlyAccessSignup":
        return "Early Access Signup";
      default:
        return "Item";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <AlertTriangle size={20} className="text-warning" />
            Confirm Delete
          </h2>
          <button className="modal-close" onClick={onClose} disabled={isDeleting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="delete-warning">
            <p>
              Are you sure you want to delete this <strong>{getEntityTypeLabel()}</strong>?
            </p>
            <div className="delete-target">{entityName}</div>
            <p className="delete-hint">
              This action cannot be undone. The deletion will be logged in the audit trail.
            </p>
          </div>

          {error && <div className="modal-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
