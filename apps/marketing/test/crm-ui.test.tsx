// Render tests for the /admin/crm client island (OD-13 D4).
//
// Covers the three D4 render-test requirements: view switching
// (pipeline/table), filtering (search + stage pills), and the empty state.
// Rendering only — the mutation/rollback paths are covered by the useCrm
// hook tests and the route tests from PR A.

import { render, screen, within, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CrmClient } from "@/app/admin/(esop)/crm/CrmClient";
import type {
  Company,
  CrmData,
  Note,
  Opportunity,
  Person,
} from "@forhemit/shared/features/crm/records";

function person(overrides: Partial<Person> = {}): Person {
  return {
    id: "p1",
    kind: "person",
    source: "manual",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: null,
    jobTitle: null,
    companyId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function company(overrides: Partial<Company> = {}): Company {
  return {
    id: "c1",
    kind: "company",
    source: "manual",
    name: "Acme Trust Co",
    domain: "acme.com",
    industry: null,
    city: null,
    state: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function opportunity(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: "o1",
    kind: "opportunity",
    source: "manual",
    name: "ESOP rollover",
    stage: "prospect",
    amount: 250000,
    closeDate: null,
    personId: null,
    companyId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function note(overrides: Partial<Note> = {}): Note {
  return {
    id: "n1",
    source: "manual",
    body: "First contact",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    personId: "p1",
    companyId: null,
    opportunityId: null,
    ...overrides,
  };
}

const DATA: CrmData = {
  people: [person()],
  companies: [company()],
  opportunities: [
    opportunity(),
    opportunity({ id: "o2", name: "Buyout advisory", stage: "active", amount: 90000 }),
  ],
  notes: [note()],
};

const EMPTY: CrmData = { people: [], companies: [], opportunities: [], notes: [] };

function typeSearch(value: string) {
  fireEvent.change(screen.getByLabelText("Search records"), {
    target: { value },
  });
}

describe("CrmClient", () => {
  it("renders the pipeline view by default with stage columns and cards", () => {
    render(<CrmClient initial={DATA} />);

    expect(screen.getByRole("tab", { name: /pipeline/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // All five stage columns render (query by column aria-labels — the
    // stage labels also appear as filter pills).
    for (const label of ["Prospect", "Introduced", "Active", "Preferred", "Dormant"]) {
      expect(screen.getByLabelText(`${label} column`)).toBeInTheDocument();
    }
    // Opportunity cards are visible.
    expect(screen.getByText("ESOP rollover")).toBeInTheDocument();
    expect(screen.getByText("Buyout advisory")).toBeInTheDocument();
    // Metrics render.
    expect(screen.getByText("Pipeline value")).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();
  });

  it("switches to the table view and shows the opportunities table", () => {
    render(<CrmClient initial={DATA} />);

    fireEvent.click(screen.getByRole("tab", { name: /table/i }));

    expect(screen.getByRole("tab", { name: /table/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    // The default type filter (All) maps to the opportunities table.
    expect(screen.getByText("ESOP rollover")).toBeInTheDocument();
  });

  it("filters records by search query", () => {
    render(<CrmClient initial={DATA} />);

    typeSearch("buyout");

    expect(screen.queryByText("ESOP rollover")).not.toBeInTheDocument();
    expect(screen.getByText("Buyout advisory")).toBeInTheDocument();
  });

  it("filters the pipeline by stage pill", () => {
    render(<CrmClient initial={DATA} />);

    fireEvent.click(screen.getByRole("button", { name: /^Active \(1\)$/ }));

    expect(screen.queryByText("ESOP rollover")).not.toBeInTheDocument();
    expect(screen.getByText("Buyout advisory")).toBeInTheDocument();

    // Clearing the filter restores both cards.
    fireEvent.click(screen.getByRole("button", { name: /^Active \(1\)$/ }));
    expect(screen.getByText("ESOP rollover")).toBeInTheDocument();
  });

  it("shows the empty state when there are no records", () => {
    render(<CrmClient initial={EMPTY} />);

    expect(screen.getByText("No records yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add a person/i })
    ).toBeInTheDocument();
  });

  it("shows the server notice banner when data could not be loaded", () => {
    render(<CrmClient initial={EMPTY} notice="Could not load CRM records." />);

    expect(screen.getByText("Could not load CRM records.")).toBeInTheDocument();
    // The empty state CTA is not shown while degraded.
    expect(screen.queryByText("No records yet")).not.toBeInTheDocument();
  });

  it("renders people in the table when the People type pill is selected", () => {
    render(<CrmClient initial={DATA} />);

    fireEvent.click(screen.getByRole("tab", { name: /table/i }));
    fireEvent.click(screen.getByRole("button", { name: /^People1$/ }));

    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.queryByText("ESOP rollover")).not.toBeInTheDocument();
  });

  it("shows an empty-table message when filters match nothing", () => {
    render(<CrmClient initial={DATA} />);

    fireEvent.click(screen.getByRole("tab", { name: /table/i }));
    typeSearch("zzz-no-match");

    expect(
      screen.getByText("No opportunities match the current filters.")
    ).toBeInTheDocument();
  });

  it("opens the detail slide-over with the stage fallback select and closes on Escape", () => {
    render(<CrmClient initial={DATA} />);

    // Open the detail for an opportunity card.
    fireEvent.click(screen.getByText("ESOP rollover"));
    const dialog = screen.getByRole("dialog", { name: /details/i });
    expect(dialog).toBeInTheDocument();

    // The keyboard DnD fallback: stage select in the detail panel.
    const stageSelect = within(dialog).getByLabelText("Stage");
    expect(stageSelect).toBeInTheDocument();

    // Escape closes the topmost overlay.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: /details/i })
    ).not.toBeInTheDocument();
  });

  it("renders the import area with a paste target and file picker", () => {
    render(<CrmClient initial={DATA} />);

    fireEvent.click(screen.getByRole("button", { name: /^Import$/ }));

    expect(screen.getByLabelText("Twenty JSON payload")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /choose file/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /import records/i })).toBeDisabled();
  });

  it("renders a Twenty-source badge on imported records", () => {
    render(
      <CrmClient
        initial={{
          ...DATA,
          opportunities: [opportunity({ source: "twenty", id: "o9" })],
        }}
      />
    );

    expect(screen.getAllByText("Twenty").length).toBeGreaterThan(0);
  });
});
