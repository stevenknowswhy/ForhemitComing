// Unit tests for the CRM row serializers (OD-13).

import { describe, expect, it } from "vitest";
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
import type {
  Company,
  Note,
  Opportunity,
  Person,
} from "@forhemit/shared/features/crm/records";

const person: Person = {
  id: "p1",
  kind: "person",
  source: "manual",
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "555-0100",
  jobTitle: "Analyst",
  companyId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const company: Company = {
  id: "c1",
  kind: "company",
  source: "twenty",
  name: "Analytical Engines",
  domain: "analytical.example",
  industry: "Computing",
  city: "London",
  state: null,
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const opportunity: Opportunity = {
  id: "o1",
  kind: "opportunity",
  source: "manual",
  name: "Engagement deal",
  stage: "active",
  amount: 1200.5,
  closeDate: "2026-06-30",
  personId: "p1",
  companyId: "c1",
  createdAt: "2026-01-03T00:00:00.000Z",
  updatedAt: "2026-01-03T00:00:00.000Z",
};

const note: Note = {
  id: "n1",
  body: "Met at the conference",
  personId: "p1",
  companyId: null,
  opportunityId: null,
  source: "manual",
  createdAt: "2026-01-04T00:00:00.000Z",
  updatedAt: "2026-01-04T00:00:00.000Z",
};

describe("person round-trip", () => {
  it("serializes to snake_case row and back", () => {
    const row = personToRow(person);
    expect(row).toMatchObject({
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      job_title: "Analyst",
    });
    expect(row.id).toBeUndefined();
    const back = rowToPerson({ ...row, id: "new-id" });
    // Timestamps are DB-owned: a fresh insert row regenerates them.
    expect(back).toEqual({
      ...person,
      id: "new-id",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("carries the source override into the row (Twenty import path)", () => {
    expect(personToRow({ firstName: "Grace", source: "twenty" })).toMatchObject({
      source: "twenty",
    });
  });

  it("rejects invalid source values to the default", () => {
    const back = rowToPerson({
      ...personToRow(person),
      id: "p1",
      source: "hacker",
    });
    expect(back.source).toBe("manual");
  });
});

describe("company round-trip", () => {
  it("serializes to snake_case row and back", () => {
    const row = companyToRow(company);
    expect(row).toMatchObject({ name: "Analytical Engines", domain: "analytical.example" });
    const back = rowToCompany({ ...row, id: "c1" });
    expect(back).toEqual({
      ...company,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});

describe("opportunity round-trip", () => {
  it("serializes to snake_case row and back", () => {
    const row = opportunityToRow(opportunity);
    expect(row).toMatchObject({
      stage: "active",
      amount: 1200.5,
      person_id: "p1",
      company_id: "c1",
    });
    const back = rowToOpportunity({ ...row, id: "o1" });
    expect(back).toEqual({
      ...opportunity,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("coerces invalid stages to prospect", () => {
    const back = rowToOpportunity({
      ...opportunityToRow(opportunity),
      id: "o1",
      stage: "not-a-stage",
    });
    expect(back.stage).toBe("prospect");
  });
});

describe("note round-trip", () => {
  it("serializes to snake_case row and back", () => {
    const row = noteToRow(note);
    expect(row).toMatchObject({ body: note.body, person_id: "p1" });
    const back = rowToNote({ ...row, id: "n1" });
    expect(back).toEqual({
      ...note,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});

describe("input mappers", () => {
  it("accept partial input rows without ids or timestamps", () => {
    const back = rowToPerson({ first_name: "Grace", last_name: "Hopper" });
    expect(back.firstName).toBe("Grace");
    expect(back.email).toBeNull();
  });
});
