import type { ReactNode } from "react";
import Link from "next/link";
import type { DailyViewData, OutreachContactView, SyncHealthRow } from "../types";
import { formatPt } from "../lib/queries";
import { LogTouchButton } from "./LogTouchButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Presentational blocks for the /admin daily view (OD-11 D3). Exception-first
// summary cards built from the shared UI primitives; Needs-you and Pipeline
// render as scannable Table rows. No data fetching here — Blocks receives the
// already-assembled DailyViewData from the server component (DailyView), so
// the service-role key never crosses into client code.

/** Pill tone → Badge variant. `alert` marks rows/blocks that need the operator. */
type PillTone = "alert" | "steady" | "quiet";

const PILL_VARIANTS: Record<PillTone, "destructive" | "secondary" | "outline"> = {
  alert: "destructive",
  steady: "secondary",
  quiet: "outline",
};

function Pill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  // Fix pass #6: the shared Badge has no nowrap, so long phase pills
  // (READY-TO-ENGAGE, CLIENT-ACTIVE) wrapped onto two lines inside
  // the pill. A pill is one token — it never wraps.
  return (
    <Badge variant={PILL_VARIANTS[tone]} className="whitespace-nowrap">
      {children}
    </Badge>
  );
}

/** Shared card frame: title + count badge, status pill, view-all affordance. */
function SummaryCard({
  title,
  count,
  pill,
  viewAll,
  children,
}: {
  title: string;
  count: number | string;
  pill: ReactNode;
  viewAll?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge>{count}</Badge>
        </div>
        <div className="flex items-center gap-3">
          {pill}
          {viewAll}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** "View all" affordance where an admin area owns the data. */
function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      {label}
    </Link>
  );
}

/** "View all" affordance where no destination page exists: a no-JS disclosure. */
function ViewAllDetails({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-3">
      <summary className="inline-flex min-h-10 cursor-pointer items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        {label}
      </summary>
      {children}
    </details>
  );
}

// Fix pass #5: the visible label is the full "Open in CRM" — before,
// only "Open" rendered (the full phrase existed solely as the
// aria-label) and the action column was w-16 (64px), too narrow for
// the full phrase at text-sm regardless. The link is nowrap and the
// action columns below are w-32, so the whole label is always visible.
const CRM_ACTION = (
  <Link
    href="/admin/crm"
    className="whitespace-nowrap text-sm underline-offset-4 hover:underline"
    aria-label="Open in CRM"
  >
    Open in CRM
  </Link>
);

const emptyText = "text-sm text-muted-foreground";

export function SyncHealthLine({ health }: { health: SyncHealthRow | null }) {
  const h = health;
  if (!h) return <p className="text-sm opacity-75">Sync health: no sync record yet.</p>;
  const stale =
    h.last_ok_at && Date.now() - new Date(h.last_ok_at).getTime() > 30 * 60 * 1000;
  return (
    <p className="text-sm opacity-75">
      Spine sync: last OK {formatPt(h.last_ok_at)}
      {stale ? " — STALE (>30 min)" : ""}
      {h.last_error ? ` — last error: ${h.last_error}` : ""}
    </p>
  );
}

