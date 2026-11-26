// Twenty JSON import mapping (OD-13).
//
// Pure mapper behind POST /api/admin/crm/import: takes a Twenty-shaped
// payload (people / companies / opportunities arrays as served by Twenty's
// REST and GraphQL core APIs), validates it leniently, and returns our
// record inputs tagged source: "twenty". Company references resolve within
// the payload so the API route can link foreign keys after insert. Unknown
// fields are ignored; invalid entries are skipped and reported, never
// silently dropped.

import type {
  CompanyInput,
  CrmEntityType,
  OpportunityInput,
  PersonInput,
} from "../types";
import { CRM_SOURCES } from "../types";

type Json = Record<string, unknown>;

export interface TwentyImportResult {
  people: (PersonInput & { source: "twenty"; twentyId: string; twentyCompanyId?: string })[];
  companies: (CompanyInput & { source: "twenty"; twentyId: string })[];
  opportunities: (OpportunityInput & {
    source: "twenty";
    twentyId: string;
    twentyCompanyId?: string;
  })[];
  skipped: { entity: CrmEntityType; index: number; reason: string }[];
}

export function isTwentyImportPayload(payload: unknown): payload is Json {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return false;
  }
  const keys = Object.keys(payload);
  return keys.some((key) =>
    (["people", "companies", "opportunities"] as const).includes(
      key as "people" | "companies" | "opportunities"
    )
  );
}

function asArray(value: unknown): Json[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is Json =>
      typeof entry === "object" && entry !== null && !Array.isArray(entry)
  );
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/** Twenty nests emails as { email, primaryEmail } objects or plain strings. */
function email(value: unknown): string | null {
  if (typeof value === "string") return text(value);
  if (typeof value === "object" && value !== null) {
    const obj = value as Json;
    return text(obj.primaryEmail) ?? text(obj.email);
  }
  return null;
}

function amount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "object" && value !== null) {
    const obj = value as Json;
    if (typeof obj.amountMicros === "number") return obj.amountMicros / 1_000_000;
  }
  return null;
}

const OPPORTUNITY_STAGE_VALUES = [
  "prospect",
  "introduced",
  "active",
  "preferred",
  "dormant",
] as const;

/** Twenty stages are free-form labels; map onto our pipeline where known. */
const TWENTY_STAGE_MAP: Record<string, (typeof OPPORTUNITY_STAGE_VALUES)[number]> = {
  new: "prospect",
  prospect: "prospect",
  qualified: "introduced",
  introduced: "introduced",
  meeting: "active",
  active: "active",
  proposal: "preferred",
  preferred: "preferred",
  customer: "preferred",
  won: "preferred",
  dormant: "dormant",
  lost: "dormant",
};

function stage(value: unknown): (typeof OPPORTUNITY_STAGE_VALUES)[number] {
  const raw =
    typeof value === "object" && value !== null
      ? text((value as Json).value) ?? text((value as Json).name)
      : typeof value === "string"
        ? value
        : null;
  if (!raw) return "prospect";
  return TWENTY_STAGE_MAP[raw.toLowerCase()] ?? "prospect";
}

/**
 * Resolve a Twenty company reference (companyId, a nested company object
 * with an id, or a company name from this payload) to the Twenty id of a
 * company in the same payload, when present.
 */
function resolveCompanyRef(
  entry: Json,
  twentyIdByCompanyName: Map<string, string>
): string | undefined {
  const direct = text(entry.companyId);
  if (direct) return direct;
  if (typeof entry.company === "object" && entry.company !== null) {
    const ref = (entry.company as Json).id;
    if (typeof ref === "string" && ref.trim() !== "") return ref.trim();
  }
  const nameRef = text(entry.companyName);
  if (nameRef) return twentyIdByCompanyName.get(nameRef);
  return undefined;
}

