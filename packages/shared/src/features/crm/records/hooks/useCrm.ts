"use client";

// useCrm (OD-13) — client state hook for the CRM records.
//
// Fed server-fetched initial data (from the /admin/crm server page); every
// mutation goes through the admin-guarded API routes with optimistic
// updates and rollback on failure. Unlike usePartnerCRM there is no
// localStorage: Supabase is the single source of truth.

import { useCallback, useMemo, useRef, useState } from "react";
import type {
  Company,
  CompanyInput,
  CrmData,
  CrmEntityType,
  CrmSortConfig,
  CrmSource,
  Note,
  NoteInput,
  Opportunity,
  OpportunityInput,
  OpportunityStage,
  Person,
  PersonInput,
} from "../types";
import { filterRecords, groupByStage, sortRecords } from "../lib/calculations";
import { calculateMetrics } from "../lib/calculations";

const API_BASE = "/api/admin/crm";

export interface CrmToast {
  message: string;
  tone: "success" | "error";
  visible: boolean;
}

/** Placeholder id for a record created optimistically before the server answers. */
function tempId(): string {
  return `temp-${crypto.randomUUID()}`;
}

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CRM API ${url} -> ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export function useCrm(initial: CrmData) {
  const [data, setData] = useState<CrmData>(initial);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<OpportunityStage | null>(null);
  const [sourceFilter, setSourceFilter] = useState<CrmSource | null>(null);
  const [sort, setSort] = useState<CrmSortConfig>({ field: null, dir: "asc" });
  const [toast, setToast] = useState<CrmToast>({ message: "", tone: "success", visible: false });
  const [isMutating, setIsMutating] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, tone: CrmToast["tone"] = "success") => {
    setToast({ message, tone, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, message: "", visible: false })),
      3000
    );
  }, []);

  const filterOptions = useMemo(
    () => ({ search: searchQuery, stage: stageFilter, source: sourceFilter }),
    [searchQuery, stageFilter, sourceFilter]
  );

  const filteredPeople = useMemo(
    () => sortRecords(filterRecords(data.people, filterOptions), sort),
    [data.people, filterOptions, sort]
  );
  const filteredCompanies = useMemo(
    () => sortRecords(filterRecords(data.companies, filterOptions), sort),
    [data.companies, filterOptions, sort]
  );
  const filteredOpportunities = useMemo(
    () => sortRecords(filterRecords(data.opportunities, filterOptions), sort),
    [data.opportunities, filterOptions, sort]
  );
  const pipelineGroups = useMemo(() => groupByStage(filteredOpportunities), [filteredOpportunities]);
  const metrics = useMemo(() => calculateMetrics(data), [data]);

  const createPerson = useCallback(
    async (input: PersonInput): Promise<boolean> => {
      const placeholder: Person = {
        id: tempId(),
        kind: "person",
        source: "manual",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...input,
      };
      setData((d) => ({ ...d, people: [...d.people, placeholder] }));
      setIsMutating(true);
      try {
        const created = await apiJson<Person>(`${API_BASE}/people`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setData((d) => ({
          ...d,
          people: d.people.map((p) => (p.id === placeholder.id ? created : p)),
        }));
        showToast("Contact created");
        return true;
      } catch (error) {
        setData((d) => ({ ...d, people: d.people.filter((p) => p.id !== placeholder.id) }));
        console.error(error);
        showToast("Could not create contact", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  const createCompany = useCallback(
    async (input: CompanyInput): Promise<boolean> => {
      const placeholder: Company = {
        id: tempId(),
        kind: "company",
        source: "manual",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...input,
      };
      setData((d) => ({ ...d, companies: [...d.companies, placeholder] }));
      setIsMutating(true);
      try {
        const created = await apiJson<Company>(`${API_BASE}/companies`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setData((d) => ({
          ...d,
          companies: d.companies.map((c) => (c.id === placeholder.id ? created : c)),
        }));
        showToast("Company created");
        return true;
      } catch (error) {
        setData((d) => ({ ...d, companies: d.companies.filter((c) => c.id !== placeholder.id) }));
        console.error(error);
        showToast("Could not create company", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  const createOpportunity = useCallback(
    async (input: OpportunityInput): Promise<boolean> => {
      const placeholder: Opportunity = {
        id: tempId(),
        kind: "opportunity",
        source: "manual",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...input,
      };
      setData((d) => ({ ...d, opportunities: [...d.opportunities, placeholder] }));
      setIsMutating(true);
      try {
        const created = await apiJson<Opportunity>(`${API_BASE}/opportunities`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setData((d) => ({
          ...d,
          opportunities: d.opportunities.map((o) => (o.id === placeholder.id ? created : o)),
        }));
        showToast("Opportunity created");
        return true;
      } catch (error) {
        setData((d) => ({
          ...d,
          opportunities: d.opportunities.filter((o) => o.id !== placeholder.id),
        }));
        console.error(error);
        showToast("Could not create opportunity", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  const addNote = useCallback(
    async (input: NoteInput): Promise<boolean> => {
      setIsMutating(true);
      try {
        const created = await apiJson<Note>(`${API_BASE}/notes`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setData((d) => ({ ...d, notes: [...d.notes, created] }));
        showToast("Note added");
        return true;
      } catch (error) {
        console.error(error);
        showToast("Could not add note", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  /** Optimistically move an opportunity to a new stage (kanban drag-drop). */
  const moveOpportunity = useCallback(
    async (id: string, stage: OpportunityStage): Promise<boolean> => {
      const previous = data.opportunities;
      setData((d) => ({
        ...d,
        opportunities: d.opportunities.map((o) =>
          o.id === id ? { ...o, stage, updatedAt: new Date().toISOString() } : o
        ),
      }));
      setIsMutating(true);
      try {
        await apiJson<Opportunity>(`${API_BASE}/opportunities/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ stage }),
        });
        return true;
      } catch (error) {
        setData((d) => ({ ...d, opportunities: previous }));
        console.error(error);
        showToast("Could not update stage", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [data.opportunities, showToast]
  );

  /** Optimistic partial update of any record; rolls back on failure. */
  const updateRecord = useCallback(
    async (entityType: Exclude<CrmEntityType, "notes">, id: string, patch: Record<string, unknown>): Promise<boolean> => {
      const apply = (d: CrmData): CrmData => {
        const key = entityType;
        return {
          ...d,
          [key]: (d[key] as Array<Person | Company | Opportunity>).map((r) =>
            r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
          ),
        } as CrmData;
      };
      const previous = data[entityType];
      setData(apply);
      setIsMutating(true);
      try {
        await apiJson(`${API_BASE}/${entityType}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
        return true;
      } catch (error) {
        setData((d) => ({ ...d, [entityType]: previous }) as CrmData);
        console.error(error);
        showToast("Could not save change", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [data, showToast]
  );

  /** Optimistic delete of any record (and its notes) with rollback. */
  const deleteRecord = useCallback(
    async (entityType: Exclude<CrmEntityType, "notes">, id: string): Promise<boolean> => {
      const previous = data[entityType];
      const previousNotes = data.notes;
      setData((d) => ({
        ...d,
        [entityType]: (d[entityType] as Array<Person | Company | Opportunity>).filter(
          (r) => r.id !== id
        ),
        notes: previousNotes.filter(
          (n) => n.personId !== id && n.companyId !== id && n.opportunityId !== id
        ),
      }) as CrmData);
      setIsMutating(true);
      try {
        await apiJson(`${API_BASE}/${entityType}/${id}`, { method: "DELETE" });
        showToast("Deleted");
        return true;
      } catch (error) {
        setData((d) => ({ ...d, [entityType]: previous, notes: previousNotes }) as CrmData);
        console.error(error);
        showToast("Could not delete", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [data, showToast]
  );

  /**
   * Import a Twenty-shaped JSON payload through the import seam. The route
   * persists with source "twenty" and returns the created records; the hook
   * merges them into local state.
   */
  const importTwenty = useCallback(
    async (payload: unknown): Promise<number> => {
      setIsMutating(true);
      try {
        const created = await apiJson<{
          created: { people: Person[]; companies: Company[]; opportunities: Opportunity[] };
          skipped: unknown[];
        }>(`${API_BASE}/import`, { method: "POST", body: JSON.stringify(payload) });
        setData((d) => ({
          ...d,
          people: [...d.people, ...created.created.people],
          companies: [...d.companies, ...created.created.companies],
          opportunities: [...d.opportunities, ...created.created.opportunities],
        }));
        const count =
          created.created.people.length +
          created.created.companies.length +
          created.created.opportunities.length;
        showToast(`Imported ${count} records from Twenty`);
        return count;
      } catch (error) {
        console.error(error);
        showToast("Import failed", "error");
        return 0;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  return {
    data,
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    sourceFilter,
    setSourceFilter,
    sort,
    setSort,
    toast,
    showToast,
    isMutating,
    filteredPeople,
    filteredCompanies,
    filteredOpportunities,
    pipelineGroups,
    metrics,
    createPerson,
    createCompany,
    createOpportunity,
    addNote,
    moveOpportunity,
    updateRecord,
    deleteRecord,
    importTwenty,
  };
}

export type UseCrmReturn = ReturnType<typeof useCrm>;
