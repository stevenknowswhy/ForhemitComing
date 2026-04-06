"use client";

import React from "react";
import { TextInput, SelectInput, TextArea } from "../inputs";
import { ManagementTeam, ManagementPerson } from "../../types";
import { MANAGEMENT_STATUS_OPTIONS } from "../../constants";

interface ManagementStepProps {
  inputs: ManagementTeam;
  onUpdatePerson: (index: number, updates: Partial<ManagementPerson>) => void;
  onUpdateNotes: (notes: string) => void;
}

const ROLE_HINTS = [
  "P&L / operational authority",
  "Client relationships / revenue",
  "Finance / admin oversight",
];

export function ManagementStep({
  inputs,
  onUpdatePerson,
  onUpdateNotes,
}: ManagementStepProps) {
  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Management team</h2>
        <p>
          The three key people running this business on Day 1. The credit committee
          needs to see who is in charge, how long they&apos;ve been there, and that
          retention agreements are in place.
        </p>
      </div>

      <div className="pkg-mgmt-table">
        <div className="pkg-mgmt-header">
          <span>Name &amp; Title</span>
          <span>Tenure</span>
          <span>Post-close role</span>
          <span>Retention</span>
        </div>
        {inputs.members.map((member, index) => (
          <div key={index} className="pkg-mgmt-row">
            <input
              type="text"
              value={member.name}
              onChange={(e) => onUpdatePerson(index, { name: e.target.value })}
              placeholder="Full name, Title"
              className="pkg-mgmt-input"
            />
            <input
              type="text"
              value={member.tenure}
              onChange={(e) => onUpdatePerson(index, { tenure: e.target.value })}
              placeholder="X yrs"
              className="pkg-mgmt-input"
            />
            <input
              type="text"
              value={member.role}
              onChange={(e) => onUpdatePerson(index, { role: e.target.value })}
              placeholder={ROLE_HINTS[index]}
              className="pkg-mgmt-input"
            />
            <select
              value={member.status}
              onChange={(e) =>
                onUpdatePerson(index, {
                  status: e.target.value as ManagementPerson["status"],
                })
              }
              className="pkg-mgmt-select"
            >
              {MANAGEMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <hr className="pkg-divider" />

      <TextArea
        label="Management team readiness notes"
        value={inputs.notes}
        onChange={onUpdateNotes}
        placeholder="e.g. Team has managed day-to-day operations for the past 4 years with minimal founder involvement. Succession plan is formalized and included in the COOP."
        rows={4}
      />
    </div>
  );
}
