// CRM API resource registry (OD-13).
//
// Maps the URL entity segment to its crm_* table and the shared serializers,
// so the CRUD route handlers stay generic. Only these four entities exist;
// anything else is a 404 before it ever reaches PostgREST.

import {
  companyToRow,
  noteToRow,
  opportunityToRow,
  personToRow,
  rowToCompany,
  rowToNote,
  rowToOpportunity,
  rowToPerson,
} from "@forhemit/shared/features/crm/records";
import type { CrmEntityType } from "@forhemit/shared/features/crm/records";

type Row = Record<string, unknown>;

export interface CrmResourceDef {
  table: string;
  rowToRecord: (row: Row) => unknown;
  inputToRow: (input: Row) => Row;
}

export const CRM_RESOURCES: Record<CrmEntityType, CrmResourceDef> = {
  people: {
    table: "crm_people",
    rowToRecord: rowToPerson,
    inputToRow: personToRow,
  },
  companies: {
    table: "crm_companies",
    rowToRecord: rowToCompany,
    inputToRow: companyToRow,
  },
  opportunities: {
    table: "crm_opportunities",
    rowToRecord: rowToOpportunity,
    inputToRow: opportunityToRow,
  },
  notes: {
    table: "crm_notes",
    rowToRecord: rowToNote,
    inputToRow: noteToRow,
  },
};

export function isCrmEntity(value: string): value is CrmEntityType {
  return value in CRM_RESOURCES;
}
