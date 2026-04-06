"use client";

import { useState } from "react";
import { Company, CompanyFormData, PipelineStage } from "../types";

// ============================================
// Company Modal Component
// ============================================

interface CompanyModalProps {
  company: Company | null;
  initialDate?: string;
  onSave: (data: CompanyFormData) => void;
  onClose: () => void;
}

export function CompanyModal({ company, initialDate, onSave, onClose }: CompanyModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || "",
    industry: company?.industry || "",
    size: company?.size || "",
    revenue: company?.revenue || "",
    website: company?.website || "",
    address: company?.address || "",
    stage: (company?.stage as PipelineStage) || "First contact",
    ndaStatus: company?.ndaStatus || "None",
    advisor: company?.advisor || "",
    referralSource: company?.referralSource || "",
    lastContactDate: company?.lastContactDate || new Date().toISOString().split("T")[0],
    nextStep: company?.nextStep || "",
    nextStepDate: company?.nextStepDate || initialDate || "",
    expectedCloseDate: company?.expectedCloseDate || "",
    notes: company?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  const handleChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="crm-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="crm-modal">
        {/* Header */}
        <div className="crm-modal-header">
          <h2 className="crm-modal-title">
            {company ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="crm-modal-body">
          {/* Company Info */}
          <div className="crm-form-row">
            <FormField label="Company Name *">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Acme Manufacturing Co."
                required
              />
            </FormField>
            <FormField label="Industry">
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="Manufacturing"
              />
            </FormField>
          </div>

          <div className="crm-form-row">
            <FormField label="Company Size">
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleChange("size", e.target.value)}
                placeholder="150 employees"
              />
            </FormField>
            <FormField label="Est. Revenue">
              <input
                type="text"
                value={formData.revenue}
                onChange={(e) => handleChange("revenue", e.target.value)}
                placeholder="$22M"
              />
            </FormField>
          </div>

          {/* Pipeline Status */}
          <div className="crm-form-row">
            <FormField label="Stage *">
              <select
                value={formData.stage}
                onChange={(e) => handleChange("stage", e.target.value)}
              >
                <option value="First contact">First contact</option>
                <option value="Intro call">Intro call</option>
                <option value="NDA sent">NDA sent</option>
                <option value="Feasibility">Feasibility</option>
                <option value="Term sheet">Term sheet</option>
                <option value="LOI signed">LOI signed</option>
                <option value="Closed">Closed</option>
                <option value="On hold">On hold</option>
                <option value="Dead">Dead</option>
              </select>
            </FormField>
            <FormField label="NDA Status">
              <select
                value={formData.ndaStatus}
                onChange={(e) => handleChange("ndaStatus", e.target.value)}
              >
                <option value="None">None</option>
                <option value="Pending">Pending</option>
                <option value="Signed">Signed</option>
              </select>
            </FormField>
          </div>

          {/* Advisor */}
          <div className="crm-form-row">
            <FormField label="Advisor / Referral Source">
              <input
                type="text"
                value={formData.advisor}
                onChange={(e) => handleChange("advisor", e.target.value)}
                placeholder="Morgan Stanley / Self-sourced"
              />
            </FormField>
            <FormField label="Last Contact Date">
              <input
                type="date"
                value={formData.lastContactDate}
                onChange={(e) => handleChange("lastContactDate", e.target.value)}
              />
            </FormField>
          </div>

          {/* Next Step */}
          <div className="crm-form-row">
            <FormField label="Next Step">
              <input
                type="text"
                value={formData.nextStep}
                onChange={(e) => handleChange("nextStep", e.target.value)}
                placeholder="Send feasibility study"
              />
            </FormField>
            <FormField label="Next Step Due Date">
              <input
                type="date"
                value={formData.nextStepDate}
                onChange={(e) => handleChange("nextStepDate", e.target.value)}
              />
            </FormField>
          </div>

          {/* Notes */}
          <FormField label="Notes / Activity" className="crm-form-field full-width">
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Owner is considering retirement, two family members involved..."
              rows={4}
            />
          </FormField>
        </form>

        {/* Footer */}
        <div className="crm-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            {company ? "Save Changes" : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Form Field Component
// ============================================

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, children, className = "" }: FormFieldProps) {
  return (
    <div className={`crm-form-field ${className}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
