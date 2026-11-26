// Unit tests for the Twenty import mapper (OD-13).

import { describe, expect, it } from "vitest";
import {
  isTwentyImportPayload,
  isTwentySource,
  mapTwentyImport,
} from "@forhemit/shared/features/crm/records";

const SAMPLE_PAYLOAD = {
  people: [
    {
      id: "person-uuid-1",
      name: "Grace Hopper",
      emails: { primaryEmail: "grace@navy.mil" },
      companyId: "company-uuid-1",
      jobTitle: "Rear Admiral",
    },
    { firstName: "", lastName: "" }, // skipped: no name at all
  ],
  companies: [
    {
      id: "company-uuid-1",
      name: "US Navy",
      domain: "navy.mil",
      industry: "Defense",
      city: "Arlington",
      state: "VA",
    },
    { name: "US Navy", domain: "duplicate.example" }, // deduped by name
    { domain: "no-name.example" }, // skipped: missing name
  ],
  opportunities: [
    {
      id: "opp-uuid-1",
      name: "Compiler modernization",
      stage: "MEETING",
      amount: { amountMicros: 4_500_000_000 },
      companyId: "company-uuid-1",
    },
  ],
};

describe("isTwentyImportPayload", () => {
  it("accepts objects carrying at least one known entity array", () => {
    expect(isTwentyImportPayload({ people: [] })).toBe(true);
    expect(isTwentyImportPayload(SAMPLE_PAYLOAD)).toBe(true);
  });

  it("rejects non-objects and unrelated shapes", () => {
    expect(isTwentyImportPayload(null)).toBe(false);
    expect(isTwentyImportPayload("people")).toBe(false);
    expect(isTwentyImportPayload([])).toBe(false);
    expect(isTwentyImportPayload({ contacts: [] })).toBe(false);
  });
});

describe("mapTwentyImport", () => {
  const result = mapTwentyImport(SAMPLE_PAYLOAD);

  it("tags every mapped record with source twenty", () => {
    for (const person of result.people) expect(person.source).toBe("twenty");
    for (const record of [...result.companies, ...result.opportunities]) {
      expect(record.source).toBe("twenty");
    }
  });

  it("maps people with split names, nested emails, and title", () => {
    expect(result.people).toHaveLength(1);
    const person = result.people[0]!;
    expect(person.firstName).toBe("Grace");
    expect(person.lastName).toBe("Hopper");
    expect(person.email).toBe("grace@navy.mil");
    expect(person.jobTitle).toBe("Rear Admiral");
    expect(person.twentyCompanyId).toBe("company-uuid-1");
  });

  it("de-duplicates companies by name and reports skipped entries", () => {
    expect(result.companies).toHaveLength(1);
    expect(result.companies[0]?.name).toBe("US Navy");
    expect(result.skipped).toEqual([
      { entity: "companies", index: 2, reason: "missing name" },
      { entity: "people", index: 1, reason: "missing name" },
    ]);
  });

  it("maps opportunities with stage mapping and micro amounts", () => {
    const opportunity = result.opportunities[0]!;
    expect(opportunity.name).toBe("Compiler modernization");
    expect(opportunity.stage).toBe("active");
    expect(opportunity.amount).toBe(4500);
    expect(opportunity.companyId).toBeNull();
    expect(opportunity.twentyCompanyId).toBe("company-uuid-1");
  });

  it("resolves company references by company name when ids are absent", () => {
    const result = mapTwentyImport({
      companies: [{ name: "Acme" }],
      people: [{ name: "Jane Doe", companyName: "Acme" }],
    });
    expect(result.people[0]?.twentyCompanyId).toBe("company-0");
  });

  it("returns empty mappings for non-payload input", () => {
    const result = mapTwentyImport("not a payload");
    expect(result.people).toHaveLength(0);
    expect(result.companies).toHaveLength(0);
    expect(result.opportunities).toHaveLength(0);
  });

  it("defaults unknown stages to prospect", () => {
    const result = mapTwentyImport({
      opportunities: [{ name: "Mystery deal", stage: "WARP SPEED" }],
    });
    expect(result.opportunities[0]?.stage).toBe("prospect");
  });
});

describe("isTwentySource", () => {
  it("accepts only the twenty tag", () => {
    expect(isTwentySource("twenty")).toBe(true);
    expect(isTwentySource("manual")).toBe(false);
    expect(isTwentySource(undefined)).toBe(false);
  });
});
