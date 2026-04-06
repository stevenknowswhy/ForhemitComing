"use client";

import React from "react";
import { SellingShareholder } from "../../types";
import { TextInput, SelectInput, TextArea } from "../inputs";
import { SECTION_1042_OPTIONS, POST_CLOSE_ROLE_OPTIONS } from "../../constants";

interface SellingShareholderSectionProps {
  seller: SellingShareholder;
  onUpdateField: <K extends keyof SellingShareholder>(
    field: K,
    value: SellingShareholder[K]
  ) => void;
}

export function SellingShareholderSection({
  seller,
  onUpdateField,
}: SellingShareholderSectionProps) {
  return (
    <div className="erm-card">
      <div className="erm-card-header">
        <span className="erm-card-title">Selling Shareholder(s)</span>
      </div>
      <div className="erm-card-body">
        <div className="erm-field-grid erm-fg-3" style={{ marginBottom: 14 }}>
          <TextInput
            id="h-seller"
            label="Seller name(s)"
            value={seller.sellerNames}
            onChange={(v) => onUpdateField("sellerNames", v)}
            placeholder="John & Mary Smith"
          />
          <SelectInput
            id="h-1042"
            label="§1042 election?"
            value={seller.section1042Election}
            options={SECTION_1042_OPTIONS}
            onChange={(v) =>
              onUpdateField("section1042Election", v as "yes" | "no" | "tbd")
            }
          />
          <SelectInput
            id="h-role"
            label="Seller post-close role"
            value={seller.postCloseRole}
            options={POST_CLOSE_ROLE_OPTIONS}
            onChange={(v) =>
              onUpdateField("postCloseRole", v as "employee" | "consultant" | "departing")
            }
          />
        </div>
        <div className="erm-field-grid erm-fg-2">
          <TextArea
            id="h-notes"
            label="Notes on seller economics"
            value={seller.sellerNotes}
            onChange={(v) => onUpdateField("sellerNotes", v)}
            placeholder="e.g. Seller electing §1042, QRP strategy in progress. Seller to remain as VP of Operations for 2 years post-close."
            rows={3}
          />
          <TextArea
            id="h-open"
            label="Open items / conditions"
            value={seller.openItems}
            onChange={(v) => onUpdateField("openItems", v)}
            placeholder="e.g. Trustee acceptance letter pending. SBA commitment letter expected by April 15."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
