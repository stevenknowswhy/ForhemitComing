// @vitest-environment node
// Route tests for the guarded CRM API (OD-13).
//
// The data layer is mocked at the network boundary (globalThis.fetch, which
// the PostgREST client uses), so the handlers, guard, registry, and
// serializers are all exercised for real.

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { signAdminSession } from "@/lib/admin-session";

// supabase.ts captures SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY at module
// load, so the env must exist before the route modules are imported.
vi.hoisted(() => {
  process.env.ADMIN_TOKEN = "test-admin-token";
  process.env.SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-key";
});
import { GET as listGET, POST as createPOST } from "./[resource]/route";
import { DELETE as deleteDELETE, PATCH as recordPATCH } from "./[resource]/[id]/route";
import { POST as importPOST } from "./import/route";
import { GET as exportGET } from "./export/route";

const ADMIN_TOKEN = "test-admin-token";
let sessionCookie: string;

/** Handler signature for the 401 matrix; exportGET ignores the context. */
type Handler = (
  request: Request,
  context: { params: Promise<{ resource: string; id: string }> }
) => Promise<Response>;

function requestWithCookie(
  url: string,
  init: RequestInit & { body?: string } = {}
): Request {
  return new Request(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}

function authenticatedRequest(
  url: string,
  init: RequestInit & { body?: string } = {}
): Request {
  const request = requestWithCookie(url, init);
  request.headers.set("cookie", `forhemit_admin_sess=${sessionCookie}`);
  return request;
}

beforeAll(async () => {
  sessionCookie = await signAdminSession(process.env.ADMIN_TOKEN!);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("unauthenticated access", () => {
  const cases: [string, Request, Handler][] = [
    [
      "GET list",
      requestWithCookie("https://app.test/api/admin/crm/people"),
      listGET,
    ],
    [
      "POST create",
      requestWithCookie("https://app.test/api/admin/crm/people", {
        method: "POST",
        body: JSON.stringify({ firstName: "X" }),
      }),
      createPOST,
    ],
    [
      "PATCH record",
      requestWithCookie("https://app.test/api/admin/crm/people/p1", {
        method: "PATCH",
        body: JSON.stringify({ firstName: "X" }),
      }),
      recordPATCH,
    ],
    [
      "DELETE record",
      requestWithCookie("https://app.test/api/admin/crm/people/p1", {
        method: "DELETE",
      }),
      deleteDELETE,
    ],
    [
      "POST import",
      requestWithCookie("https://app.test/api/admin/crm/import", {
        method: "POST",
        body: JSON.stringify({ people: [] }),
      }),
      importPOST,
    ],
    [
      "GET export",
      requestWithCookie("https://app.test/api/admin/crm/export"),
      exportGET,
    ],
  ];

  for (const [label, request, handler] of cases) {
    it(`returns 401 for unauthenticated ${label}`, async () => {
      const response = await handler(request, {
        params: Promise.resolve({ resource: "people", id: "p1" }),
      });
      expect(response.status).toBe(401);
    });
  }

  it("returns 404 for an unknown resource even when authenticated", async () => {
    const response = await listGET(authenticatedRequest("https://app.test/api/admin/crm/secrets"), {
      params: Promise.resolve({ resource: "secrets" }),
    });
    expect(response.status).toBe(404);
  });
});

describe("authenticated CRUD round-trip", () => {
  it("creates, updates, and deletes a person through PostgREST", async () => {
    const row = {
      id: "uuid-1",
      first_name: "Grace",
      last_name: "Hopper",
      email: "grace@navy.mil",
      phone: null,
      job_title: null,
      company_id: null,
      source: "manual",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    // Fresh Response per call: a Response body can be read only once.
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify([row]), { status: 201 }))
    );
    vi.stubGlobal("fetch", fetchMock);

    // CREATE
    const created = await createPOST(
      authenticatedRequest("https://app.test/api/admin/crm/people", {
        method: "POST",
        body: JSON.stringify({ firstName: "Grace", lastName: "Hopper" }),
      }),
      { params: Promise.resolve({ resource: "people" }) }
    );
    expect(created.status).toBe(201);
    const createdBody = (await created.json()) as { id: string; source: string };
    expect(createdBody.id).toBe("uuid-1");
    expect(createdBody.source).toBe("manual");

    // The client sent the snake_case row with no id and service-role headers.
    const [postUrl, postInit] = fetchMock.mock.calls[0]!;
    const postBody = JSON.parse(String(postInit!.body)) as Record<string, unknown>;
    expect(postBody).toMatchObject({ first_name: "Grace", last_name: "Hopper" });
    expect(postBody.id).toBeUndefined();
    expect((postInit!.headers as Record<string, string>).apikey).toBe("stub-key");

    // UPDATE
    const updated = await recordPATCH(
      authenticatedRequest("https://app.test/api/admin/crm/people/uuid-1", {
        method: "PATCH",
        body: JSON.stringify({ firstName: "Rear Admiral Grace" }),
      }),
      { params: Promise.resolve({ resource: "people", id: "uuid-1" }) }
    );
    expect(updated.status).toBe(200);
    const [patchUrl, patchInit] = fetchMock.mock.calls[1]!;
    expect(String(patchUrl)).toContain("/crm_people?id=eq.uuid-1");
    expect(JSON.parse(String(patchInit!.body))).toMatchObject({
      first_name: "Rear Admiral Grace",
    });

    // DELETE
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => Promise.resolve(new Response(null, { status: 204 })))
    );
    const deleted = await deleteDELETE(
      authenticatedRequest("https://app.test/api/admin/crm/people/uuid-1", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ resource: "people", id: "uuid-1" }) }
    );
    expect(deleted.status).toBe(200);
  });

  it("lists people as typed records", async () => {
    const row = {
      id: "uuid-2",
      first_name: "Ada",
      last_name: "Lovelace",
      email: null,
      phone: null,
      job_title: null,
      company_id: null,
      source: "twenty",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify([row])))
      )
    );
    const response = await listGET(
      authenticatedRequest("https://app.test/api/admin/crm/people"),
      { params: Promise.resolve({ resource: "people" }) }
    );
    const body = (await response.json()) as {
      records: { id: string; firstName: string; source: string }[];
    };
    expect(body.records[0]).toMatchObject({
      id: "uuid-2",
      firstName: "Ada",
      source: "twenty",
    });
  });
});

