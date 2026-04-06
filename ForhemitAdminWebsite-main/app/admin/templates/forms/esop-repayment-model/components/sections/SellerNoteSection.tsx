"use client";

import React from "react";
import { SellerNote } from "../../types";
import { NumberInput, SelectInput, TextInput } from "../inputs";
import { SN_TERM_OPTIONS, SUBORDINATION_OPTIONS, STANDSTILL_OPTIONS } from "../../constants";

interface SellerNoteSectionProps {
  note: SellerNote;
  onUpdateField: <K extends keyof SellerNote>(field: K, value: SellerNote[K]) => void;
}

export function SellerNoteSection({ note, onUpdateField }: SellerNoteSectionProps) {
  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Seller Note</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
          <NumberInput
            id="sn-amt"
            label="Note amount ($)"
            value={note.amount}
            onChange={(v) => onUpdateField("amount", Math.max(0, v))}
            placeholder="2000000"
            step={100000}
            min={0}
          />
          <NumberInput
            id="sn-rate"
            label="Interest rate (%)"
            value={note.rate}
            onChange={(v) => onUpdateField("rate", Math.max(0, v))}
            placeholder="5.00"
            step={0.25}
            min={0}
          />
          <SelectInput
            id="sn-term"
            label="Term"
            value={note.term}
            options={SN_TERM_OPTIONS}
            onChange={(v) => onUpdateField("term", parseInt(v))}
          />
        </div>
        <div className="erm-field-grid erm-fg-3">
          <SelectInput
            id="sn-sub"
            label="Subordination structure"
            value={note.subordination}
            options={SUBORDINATION_OPTIONS}
            onChange={(v) => onUpdateField("subordination", v as "yes" | "partial" | "no")}
            required
          />
          <SelectInput
            id="sn-standstill"
            label="Standstill period"
            value={note.standstillPeriod}
            options={STANDSTILL_OPTIONS}
            onChange={(v) => onUpdateField("standstillPeriod", v as "2" | "5" | "custom")}
          />
          <TextInput
            id="sn-security"
            label="Seller note security"
            value={note.security}
            onChange={(v) => onUpdateField("security", v)}
            placeholder="Subordinate lien on assets"
          />
        </div>
        <div className="erm-field-note" style={{ marginTop: 12 }}>
          SBA requires the seller note to be on full standstill (no principal or interest
          payments) during the SBA loan term for ESOP transactions. This is reflected in
          the DSCR calculation below.
        </div>
      </div>
    </div>
  );
}