export function NeedsYou({ data }: { data: DailyViewData }) {
  const { awaitingReview, gateFailures, manualOpen } = data;
  const count = awaitingReview.length + gateFailures.length + manualOpen.length;
  const empty = count === 0;
  return (
    <SummaryCard
      title="Needs you today"
      count={count}
      pill={<Pill tone={empty ? "quiet" : "alert"}>{empty ? "Clear" : "Needs attention"}</Pill>}
      viewAll={<ViewAllLink href="/admin/crm" label="Open CRM" />}
    >
      {empty && <p className={emptyText}>Nothing is blocked on you right now.</p>}
      {!empty && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">Status</TableHead>
              <TableHead>Case / item</TableHead>
              <TableHead className="hidden md:table-cell">Detail</TableHead>
              <TableHead>Updated (PT)</TableHead>
              <TableHead className="w-32">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awaitingReview.map((i) => (
              <TableRow key={`${i.caseId}:${i.code}`}>
                <TableCell><Pill tone="steady">Awaiting review</Pill></TableCell>
                <TableCell>
                  <span className="font-medium">{i.caseId}</span> · {i.code} — {i.title}
                  {i.owner ? <span className="text-muted-foreground"> (owner: {i.owner})</span> : null}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  Checklist item awaiting review
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatPt(i.updatedAt)}
                </TableCell>
                <TableCell>{CRM_ACTION}</TableCell>
              </TableRow>
            ))}
            {gateFailures.map((g) => (
              <TableRow key={`${g.caseId}:${g.gate}`}>
                <TableCell><Pill tone="alert">Gate FAIL</Pill></TableCell>
                <TableCell>
                  <span className="font-medium">{g.caseId}</span> · Gate “{g.gate}” last evaluated FAIL
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  Spine gate check failed
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatPt(g.at)}
                </TableCell>
                <TableCell>{CRM_ACTION}</TableCell>
              </TableRow>
            ))}
            {manualOpen.map((m) => (
              <TableRow key={m.id}>
                <TableCell><Pill tone="quiet">Open</Pill></TableCell>
                <TableCell>
                  <span className="font-medium">{m.kind}</span> — {m.subject}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {m.detail ?? "Manual follow-up"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatPt(m.at)}
                </TableCell>
                <TableCell>{CRM_ACTION}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SummaryCard>
  );
}

const OUTREACH_VISIBLE = 5;

/** One researched-contact line: identity, touch history, one-tap log button. */
function OutreachRow({ c }: { c: OutreachContactView }) {
  const next = c.touchDue.nextTouch;
  return (
    // Fix pass #7: the text lives in its own flex cell (flex-1,
    // min-w-0) so a long company name wraps inside the cell, and the
    // log button is a non-shrinking sibling anchored in the row —
    // before, one un-sized span took the full row width and pushed
    // the button onto its own orphaned line (TX-05R).
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="min-w-0 flex-1">
        <span className="font-medium">{c.packet_id}</span> · {c.company}
        {c.founder ? <span> — {c.founder}</span> : null}
        {c.grade != null ? <span className="text-muted-foreground"> · grade {c.grade}</span> : null}
        {c.tof1_status ? <span className="text-muted-foreground"> · {c.tof1_status}</span> : null}
        {c.touches.map((t) => (
          <span key={t.id} className="text-muted-foreground">
            {" "}· T{t.touch_no} {formatPt(t.sent_at)}
          </span>
        ))}
        {c.touchDue.state === "complete" ? (
          <span className="text-muted-foreground"> · all touches sent</span>
        ) : null}
      </span>
      {next != null ? (
        <span className="flex-none">
          <LogTouchButton contactId={c.id} touchNo={next} />
        </span>
      ) : null}
    </li>
  );
}

export function OutreachToday({ data }: { data: DailyViewData }) {
  const o = data.outreach;
  const visible = o.researched.slice(0, OUTREACH_VISIBLE);
  const rest = o.researched.slice(OUTREACH_VISIBLE);
  return (
    <SummaryCard
      title="Outreach today"
      count={`${o.researched.length}/${o.totalSlots}`}
      pill={
        <Pill tone={o.touchDue.length > 0 ? "alert" : "steady"}>
          {o.touchDue.length > 0 ? `${o.touchDue.length} touch${o.touchDue.length === 1 ? "" : "es"} due` : "In progress"}
        </Pill>
      }
    >
      <p className={emptyText}>
        {o.researched.length} researched of {o.totalSlots} pilot slots ·{" "}
        {o.replies} replies · {o.checksCompleted} checks completed ·{" "}
        {o.introCallsBooked} intro calls booked
      </p>
      {o.touchDue.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Touch due</p>
          <ul className="mt-1 space-y-1 text-sm">
            {o.touchDue.map((c) => (
              // Same fix #7 layout as OutreachRow: text wraps in its
              // own flex cell; pill and button stay anchored.
              <li key={c.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="flex-none">
                  <Pill tone="alert">{c.touchDue.state === "overdue" ? "Overdue" : "Due"}</Pill>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{c.packet_id}</span> · {c.company} — Touch{" "}
                  {c.touchDue.nextTouch}
                  {c.touchDue.daysSinceFirstTouch != null ? (
                    <span className="text-muted-foreground">
                      {" "}· day {c.touchDue.daysSinceFirstTouch} since Touch 1
                    </span>
                  ) : (
                    <span className="text-muted-foreground"> · not started</span>
                  )}
                </span>
                {c.touchDue.nextTouch != null ? (
                  <span className="flex-none">
                    <LogTouchButton contactId={c.id} touchNo={c.touchDue.nextTouch} />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {visible.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {visible.map((c) => (
            <OutreachRow key={c.packet_id} c={c} />
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <ViewAllDetails label={`View all ${o.researched.length} researched contacts`}>
          <ul className="mt-2 space-y-1 text-sm">
            {rest.map((c) => (
              <OutreachRow key={c.packet_id} c={c} />
            ))}
          </ul>
        </ViewAllDetails>
      )}
    </SummaryCard>
  );
}

export function Pipeline({ data }: { data: DailyViewData }) {
  return (
    <SummaryCard
      title="Pipeline"
      count={data.pipeline.length}
      pill={<Pill tone="steady">In flight</Pill>}
      viewAll={<ViewAllLink href="/admin/crm" label="Open CRM" />}
    >
      {data.pipeline.length === 0 && <p className={emptyText}>No cases in the spine yet.</p>}
      {data.pipeline.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Phase</TableHead>
              <TableHead>Case</TableHead>
              <TableHead className="hidden md:table-cell">Checklist</TableHead>
              <TableHead>Updated (PT)</TableHead>
              <TableHead className="w-32">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pipeline.map((c) => (
              <TableRow key={c.id}>
                <TableCell><Pill tone="quiet">{c.phase}</Pill></TableCell>
                <TableCell>
                  <span className="font-medium">{c.id}</span> · {c.clientName}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {c.reviewed} reviewed / {c.awaitingReview} awaiting review / {c.open} open (of {c.total})
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatPt(c.updatedAt)}
                </TableCell>
                <TableCell>{CRM_ACTION}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SummaryCard>
  );
}

export function DoneToday({ data }: { data: DailyViewData }) {
  const d = data.done;
  return (
    <SummaryCard
      title="Done"
      count={d.totalEvents}
      pill={<Pill tone="steady">Recorded</Pill>}
    >
      <p className={emptyText}>
        {d.totalEvents} spine audit events, {d.windowLabel}. Proven from the
        audit log — nothing here was typed in.
      </p>
      {d.byEvent.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {d.byEvent.map((b) => (
            <li key={b.event}>
              {b.event} <span className="text-muted-foreground">× {b.count}</span>
            </li>
          ))}
        </ul>
      )}
      {d.latest.length > 0 && (
        <ViewAllDetails label={`View ${d.latest.length} latest events`}>
          <ul className="mt-2 space-y-1 text-sm">
            {d.latest.map((e) => (
              <li key={e.id}>
                {e.event} · {e.case_id ?? "—"} ·{" "}
                <span className="text-muted-foreground">{formatPt(e.at)}</span>
              </li>
            ))}
          </ul>
        </ViewAllDetails>
      )}
    </SummaryCard>
  );
}
