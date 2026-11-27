import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BlogIndex, type BlogEssay } from "@/app/blog/_components/BlogIndex";

const ESSAYS: BlogEssay[] = [
  {
    href: "/the-exit-crisis",
    sequenceLabel: "Start here · The problem",
    readTime: "8 minute read",
    title: "The Exit Crisis",
    standfirst: "Standfirst one.",
    audienceLabel: "For Owners",
    audiences: ["owners", "evidence"],
    editorsPick: true,
  },
  {
    href: "/beyond-the-balance-sheet",
    sequenceLabel: "Read next · The philosophy",
    readTime: "7 minute read",
    title: "Beyond the Balance Sheet",
    standfirst: "Standfirst two.",
    audienceLabel: "For Owners",
    audiences: ["owners"],
  },
];

describe("BlogIndex (D1 A Explora-model home)", () => {
  it("renders all six audience filter pills", () => {
    render(<BlogIndex essays={ESSAYS} />);
    for (const label of [
      "All",
      "For Owners",
      "For CPAs",
      "For Attorneys",
      "For Brokers",
      "Costs & Evidence",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
  });

  it("shows the Editors Pick featured card and the Latest grid by default", () => {
    render(<BlogIndex essays={ESSAYS} />);
    expect(screen.getByRole("heading", { name: "Editors Pick" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Latest" })).toBeTruthy();
    expect(screen.getByText("The Exit Crisis")).toBeTruthy();
    expect(screen.getByText("Beyond the Balance Sheet")).toBeTruthy();
    // Card meta is category • read-time
    expect(screen.getByText(/For Owners • 8 minute read/)).toBeTruthy();
    expect(screen.getByText(/For Owners • 7 minute read/)).toBeTruthy();
  });

  it("filters to Costs & Evidence, keeping only the evidence essay", () => {
    render(<BlogIndex essays={ESSAYS} />);
    fireEvent.click(screen.getByRole("button", { name: "Costs & Evidence" }));
    expect(screen.getByText("The Exit Crisis")).toBeTruthy();
    expect(screen.queryByText("Beyond the Balance Sheet")).toBeNull();
  });

  it("shows the empty state for an audience with no essays yet", () => {
    render(<BlogIndex essays={ESSAYS} />);
    fireEvent.click(screen.getByRole("button", { name: "For CPAs" }));
    expect(screen.getByText(/No essays for For CPAs yet/)).toBeTruthy();
    expect(screen.queryByText("The Exit Crisis")).toBeNull();
  });

  it("restores both essays when returning to All", () => {
    render(<BlogIndex essays={ESSAYS} />);
    fireEvent.click(screen.getByRole("button", { name: "For Brokers" }));
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("The Exit Crisis")).toBeTruthy();
    expect(screen.getByText("Beyond the Balance Sheet")).toBeTruthy();
  });

  it("marks the active pill with aria-pressed", () => {
    render(<BlogIndex essays={ESSAYS} />);
    const pill = screen.getByRole("button", { name: "For Attorneys" });
    fireEvent.click(pill);
    expect(pill.getAttribute("aria-pressed")).toBe("true");
  });
});
