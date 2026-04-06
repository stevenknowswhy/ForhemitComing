"use client";

import React from "react";
import { ContactInfo } from "../../types";
import { TextInput, TextArea } from "../inputs";

interface ContactInfoSectionProps {
  contact: ContactInfo;
  onUpdateField: <K extends keyof ContactInfo>(field: K, value: ContactInfo[K]) => void;
}

export function ContactInfoSection({ contact, onUpdateField }: ContactInfoSectionProps) {
  return (
    <div className="ilg-field-group">
      <div className="ilg-field-row">
        <TextInput
          id="contactFirst"
          label="First Name"
          value={contact.firstName}
          onChange={(v) => onUpdateField("firstName", v)}
          placeholder="Jane"
        />
        <TextInput
          id="contactLast"
          label="Last Name"
          value={contact.lastName}
          onChange={(v) => onUpdateField("lastName", v)}
          placeholder="Smith"
        />
      </div>
      <TextInput
        id="contactTitle"
        label="Title / Role"
        value={contact.title}
        onChange={(v) => onUpdateField("title", v)}
        placeholder="Managing Partner"
      />
      <TextInput
        id="contactCompany"
        label="Company Name"
        value={contact.company}
        onChange={(v) => onUpdateField("company", v)}
        placeholder="Smith & Associates"
      />
      <TextInput
        id="contactCity"
        label="City, State"
        value={contact.cityState}
        onChange={(v) => onUpdateField("cityState", v)}
        placeholder="Chicago, IL"
      />
    </div>
  );
}
