"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: Record<string, unknown> | null;
  entityType: "contactSubmission" | "jobApplication";
  onSuccess: () => void;
}

const contactTypeOptions = [
  { value: "business-owner", label: "Business Owner" },
  { value: "partner", label: "Partner" },
  { value: "existing-business", label: "Portfolio Business" },
  { value: "website-visitor", label: "General Inquiry" },
  { value: "marketing", label: "Marketing/Vendor" },
];

const interestOptions = [
  { value: "esop-transition", label: "ESOP Transition" },
  { value: "accounting", label: "Accounting" },
  { value: "legal", label: "Legal" },
  { value: "lending", label: "Lending" },
  { value: "broker", label: "Broker" },
  { value: "wealth", label: "Wealth Management" },
  { value: "career", label: "Career" },
  { value: "general", label: "General" },
];

const contactStatusOptions = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
];

const applicationStatusOptions = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interview-scheduled", label: "Interview Scheduled" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

export default function EditModal({ isOpen, onClose, entity, entityType, onSuccess }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const updateContact = useMutation(api.contactSubmissions.update);
  const updateApplication = useMutation(api.jobApplications.update);

  useEffect(() => {
    if (entity) {
      setFormData({ ...entity });
    }
  }, [entity]);

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

  if (!isOpen || !entity) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      if (entityType === "contactSubmission") {
        await updateContact({
          id: entity._id as Id<"contactSubmissions">,
          contactType: formData.contactType as any,
          firstName: formData.firstName as string,
          lastName: formData.lastName as string,
          email: formData.email as string,
          phone: formData.phone as string | undefined,
          company: formData.company as string | undefined,
          interest: formData.interest as any,
          message: formData.message as string | undefined,
          status: formData.status as any,
        });
      } else {
        await updateApplication({
          id: entity._id as Id<"jobApplications">,
          firstName: formData.firstName as string,
          lastName: formData.lastName as string,
          email: formData.email as string,
          phone: formData.phone as string,
          position: formData.position as string,
          otherPosition: formData.otherPosition as string | undefined,
          status: formData.status as any,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const isContact = entityType === "contactSubmission";
  const title = isContact ? "Edit Contact Submission" : "Edit Job Application";
  const statusOptions = isContact ? contactStatusOptions : applicationStatusOptions;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} disabled={isSaving}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={(formData.firstName as string) || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={(formData.lastName as string) || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={(formData.email as string) || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={(formData.phone as string) || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isSaving}
              />
            </div>

            {isContact && (
              <>
                <div className="form-group">
                  <label>Contact Type</label>
                  <select
                    value={(formData.contactType as string) || ""}
                    onChange={(e) => handleChange("contactType", e.target.value)}
                    disabled={isSaving}
                  >
                    {contactTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={(formData.company as string) || ""}
                    onChange={(e) => handleChange("company", e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label>Interest</label>
                  <select
                    value={(formData.interest as string) || ""}
                    onChange={(e) => handleChange("interest", e.target.value)}
                    disabled={isSaving}
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {!isContact && (
              <>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={(formData.position as string) || ""}
                    onChange={(e) => handleChange("position", e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                {(formData.otherPosition as string) && (
                  <div className="form-group">
                    <label>Other Position</label>
                    <input
                      type="text"
                      value={(formData.otherPosition as string) || ""}
                      onChange={(e) => handleChange("otherPosition", e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Status</label>
              <select
                value={(formData.status as string) || "new"}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={isSaving}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isContact && (
            <div className="form-group full-width">
              <label>Message</label>
              <textarea
                rows={4}
                value={(formData.message as string) || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                disabled={isSaving}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className="spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