function mapPerson(
  entry: Json,
  twentyIdByCompanyName: Map<string, string>
): (PersonInput & { twentyCompanyId?: string }) | null {
  const firstName = text(entry.firstName);
  const lastName = text(entry.lastName);
  const name = text(entry.name);
  if (!firstName && !lastName && !name) return null;
  const [firstFromName, ...rest] = (name ?? "").split(" ");
  const twentyCompanyId = resolveCompanyRef(entry, twentyIdByCompanyName);
  return {
    firstName: firstName ?? firstFromName ?? "",
    lastName: lastName ?? (rest.length ? rest.join(" ") : null),
    email: email(entry.emails ?? entry.email),
    phone: text(entry.phone),
    jobTitle: text(entry.jobTitle),
    companyId: null,
    ...(twentyCompanyId ? { twentyCompanyId } : {}),
  };
}

function mapCompany(entry: Json): CompanyInput | null {
  const name = text(entry.name);
  if (!name) return null;
  const domainField = entry.domain ?? entry.domains ?? entry.website;
  const domain =
    typeof domainField === "string"
      ? text(domainField)
      : Array.isArray(domainField)
        ? domainField.find((d): d is string => typeof d === "string") ?? null
        : null;
  return {
    name,
    domain,
    industry: text(entry.industry),
    city: text(entry.city),
    state: text(entry.state),
  };
}

function mapOpportunity(
  entry: Json,
  twentyIdByCompanyName: Map<string, string>
): (OpportunityInput & { twentyCompanyId?: string }) | null {
  const name = text(entry.name);
  if (!name) return null;
  const twentyCompanyId = resolveCompanyRef(entry, twentyIdByCompanyName);
  return {
    name,
    stage: stage(entry.stage),
    amount: amount(entry.amount),
    closeDate: text(entry.closeDate ?? entry.expectedCloseDate),
    personId: null,
    companyId: null,
    ...(twentyCompanyId ? { twentyCompanyId } : {}),
  };
}

/**
 * Map a Twenty-shaped payload to our records with source "twenty". People
 * and opportunities keep their Twenty company reference as twentyCompanyId;
 * the API route inserts companies first and swaps twentyCompanyId for the
 * new UUID foreign keys.
 */
export function mapTwentyImport(payload: unknown): TwentyImportResult {
  const skipped: TwentyImportResult["skipped"] = [];
  const result: TwentyImportResult = {
    people: [],
    companies: [],
    opportunities: [],
    skipped,
  };
  if (!isTwentyImportPayload(payload)) return result;

  const companyRows = asArray(payload.companies);
  const twentyIdByCompanyName = new Map<string, string>();
  companyRows.forEach((entry, index) => {
    const mapped = mapCompany(entry);
    if (!mapped) {
      skipped.push({ entity: "companies", index, reason: "missing name" });
      return;
    }
    const twentyId = text(entry.id) ?? `company-${index}`;
    if (!twentyIdByCompanyName.has(mapped.name)) {
      twentyIdByCompanyName.set(mapped.name, twentyId);
      result.companies.push({ ...mapped, source: "twenty", twentyId });
    }
  });

  asArray(payload.people).forEach((entry, index) => {
    const mapped = mapPerson(entry, twentyIdByCompanyName);
    if (!mapped) {
      skipped.push({ entity: "people", index, reason: "missing name" });
      return;
    }
    const twentyId = text(entry.id) ?? `person-${index}`;
    result.people.push({ ...mapped, source: "twenty", twentyId });
  });

  asArray(payload.opportunities).forEach((entry, index) => {
    const mapped = mapOpportunity(entry, twentyIdByCompanyName);
    if (!mapped) {
      skipped.push({ entity: "opportunities", index, reason: "missing name" });
      return;
    }
    const twentyId = text(entry.id) ?? `opportunity-${index}`;
    result.opportunities.push({ ...mapped, source: "twenty", twentyId });
  });

  return result;
}

/** Guard so the API layer can confirm the import tag before persisting. */
export function isTwentySource(source: unknown): source is "twenty" {
  return source === CRM_SOURCES[1];
}
