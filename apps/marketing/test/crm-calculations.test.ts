// Unit tests for the CRM records pure helpers (OD-13).

import { describe, expect, it } from "vitest";
import {
  calculateMetrics,
  filterRecords,
  groupByStage,
  nextStage,
  recordMatchesSearch,
  sortRecords,
} from "@forhemit/shared/features/crm/records";
import type {
  Company,
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
    name: "Analytical Engines",
    domain: "analytical.example",
    industry: null,
    city: null,
    state: null,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

function opportunity(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: "o1",
    kind: "opportunity",
    source: "manual",
    name: "Engagement deal",
    stage: "prospect",
    amount: null,
    closeDate: null,
    personId: null,
    companyId: null,
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
    ...overrides,
  };
}

describe("recordMatchesSearch", () => {
  it("matches everything for blank search", () => {
    expect(recordMatchesSearch(person(), "")).toBe(true);
    expect(recordMatchesSearch(person(), "   ")).toBe(true);
  });

  it("matches people by first name, last name, email, and job title", () => {
    expect(recordMatchesSearch(person(), "ada")).toBe(true);
    expect(recordMatchesSearch(person(), "lovelace")).toBe(true);
    expect(recordMatchesSearch(person(), "ada@example.com")).toBe(true);
    expect(recordMatchesSearch(person({ jobTitle: "Engineer" }), "engin")).toBe(
      true
    );
  });

  it("matches companies by name, domain, and industry", () => {
    expect(recordMatchesSearch(company(), "analytical")).toBe(true);
    expect(recordMatchesSearch(company(), "analytical.example")).toBe(true);
    expect(
      recordMatchesSearch(company({ industry: "Manufacturing" }), "manufact")
    ).toBe(true);
  });

  it("matches opportunities by name", () => {
    expect(recordMatchesSearch(opportunity(), "deal")).toBe(true);
  });

  it("is case-insensitive and rejects non-matches", () => {
    expect(recordMatchesSearch(person(), "ADA")).toBe(true);
    expect(recordMatchesSearch(person(), "grace")).toBe(false);
  });
});

describe("filterRecords", () => {
  const records = [
    person(),
    company(),
    opportunity(),
    opportunity({ id: "o2", stage: "active", source: "twenty" }),
  ];

  it("filters by source", () => {
    const result = filterRecords(records, { source: "twenty" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("o2");
  });

  it("filters non-opportunities out when a stage filter is set", () => {
    const result = filterRecords(records, { stage: "active" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("o2");
  });

  it("combines search, stage, and source filters", () => {
    const result = filterRecords(records, {
      search: "deal",
      stage: "prospect",
      source: "manual",
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("o1");
  });

  it("returns everything with empty options", () => {
    expect(filterRecords(records)).toHaveLength(4);
  });
});

describe("sortRecords", () => {
  it("sorts people and companies by display name", () => {
    const sorted = sortRecords([person({ firstName: "Zoe" }), person()], {
      field: "name",
      dir: "asc",
    });
    expect(sorted[0]?.kind === "person" && sorted[0].firstName).toBe("Ada");
  });

  it("sorts opportunities by pipeline stage order, not alphabetically", () => {
    const sorted = sortRecords(
      [
        opportunity({ id: "a", stage: "preferred" }),
        opportunity({ id: "b", stage: "prospect" }),
        opportunity({ id: "c", stage: "dormant" }),
      ],
      { field: "stage", dir: "asc" }
    );
    expect(sorted.map((r) => (r.kind === "opportunity" ? r.stage : null))).toEqual(
      ["prospect", "preferred", "dormant"]
    );
  });

  it("sorts opportunities by amount with nulls as zero", () => {
    const sorted = sortRecords(
      [
        opportunity({ id: "a", amount: 500 }),
        opportunity({ id: "b", amount: null }),
        opportunity({ id: "c", amount: 1000 }),
      ],
      { field: "amount", dir: "desc" }
    );
    expect(sorted.map((r) => (r.kind === "opportunity" ? r.amount : null))).toEqual([
      1000, 500, null,
    ]);
  });

  it("sorts by createdAt chronologically", () => {
    const sorted = sortRecords(
      [opportunity({ createdAt: "2026-03-01T00:00:00.000Z" }), company()],
      { field: "createdAt", dir: "asc" }
    );
    expect(sorted[0]?.kind).toBe("company");
  });

  it("does not mutate the input array and copies when no field is set", () => {
    const records = [opportunity({ amount: 1 }), opportunity({ amount: 2 })];
    const result = sortRecords(records, { field: null, dir: "asc" });
    expect(result).not.toBe(records);
    expect(result).toEqual(records);
  });
});

describe("groupByStage", () => {
  it("returns every stage in STAGE_ORDER order, including empty ones", () => {
    const grouped = groupByStage([opportunity({ stage: "active" })]);
    expect(Object.keys(grouped)).toEqual([
      "prospect",
      "introduced",
      "active",
      "preferred",
      "dormant",
    ]);
    expect(grouped.active).toHaveLength(1);
    expect(grouped.prospect).toHaveLength(0);
  });
});

describe("nextStage", () => {
  it("walks the pipeline forward", () => {
    expect(nextStage("prospect")).toBe("introduced");
    expect(nextStage("active")).toBe("preferred");
  });

  it("returns null at the end of the pipeline", () => {
    expect(nextStage("dormant")).toBeNull();
  });
});

describe("calculateMetrics", () => {
  it("counts records, tracks Twenty-sourced rows, and sums open pipeline value", () => {
    const metrics = calculateMetrics({
      people: [person(), person({ id: "p2", source: "twenty" })],
      companies: [company()],
      opportunities: [
        opportunity({ stage: "active", amount: 2500 }),
        opportunity({ id: "o2", stage: "dormant", amount: 9999 }),
      ],
      notes: [],
    });
    expect(metrics.people).toBe(2);
    expect(metrics.companies).toBe(1);
    expect(metrics.opportunities).toBe(2);
    expect(metrics.notes).toBe(0);
    expect(metrics.fromTwenty).toBe(1);
    expect(metrics.pipelineValue).toBe(2500);
    expect(metrics.byStage).toEqual({
      prospect: 0,
      introduced: 0,
      active: 1,
      preferred: 0,
      dormant: 1,
    });
  });
});
