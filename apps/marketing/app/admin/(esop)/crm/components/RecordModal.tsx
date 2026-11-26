"use client";

// RecordModal (OD-13 D4) — the create/edit form.
//
// One modal serves all three entity types: the field set switches on
// entityType, prefilling from the record when editing. Submits through the
// island's handleSubmit, which routes to useCrm's create/update per entity.

import { useState } from "react";
import { X } from "lucide-react";
import {
  STAGE_META,
  STAGE_ORDER,
  displayName,
} from "@forhemit/shared/features/crm/records";
import type {
  Company,
  CrmRecord,
  OpportunityStage,
  Person,
  RecordEntityType,
} from "@forhemit/shared/features/crm/records";

interface RecordModalProps {
  entityType: RecordEntityType;
  /** Null means create. */
  record: CrmRecord | null;
  companies: Company[];
  people: Person[];
  onClose: () => void;
  /** Returns true when the create/update succeeded. */
  onSubmit: (input: Record<string, unknown>) => Promise<boolean>;
}

const ENTITY_TITLES: Record<RecordEntityType, { create: string; edit: string }> = {
  people: { create: "New person", edit: "Edit person" },
  companies: { create: "New company", edit: "Edit company" },
  opportunities: { create: "New opportunity", edit: "Edit opportunity" },
};

const inputClass =
  "h-11 w-full rounded border border-border bg-muted/30 px-2 text-sm text-foreground focus:border-primary focus:outline-none";

