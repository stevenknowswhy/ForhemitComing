"use client";

import { useState, useEffect } from "react";
import { X, Loader2, StickyNote } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ContactNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: Id<"contactSubmissions"> | null;
  contactLabel: string;
  onSaved: () => void;
}

export function ContactNoteModal({
  isOpen,
  onClose,
  submissionId,
  contactLabel,
  onSaved,
}: ContactNoteModalProps) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const appendNote = useMutation(api.contactSubmissions.appendAdminNote);

  useEffect(() => {
    if (isOpen) {
      setText("");
      setError("");
    }
  }, [isOpen, submissionId]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !submissionId) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await appendNote({ id: submissionId, text });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay contacts-modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-small contacts-note-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="contact-note-title"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 id="contact-note-title" className="modal-title">
            <StickyNote size={20} className="contacts-note-modal-icon" />
            Add internal note
          </h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content contacts-note-modal-body">
          <p className="contacts-note-modal-target">{contactLabel}</p>
          <p className="contacts-note-modal-hint">
            Notes are stored on this submission and included in search. They are not sent to the contact.
          </p>
          <textarea
            className="contacts-note-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Follow-up context, call outcomes, next steps…"
            rows={5}
            disabled={saving}
          />
          {error ? <div className="modal-error">{error}</div> : null}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !text.trim()}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="spin" />
                Saving…
              </>
            ) : (
              "Save note"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
