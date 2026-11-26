// Render-hook tests for the useCrm optimistic state hook (OD-13).

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCrm } from "@forhemit/shared/features/crm/records";
import type {
  CrmData,
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

function initialData(overrides: Partial<CrmData> = {}): CrmData {
  return {
    people: [person()],
    companies: [],
    opportunities: [],
    notes: [],
    ...overrides,
  };
}

function jsonResponse(body: unknown, ok = true): Response {
  return { ok, status: ok ? 200 : 500, json: async () => body } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useCrm", () => {
  it("starts with the server-fetched data and empty filters", () => {
    const { result } = renderHook(() => useCrm(initialData()));
    expect(result.current.data.people).toHaveLength(1);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.isMutating).toBe(false);
  });

  it("filters people by the search query", () => {
    const { result } = renderHook(() =>
      useCrm(initialData({ people: [person(), person({ id: "p2", firstName: "Grace" })] }))
    );
    act(() => result.current.setSearchQuery("grace"));
    expect(result.current.filteredPeople).toHaveLength(1);
    expect(result.current.filteredPeople[0]?.firstName).toBe("Grace");
  });

  it("creates a person optimistically and swaps in the server record", async () => {
    const serverPerson = person({ id: "server-id", firstName: "Grace" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(serverPerson))
    );
    const { result } = renderHook(() => useCrm(initialData()));

    await act(async () => {
      await result.current.createPerson({ firstName: "Grace", lastName: "Hopper" });
    });

    expect(result.current.data.people).toHaveLength(2);
    const created = result.current.data.people.find((p) => p.id === "server-id");
    expect(created?.kind).toBe("person");
    expect(result.current.toast.message).toBe("Contact created");
  });

  it("rolls the optimistic person back when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "boom" }, false))
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useCrm(initialData()));

    await act(async () => {
      await result.current.createPerson({ firstName: "Grace", lastName: "Hopper" });
    });

    expect(result.current.data.people).toHaveLength(1);
    expect(result.current.data.people[0]?.id).toBe("p1");
    expect(result.current.toast.tone).toBe("error");
    expect(consoleError).toHaveBeenCalled();
  });

  it("moves an opportunity optimistically and rolls back on failure", async () => {
    const { result } = renderHook(() =>
      useCrm(
        initialData({
          opportunities: [
            {
              id: "o1",
              kind: "opportunity",
              source: "manual",
              name: "Deal",
              stage: "prospect",
              amount: null,
              closeDate: null,
              personId: null,
              companyId: null,
              createdAt: "2026-01-03T00:00:00.000Z",
              updatedAt: "2026-01-03T00:00:00.000Z",
            },
          ],
        })
      )
    );

    // Failure first: the optimistic stage change is rolled back.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "boom" }, false))
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      await result.current.moveOpportunity("o1", "active");
    });
    expect(
      result.current.data.opportunities.find((o) => o.id === "o1")?.stage
    ).toBe("prospect");
    expect(consoleError).toHaveBeenCalled();

    // Then success: the stage sticks.
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));
    await act(async () => {
      await result.current.moveOpportunity("o1", "active");
    });
    expect(
      result.current.data.opportunities.find((o) => o.id === "o1")?.stage
    ).toBe("active");
  });

  it("adds a note after the server confirms", async () => {
    const serverNote = {
      id: "n1",
      body: "Hello",
      personId: "p1",
      companyId: null,
      opportunityId: null,
      source: "manual",
      createdAt: "2026-01-05T00:00:00.000Z",
      updatedAt: "2026-01-05T00:00:00.000Z",
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(serverNote)));
    const { result } = renderHook(() => useCrm(initialData()));

    await act(async () => {
      await result.current.addNote({
        body: "Hello",
        personId: "p1",
        companyId: null,
        opportunityId: null,
      });
    });

    expect(result.current.data.notes).toHaveLength(1);
    expect(result.current.data.notes[0]?.body).toBe("Hello");
  });

  it("deletes a record and its notes optimistically, rolling back on failure", async () => {
    const note = {
      id: "n1",
      body: "Note",
      personId: "p1",
      companyId: null,
      opportunityId: null,
      source: "manual" as const,
      createdAt: "2026-01-05T00:00:00.000Z",
      updatedAt: "2026-01-05T00:00:00.000Z",
    };
    const { result } = renderHook(() =>
      useCrm(initialData({ notes: [note] }))
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "boom" }, false))
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      await result.current.deleteRecord("people", "p1");
    });
    expect(result.current.data.people).toHaveLength(1);
    expect(result.current.data.notes).toHaveLength(1);
    expect(consoleError).toHaveBeenCalled();

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: true })));
    await act(async () => {
      await result.current.deleteRecord("people", "p1");
    });
    expect(result.current.data.people).toHaveLength(0);
    expect(result.current.data.notes).toHaveLength(0);
  });

  it("imports a Twenty payload and merges the created records", async () => {
    const importedPerson = person({ id: "tw-1", source: "twenty", firstName: "Grace" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          created: { people: [importedPerson], companies: [], opportunities: [] },
          skipped: [],
        })
      )
    );
    const { result } = renderHook(() => useCrm(initialData()));

    let imported = 0;
    await act(async () => {
      imported = await result.current.importTwenty({ people: [{ name: "Grace Hopper" }] });
    });

    expect(imported).toBe(1);
    expect(result.current.data.people).toHaveLength(2);
    const twenty = result.current.data.people.find((p) => p.source === "twenty");
    expect(twenty?.firstName).toBe("Grace");
    await waitFor(() => expect(result.current.toast.message).toContain("Imported 1"));
  });
});
