import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DoneToday, NeedsYou, OutreachToday, Pipeline } from "../Blocks";
import type { DailyViewData } from "../../types";

// Render guard for the OD-11 D3 restyle: pins the exception-first structure
// (pill labels, count badges, table row counts) so a styling change cannot
// silently drop rows or status pills. Pure presentational — no data fetching.

function sampleData(): DailyViewData {
  return {
    syncHealth: null,
    awaitingReview: [
      { caseId: "CASE-1", code: "DOC-01", title: "Engagement letter", owner: "Stefano", updatedAt: "2026-11-25T18:00:00Z" },
    ],
    gateFailures: [
      { caseId: "CASE-2", gate: "background_check", at: "2026-11-25T19:00:00Z" },
    ],
    manualOpen: [
      { id: "m-1", kind: "follow_up", subject: "Call the founder", detail: "Wants intro call", at: "2026-11-25T20:00:00Z", done: false },
    ],
    outreach: {
      totalSlots: 8,
      researched: [
        { packet_id: "P-1", company: "Acme", founder: "A", grade: 3, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
        { packet_id: "P-2", company: "Beta", founder: "B", grade: 2, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
        { packet_id: "P-3", company: "Gamma", founder: "C", grade: 4, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
        { packet_id: "P-4", company: "Delta", founder: "D", grade: 3, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
        { packet_id: "P-5", company: "Epsilon", founder: "E", grade: 1, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
        { packet_id: "P-6", company: "Zeta", founder: "F", grade: 2, tof1_status: "researched", reply_status: null, check_completed: false, intro_call_booked: false },
      ],
      replies: 1,
      checksCompleted: 1,
      introCallsBooked: 1,
    },
    pipeline: [
      { id: "CASE-1", clientName: "Acme", phase: "due_diligence", total: 10, reviewed: 4, awaitingReview: 1, open: 2, updatedAt: "2026-11-25T18:00:00Z" },
      { id: "CASE-2", clientName: "Beta", phase: "intro", total: 6, reviewed: 1, awaitingReview: 0, open: 3, updatedAt: "2026-11-25T17:00:00Z" },
    ],
    done: {
      windowLabel: "last 24 hours",
      totalEvents: 14,
      byEvent: [
        { event: "case.created", count: 2 },
        { event: "checklist.reviewed", count: 12 },
      ],
      latest: [
        { id: "e-1", case_id: "CASE-1", event: "checklist.reviewed", actor: "spine", at: "2026-11-25T21:00:00Z", hash: null },
      ],
    },
  };
}

describe("Daily view blocks (OD-11 D3)", () => {
  it("NeedsYou renders a Needs-attention pill, one table row per exception, and an Open action", () => {
    render(<NeedsYou data={sampleData()} />);

    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    // One row per exception: 1 awaiting review + 1 gate failure + 1 manual open.
    const rows = screen.getAllByRole("row");
    // 1 header row + 3 exception rows
    expect(rows).toHaveLength(4);
    expect(screen.getByText("Awaiting review")).toBeInTheDocument();
    expect(screen.getByText("Gate FAIL")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open in CRM" })).toHaveLength(3);
  });

  it("NeedsYou collapses to a Clear pill with no table when there are no exceptions", () => {
    const data = sampleData();
    data.awaitingReview = [];
    data.gateFailures = [];
    data.manualOpen = [];
    render(<NeedsYou data={data} />);

    expect(screen.getByText("Clear")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("Nothing is blocked on you right now.")).toBeInTheDocument();
  });

  it("OutreachToday renders a count badge and In-progress pill", () => {
    render(<OutreachToday data={sampleData()} />);

    expect(screen.getByText("Outreach today")).toBeInTheDocument();
    expect(screen.getByText("6/8")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("Pipeline renders one table row per case with the phase pill and an Open action", () => {
    render(<Pipeline data={sampleData()} />);

    expect(screen.getByText("In flight")).toBeInTheDocument();
    const body = screen.getAllByRole("rowgroup")[1];
    expect(within(body).getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("due_diligence")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open in CRM" })).toHaveLength(2);
  });

  it("DoneToday renders a Recorded pill and the audit-event summary", () => {
    render(<DoneToday data={sampleData()} />);

    expect(screen.getByText("Recorded")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("case.created")).toBeInTheDocument();
  });
});