describe("Twenty import", () => {
  it("imports a Twenty-shaped payload with source twenty and linked companies", async () => {
    const fetchMock = vi
      .fn()
      // companies insert
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: "company-uuid", name: "US Navy", source: "twenty" },
          ]),
          { status: 201 }
        )
      )
      // people insert
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: "person-uuid",
              first_name: "Grace",
              last_name: "Hopper",
              company_id: "company-uuid",
              source: "twenty",
            },
          ]),
          { status: 201 }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await importPOST(
      authenticatedRequest("https://app.test/api/admin/crm/import", {
        method: "POST",
        body: JSON.stringify({
          companies: [{ id: "tw-co-1", name: "US Navy", domain: "navy.mil" }],
          people: [{ id: "tw-pe-1", name: "Grace Hopper", companyId: "tw-co-1" }],
        }),
      })
    );
    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      created: { people: { source: string; companyId: string | null }[] };
    };
    expect(body.created.people[0]?.source).toBe("twenty");
    // The Twenty company reference was swapped for the real inserted UUID.
    expect(body.created.people[0]?.companyId).toBe("company-uuid");

    // People insert happened after the companies insert.
    const [peopleUrl, peopleInit] = fetchMock.mock.calls[1]!;
    expect(String(peopleUrl)).toContain("/crm_people");
    expect(JSON.parse(String(peopleInit!.body))[0]).toMatchObject({
      company_id: "company-uuid",
      source: "twenty",
    });
  });

  it("rejects a payload with no importable records", async () => {
    const response = await importPOST(
      authenticatedRequest("https://app.test/api/admin/crm/import", {
        method: "POST",
        body: JSON.stringify({ people: [{ firstName: "" }] }),
      })
    );
    expect(response.status).toBe(400);
  });
});

describe("export", () => {
  it("returns JSON by default and CSV with format=csv", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify([])))
      )
    );

    const json = await exportGET(
      authenticatedRequest("https://app.test/api/admin/crm/export")
    );
    expect(json.headers.get("content-type")).toContain("application/json");
    const body = (await json.json()) as Record<string, unknown[]>;
    expect(Object.keys(body)).toEqual([
      "people",
      "companies",
      "opportunities",
      "notes",
    ]);

    const csv = await exportGET(
      authenticatedRequest("https://app.test/api/admin/crm/export?format=csv&entity=opportunities")
    );
    expect(csv.headers.get("content-type")).toContain("text/csv");
    const text = (await csv.text()).split("\r\n")[0];
    expect(text).toContain("stage");
  });

  it("rejects unknown CSV entities", async () => {
    const response = await exportGET(
      authenticatedRequest("https://app.test/api/admin/crm/export?format=csv&entity=secrets")
    );
    expect(response.status).toBe(400);
  });
});
