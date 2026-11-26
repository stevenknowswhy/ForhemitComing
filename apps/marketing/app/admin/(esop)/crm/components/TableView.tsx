"use client";

// TableView (OD-13 D4) — the record table on the OD-11 primitives.
//
// Renders whichever entity type the type pills selected. Column headers sort
// through the useCrm sort config (name / stage / amount / createdAt); stage
// and source render as badges.

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  STAGE_META,
  displayName,
  formatAmount,
  formatCrmDate,
  sourceLabel,
} from "@forhemit/shared/features/crm/records";
import type {
  CrmRecord,
  CrmSortConfig,
  RecordEntityType,
} from "@forhemit/shared/features/crm/records";

interface TableViewProps {
  entityType: RecordEntityType;
  records: readonly CrmRecord[];
  sort: CrmSortConfig;
  onSort: (field: NonNullable<CrmSortConfig["field"]>) => void;
  onSelect: (record: CrmRecord) => void;
  onDelete: (id: string) => void;
}

const ENTITY_EMPTY: Record<RecordEntityType, string> = {
  people: "No people match the current filters.",
  companies: "No companies match the current filters.",
  opportunities: "No opportunities match the current filters.",
};

function SortHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: NonNullable<CrmSortConfig["field"]>;
  sort: CrmSortConfig;
  onSort: TableViewProps["onSort"];
}) {
  const active = sort.field === field;
  return (
    <TableHead aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex h-9 min-w-[44px] items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
      >
        {label}
        <span aria-hidden className="text-[9px]">
          {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </TableHead>
  );
}

export function TableView({
  entityType,
  records,
  sort,
  onSort,
  onSelect,
  onDelete,
}: TableViewProps) {
  const isOpportunity = entityType === "opportunities";
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <SortHeader label="Name" field="name" sort={sort} onSort={onSort} />
            {isOpportunity && (
              <SortHeader label="Stage" field="stage" sort={sort} onSort={onSort} />
            )}
            {isOpportunity && (
              <SortHeader label="Amount" field="amount" sort={sort} onSort={onSort} />
            )}
            {isOpportunity && <TableHead className="text-xs">Close date</TableHead>}
            {entityType === "people" && <TableHead className="text-xs">Email</TableHead>}
            {entityType === "companies" && <TableHead className="text-xs">Domain</TableHead>}
            <SortHeader label="Created" field="createdAt" sort={sort} onSort={onSort} />
            <TableHead className="text-xs">Source</TableHead>
            <TableHead className="text-right text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {ENTITY_EMPTY[entityType]}
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} data-entity={record.kind}>
                <TableCell className="max-w-[240px] truncate text-sm font-medium text-foreground">
                  <button
                    type="button"
                    onClick={() => onSelect(record)}
                    className="flex h-9 min-w-[44px] items-center text-left transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {displayName(record)}
                  </button>
                </TableCell>
                {isOpportunity && record.kind === "opportunity" && (
                  <>
                    <TableCell>
                      <Badge variant="outline">{STAGE_META[record.stage].label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatAmount(record.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatCrmDate(record.closeDate)}
                    </TableCell>
                  </>
                )}
                {entityType === "people" && record.kind === "person" && (
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {record.email ?? "—"}
                  </TableCell>
                )}
                {entityType === "companies" && record.kind === "company" && (
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {record.domain ?? "—"}
                  </TableCell>
                )}
                <TableCell className="text-sm text-muted-foreground">
                  {formatCrmDate(record.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={record.source === "twenty" ? "secondary" : "outline"}>
                    {sourceLabel(record)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(record.id)}
                    className="flex h-9 min-w-[44px] items-center justify-end text-xs text-muted-foreground transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label={`Delete ${displayName(record)}`}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
