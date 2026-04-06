"use client";

import React from "react";
import { SenderInfo } from "../../types";
import { TextInput } from "../inputs";

interface SenderInfoSectionProps {
  sender: SenderInfo;
  onUpdateField: <K extends keyof SenderInfo>(field: K, value: SenderInfo[K]) => void;
}

export function SenderInfoSection({ sender, onUpdateField }: SenderInfoSectionProps) {
  return (
    <div className="ilg-field-group">
      <TextInput
        id="senderName"
        label="Your Name"
        value={sender.name}
        onChange={(v) => onUpdateField("name", v)}
        placeholder="Michael Forhemit"
      />
      <TextInput
        id="senderTitle"
        label="Your Title"
        value={sender.title}
        onChange={(v) => onUpdateField("title", v)}
        placeholder="Managing Director"
      />
      <TextInput
        id="senderPhone"
        label="Direct Phone"
        value={sender.phone}
        onChange={(v) => onUpdateField("phone", v)}
        placeholder="(312) 555-0100"
      />
      <TextInput
        id="senderEmail"
        label="Email"
        value={sender.email}
        onChange={(v) => onUpdateField("email", v)}
        placeholder="m@forhemit.com"
      />
      <TextInput
        id="senderWeb"
        label="Website"
        value={sender.website}
        onChange={(v) => onUpdateField("website", v)}
        placeholder="www.forhemit.com"
      />
    </div>
  );
}