export function RecordModal({
  entityType,
  record,
  companies,
  people,
  onClose,
  onSubmit,
}: RecordModalProps) {
  const isEdit = record !== null;
  const [saving, setSaving] = useState(false);

  // Person fields
  const [firstName, setFirstName] = useState(
    record?.kind === "person" ? record.firstName : ""
  );
  const [lastName, setLastName] = useState(
    record?.kind === "person" ? (record.lastName ?? "") : ""
  );
  const [email, setEmail] = useState(record?.kind === "person" ? (record.email ?? "") : "");
  const [phone, setPhone] = useState(record?.kind === "person" ? (record.phone ?? "") : "");
  const [jobTitle, setJobTitle] = useState(
    record?.kind === "person" ? (record.jobTitle ?? "") : ""
  );
  const [personCompanyId, setPersonCompanyId] = useState(
    record?.kind === "person" ? (record.companyId ?? "") : ""
  );

  // Company fields
  const [name, setName] = useState(
    record?.kind === "company" || record?.kind === "opportunity" ? record.name : ""
  );
  const [domain, setDomain] = useState(record?.kind === "company" ? (record.domain ?? "") : "");
  const [industry, setIndustry] = useState(
    record?.kind === "company" ? (record.industry ?? "") : ""
  );
  const [city, setCity] = useState(record?.kind === "company" ? (record.city ?? "") : "");
  const [state, setState] = useState(record?.kind === "company" ? (record.state ?? "") : "");

  // Opportunity fields
  const [stage, setStage] = useState<OpportunityStage>(
    record?.kind === "opportunity" ? record.stage : "prospect"
  );
  const [amount, setAmount] = useState(
    record?.kind === "opportunity" && record.amount !== null ? String(record.amount) : ""
  );
  const [closeDate, setCloseDate] = useState(
    record?.kind === "opportunity" ? (record.closeDate ?? "") : ""
  );
  const [oppPersonId, setOppPersonId] = useState(
    record?.kind === "opportunity" ? (record.personId ?? "") : ""
  );
  const [oppCompanyId, setOppCompanyId] = useState(
    record?.kind === "opportunity" ? (record.companyId ?? "") : ""
  );

  const canSubmit =
    !saving &&
    (entityType === "people"
      ? firstName.trim() !== ""
      : name.trim() !== "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const input: Record<string, unknown> =
        entityType === "people"
          ? {
              firstName: firstName.trim(),
              lastName: lastName.trim() || null,
              email: email.trim() || null,
              phone: phone.trim() || null,
              jobTitle: jobTitle.trim() || null,
              companyId: personCompanyId || null,
            }
          : entityType === "companies"
            ? {
                name: name.trim(),
                domain: domain.trim() || null,
                industry: industry.trim() || null,
                city: city.trim() || null,
                state: state.trim() || null,
              }
            : {
                name: name.trim(),
                stage,
                amount: amount.trim() === "" ? null : Number(amount),
                closeDate: closeDate || null,
                personId: oppPersonId || null,
                companyId: oppCompanyId || null,
              };
      const ok = await onSubmit(input);
      if (!ok) setSaving(false);
    } catch (error) {
      // Keep the modal open so the user can retry; the toast from useCrm
      // already reported the failure.
      setSaving(false);
      throw error;
    }
  };

  const title = isEdit
    ? ENTITY_TITLES[entityType].edit
    : ENTITY_TITLES[entityType].create;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-serif text-base text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4">
          {entityType === "people" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pm-first" className="mb-1 block text-xs text-muted-foreground">
                    First name *
                  </label>
                  <input
                    id="pm-first"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="pm-last" className="mb-1 block text-xs text-muted-foreground">
                    Last name
                  </label>
                  <input
                    id="pm-last"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pm-email" className="mb-1 block text-xs text-muted-foreground">
                  Email
                </label>
                <input
                  id="pm-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pm-phone" className="mb-1 block text-xs text-muted-foreground">
                    Phone
                  </label>
                  <input
                    id="pm-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="pm-title" className="mb-1 block text-xs text-muted-foreground">
                    Job title
                  </label>
                  <input
                    id="pm-title"
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pm-company" className="mb-1 block text-xs text-muted-foreground">
                  Company
                </label>
                <select
                  id="pm-company"
                  value={personCompanyId}
                  onChange={(event) => setPersonCompanyId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">— none —</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {displayName(company)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {entityType === "companies" && (
            <>
              <div>
                <label htmlFor="cm-name" className="mb-1 block text-xs text-muted-foreground">
                  Name *
                </label>
                <input
                  id="cm-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cm-domain" className="mb-1 block text-xs text-muted-foreground">
                    Domain
                  </label>
                  <input
                    id="cm-domain"
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    placeholder="acme.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="cm-industry" className="mb-1 block text-xs text-muted-foreground">
                    Industry
                  </label>
                  <input
                    id="cm-industry"
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cm-city" className="mb-1 block text-xs text-muted-foreground">
                    City
                  </label>
                  <input
                    id="cm-city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="cm-state" className="mb-1 block text-xs text-muted-foreground">
                    State
                  </label>
                  <input
                    id="cm-state"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {entityType === "opportunities" && (
            <>
              <div>
                <label htmlFor="om-name" className="mb-1 block text-xs text-muted-foreground">
                  Name *
                </label>
                <input
                  id="om-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="om-stage" className="mb-1 block text-xs text-muted-foreground">
                    Stage
                  </label>
                  <select
                    id="om-stage"
                    value={stage}
                    onChange={(event) => setStage(event.target.value as OpportunityStage)}
                    className={inputClass}
                  >
                    {STAGE_ORDER.map((option) => (
                      <option key={option} value={option}>
                        {STAGE_META[option].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="om-amount" className="mb-1 block text-xs text-muted-foreground">
                    Amount (USD)
                  </label>
                  <input
                    id="om-amount"
                    type="number"
                    min="0"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="om-close" className="mb-1 block text-xs text-muted-foreground">
                  Close date
                </label>
                <input
                  id="om-close"
                  type="date"
                  value={closeDate}
                  onChange={(event) => setCloseDate(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="om-person" className="mb-1 block text-xs text-muted-foreground">
                    Person
                  </label>
                  <select
                    id="om-person"
                    value={oppPersonId}
                    onChange={(event) => setOppPersonId(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">— none —</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {displayName(person)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="om-company" className="mb-1 block text-xs text-muted-foreground">
                    Company
                  </label>
                  <select
                    id="om-company"
                    value={oppCompanyId}
                    onChange={(event) => setOppCompanyId(event.target.value)}
                    className={inputClass}
                  >
                    <option value="">— none —</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {displayName(company)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center rounded border border-border px-4 text-xs text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex h-11 items-center rounded bg-primary px-4 text-xs text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
