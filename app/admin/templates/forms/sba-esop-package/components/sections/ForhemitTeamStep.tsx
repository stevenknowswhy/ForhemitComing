"use client";

import React from "react";
import { TextInput, TextArea } from "../inputs";
import { ForhemitTeam, ValidationErrors } from "../../types";

interface ForhemitTeamStepProps {
  inputs: ForhemitTeam;
  onUpdate: (updates: Partial<ForhemitTeam>) => void;
  errors: ValidationErrors;
}

export function ForhemitTeamStep({ inputs, onUpdate, errors }: ForhemitTeamStepProps) {
  return (
    <div className="pkg-step-content">
      <div className="pkg-section-heading">
        <h2>Forhemit team &amp; contact</h2>
        <p>
          Founder background and contact details for the signature block and document
          header.
        </p>
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Founder full name"
          value={inputs.founderName}
          onChange={(v) => onUpdate({ founderName: v })}
          placeholder="Full name"
          error={errors.founderName}
          required
        />
        <TextInput
          label="Years in SF disaster preparedness"
          value={inputs.founderYears}
          onChange={(v) => onUpdate({ founderYears: v })}
          placeholder="e.g. 12"
          required
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Email address"
          type="email"
          value={inputs.email}
          onChange={(v) => onUpdate({ email: v })}
          placeholder="name@forhemit.com"
          error={errors.founderEmail}
          required
        />
        <TextInput
          label="Phone number"
          type="tel"
          value={inputs.phone}
          onChange={(v) => onUpdate({ phone: v })}
          placeholder="(415) 555-0100"
        />
      </div>

      <div className="pkg-field-row">
        <TextInput
          label="Website / LinkedIn URL"
          value={inputs.website}
          onChange={(v) => onUpdate({ website: v })}
          placeholder="forhemit.com"
        />
        <TextInput
          label="Stewardship Agreement date"
          value={inputs.agreementDate}
          onChange={(v) => onUpdate({ agreementDate: v })}
          placeholder="e.g. July 1, 2025"
        />
      </div>

      <hr className="pkg-divider" />

      <TextArea
        label="Additional context for the credit committee (optional)"
        value={inputs.extraNotes}
        onChange={(v) => onUpdate({ extraNotes: v })}
        placeholder="Any transaction-specific notes, previously raised concerns and how they've been addressed, or context that helps the credit committee understand this deal."
        rows={5}
      />
    </div>
  );
}
