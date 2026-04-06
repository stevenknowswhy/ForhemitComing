"use client";

import React, { useState, useEffect } from "react";
import { QAItem, QACategory, QAStatus, QAPriority, QASource, ValidationError } from "../../types";
import {
  CATEGORIES,
  QA_STATUS_OPTIONS,
  QA_PRIORITY_OPTIONS,
  QA_SOURCE_OPTIONS,
  DEFAULT_QA_ITEM,
} from "../../constants";
import { formatDate } from "../../lib/calculations";

interface AddItemModalProps {
  isOpen: boolean;
  editingItem: QAItem | null;
  dealIdPrefix: string;
  closeDate: string;
  onClose: () => void;
  onSave: (item: Partial<QAItem>) => { success: boolean; errors?: ValidationError[] };
}

export function AddItemModal({
  isOpen,
  editingItem,
  dealIdPrefix,
  closeDate,
  onClose,
  onSave,
}: AddItemModalProps) {
  const [formData, setFormData] = useState<Partial<QAItem>>(DEFAULT_QA_ITEM);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
      setCharCount(editingItem.q.length);
    } else {
      setFormData({ ...DEFAULT_QA_ITEM });
      setCharCount(0);
    }
    setErrors([]);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const result = onSave(formData);
    if (result.success) {
      onClose();
    } else {
      setErrors(result.errors || []);
    }
  };

  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  const showResolvedFields = formData.status === "Resolved" || formData.status === "Waived";

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="lqa-modal-backdrop open" onClick={handleBackdropClick}>
      <div className="lqa-modal">
        <div className="lqa-modal-header">
          <h3>{editingItem ? "Edit condition" : "Add lender condition"}</h3>
          <button className="lqa-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="lqa-modal-body">
          <div className="lqa-field-grid lqa-field-grid-2">
            <div className={`lqa-field ${getFieldError("cat") ? "has-error" : ""}`}>
              <label>
                Category <span className="lqa-req">*</span>
              </label>
              <select
                value={formData.cat}
                onChange={(e) => setFormData({ ...formData, cat: e.target.value as QACategory })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {getFieldError("cat") && <span className="lqa-error-msg">{getFieldError("cat")}</span>}
            </div>
            <div className="lqa-field">
              <label>Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as QASource })}
              >
                {QA_SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`lqa-field ${getFieldError("q") ? "has-error" : ""}`}>
            <label>
              Condition / question <span className="lqa-req">*</span>
            </label>
            <textarea
              value={formData.q}
              onChange={(e) => {
                setFormData({ ...formData, q: e.target.value });
                setCharCount(e.target.value.length);
              }}
              placeholder="Verbatim lender condition or question…"
              rows={4}
            />
            <span className="lqa-char-count">{charCount} characters</span>
            {getFieldError("q") && <span className="lqa-error-msg">{getFieldError("q")}</span>}
          </div>

          <div className="lqa-field-grid lqa-field-grid-2">
            <div className={`lqa-field ${getFieldError("status") ? "has-error" : ""}`}>
              <label>
                Status <span className="lqa-req">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as QAStatus })}
              >
                <option value="">Select…</option>
                {QA_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {getFieldError("status") && <span className="lqa-error-msg">{getFieldError("status")}</span>}
            </div>
            <div className={`lqa-field ${getFieldError("pri") ? "has-error" : ""}`}>
              <label>
                Priority <span className="lqa-req">*</span>
              </label>
              <select
                value={formData.pri}
                onChange={(e) => setFormData({ ...formData, pri: e.target.value as QAPriority })}
              >
                <option value="">Select…</option>
                {QA_PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {getFieldError("pri") && <span className="lqa-error-msg">{getFieldError("pri")}</span>}
            </div>
            <div className="lqa-field">
              <label>Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="CFO, Counsel, TPA…"
              />
            </div>
            <div className={`lqa-field ${getFieldError("due") ? "has-error" : ""}`}>
              <label>Due date</label>
              <input
                type="date"
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
              />
              <span className="lqa-hint">Target close: {closeDate ? formatDate(closeDate) : "—"}</span>
              {getFieldError("due") && <span className="lqa-error-msg">{getFieldError("due")}</span>}
            </div>
          </div>

          <div className={`lqa-field ${getFieldError("notes") ? "has-error" : ""}`}>
            <label>Response / notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Current response, partial answer, or internal notes…"
              rows={3}
            />
            {getFieldError("notes") && <span className="lqa-error-msg">{getFieldError("notes")}</span>}
          </div>

          <div className="lqa-field">
            <label>Document reference</label>
            <input
              type="text"
              value={formData.docref}
              onChange={(e) => setFormData({ ...formData, docref: e.target.value })}
              placeholder="File name or data room link…"
            />
          </div>

          {showResolvedFields && (
            <div className="lqa-resolved-fields">
              <div className="lqa-field-grid lqa-field-grid-2">
                <div className={`lqa-field ${getFieldError("resdate") ? "has-error" : ""}`}>
                  <label>
                    Resolved date <span className="lqa-req">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.resdate}
                    onChange={(e) => setFormData({ ...formData, resdate: e.target.value })}
                  />
                  {getFieldError("resdate") && <span className="lqa-error-msg">{getFieldError("resdate")}</span>}
                </div>
                <div className={`lqa-field ${getFieldError("resby") ? "has-error" : ""}`}>
                  <label>
                    Resolved by <span className="lqa-req">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.resby}
                    onChange={(e) => setFormData({ ...formData, resby: e.target.value })}
                    placeholder="Name or firm"
                  />
                  {getFieldError("resby") && <span className="lqa-error-msg">{getFieldError("resby")}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="lqa-modal-footer">
          <button className="lqa-btn lqa-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="lqa-btn lqa-btn-primary" onClick={handleSave}>
            {editingItem ? "Save changes" : "Save item"}
          </button>
        </div>
      </div>
    </div>
  );
}
