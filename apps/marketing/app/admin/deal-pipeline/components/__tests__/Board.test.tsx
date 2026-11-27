import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Board } from "../Board";
import { RegisterTable } from "../RegisterTable";
import { FUNNEL_STEPS, PIPELINE_BANDS, PIPELINE_STAGES } from "../../lib/stage";
import type {
  ContactDeal,
  PipelineData,
  PipelineStageId,
  StewardshipRow,
} from "../../types";

// Render guard for the 2026-11-26 fix pass on the pipeline board:
// #1 Band D renders its register table structure even when empty;
// #3 empty stages collapse to slim rails next to a populated sibling
// (and stay full columns in a fully-empty band). Pure presentational
// — PipelineData is fabricated in memory, no data fetching.

function contactDeal(stage: PipelineStageId): ContactDeal {
  return {
    kind: "contact",
    key: `contact:${stage}`,
    stage,
    packetId: "TX-99",
    company: "Rail Test Contractors",
    founder: "Test Founder",
    grade: 80,
    tof1Status: "researched",
    replyStatus: null,
    checkCompleted: false,
    introCallBooked: false,
    touchCount: 0,
    lastTouchAt: null,
    touchDue: { nextTouch: 1, state: "not-started", label: "Touch 1 not sent", days: 0 },
    sideStates: [],
    nextAction: "Send Touch 1",
    updatedAt: "2026-11-26T00:00:00Z",
    updatedDaysAgo: 0,
  };
}

function sampleData(populatedStage: PipelineStageId | null): PipelineData {
  const dealsByStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.id, [] as PipelineData["dealsByStage"][PipelineStageId]]),
  ) as PipelineData["dealsByStage"];
  const perStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s.id, 0]),
  ) as PipelineData["counts"]["perStage"];
  if (populatedStage) {
    dealsByStage[populatedStage] = [contactDeal(populatedStage)];
    perStage[populatedStage] = 1;
  }
  return {
    bands: PIPELINE_BANDS,
    stages: PIPELINE_STAGES,
    funnelSteps: FUNNEL_STEPS,
    dealsByStage,
    actionQueue: [],
    stewardship: [],
    counts: {
      perStage,
      totalDeals: populatedStage ? 1 : 0,
      totalResearched: 0,
      totalSlots: 31,
      activeCases: 0,
      gateFailures: 0,
      actionNeeded: 0,
    },
  };
}

describe("Pipeline board fix pass", () => {
  it("#1: Band D renders the register header row above the empty-state note", () => {
    render(<Board data={sampleData(null)} />);

    for (const header of [
      "Company",
      "Stage",
      "Post-close day",
      "Next deliverable due",
      "Fee status",
    ]) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
    expect(screen.getByText(/No stewardship cases yet/)).toBeInTheDocument();
  });

  it("#1: RegisterTable renders a populated row with em-dash fallbacks", () => {
    const row: StewardshipRow = {
      key: "case:CASE-9",
      caseId: "CASE-9",
      company: "Closed Co",
      stage: "d-s1-first-90",
      stageLabel: "S1 First 90 days",
      postCloseDay: null,
      nextDeliverable: null,
      feeStatus: null,
    };
    const { container } = render(<RegisterTable rows={[row]} />);

    expect(screen.getByText(/Closed Co/)).toBeInTheDocument();
    expect(container.querySelectorAll("tbody td")).toHaveLength(5);
  });

  it("#3: empty Band B stages collapse to rails when Onboarding holds a deal", () => {
    const { container } = render(<Board data={sampleData("b-onboarding")} />);

    // Application, Approval & path choice, Documents-Ready are rails;
    // Onboarding renders the full card column.
    expect(container.querySelectorAll(".dp-rail")).toHaveLength(3);
    expect(screen.getByText("Rail Test Contractors")).toBeInTheDocument();
    // The lanes grid gives rails a slim 52px track (inline template).
    const laneStyles = Array.from(container.querySelectorAll(".dp-lanes")).map(
      (el) => el.getAttribute("style") ?? "",
    );
    expect(laneStyles.some((style) => style.includes("52px"))).toBe(true);
  });

  it("#3: a fully-empty band keeps full columns (no rails), so empty notes stay readable", () => {
    const { container } = render(<Board data={sampleData(null)} />);

    expect(container.querySelectorAll(".dp-rail")).toHaveLength(0);
  });

  it("#8: the board ships the ≤640px stacking rules with its style block", () => {
    const { container } = render(<Board data={sampleData(null)} />);

    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain(".dp-lanes");
    expect(css).toContain(".dp-queue-grid");
  });
});
