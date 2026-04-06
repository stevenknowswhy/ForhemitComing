import { Id } from "@/convex/_generated/dataModel";

export interface ContactSubmissionRow {
  _id: Id<"contactSubmissions">;
  _creationTime: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  contactType: string;
  interest?: string;
  company?: string;
  message: string;
  source?: string;
  status?: string;
  createdAt: number;
  updatedAt?: number;
  adminNotes?: Array<{ id: string; text: string; createdAt: number }>;
}

export interface ContactListFilters {
  search: string;
  status: string;
  contactType: string;
  interest: string;
  source: string;
}

export function filterContactSubmissions(
  items: ContactSubmissionRow[],
  filters: ContactListFilters
): ContactSubmissionRow[] {
  const q = filters.search.trim().toLowerCase();
  const sourceQ = filters.source.trim().toLowerCase();

  return items.filter((c) => {
    const st = c.status || "new";
    if (filters.status && st !== filters.status) return false;
    if (filters.contactType && c.contactType !== filters.contactType) return false;
    if (filters.interest) {
      if (!c.interest || c.interest !== filters.interest) return false;
    }
    if (sourceQ) {
      const s = (c.source || "").toLowerCase();
      if (!s.includes(sourceQ)) return false;
    }
    if (q) {
      const hay = [
        c.firstName,
        c.lastName,
        c.email,
        c.phone ?? "",
        c.company ?? "",
        c.message,
        c.source ?? "",
        ...(c.adminNotes?.map((n) => n.text) ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
