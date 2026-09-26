import { describe, expect, it, vi, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Doc } from "@/convex/_generated/dataModel";
import { BentoGrid } from "@/components/blog/BentoGrid";
import { PathwayProvider } from "@/components/blog/PathwayProvider";
import type { BlogListItem } from "@/lib/blog-map";

const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));

vi.mock("convex/browser", () => ({
  ConvexHttpClient: class MockConvexHttpClient {
    query = queryMock;
  },
}));

function listItem(overrides: Partial<BlogListItem> = {}): BlogListItem {
  return {
    id: "id-1",
    slug: "post-1",
    title: "A Founder's Guide to Succession",
    subtitle: "Subtitle",
    pathway: "founders",
    category: "Insights",
    readTime: { overview: 60, deepDive: 5, methodology: 12 },
    excerpt: "Excerpt",
    imageUrl: undefined,
    relatedPathways: [],
    ...overrides,
  };
}

/** Minimal raw Convex doc accepted by postDocToListItem. */
function rawDoc(overrides: Record<string, unknown> = {}): Doc<"posts"> {
  return {
    _id: "id-1",
    slug: "post-1",
    title: "A Founder's Guide to Succession",
    status: "published",
    ...overrides,
  } as unknown as Doc<"posts">;
}

function renderGrid(initialPosts: BlogListItem[] | null) {
  return render(
    <PathwayProvider>
      <BentoGrid initialPosts={initialPosts} />
    </PathwayProvider>
  );
}

describe("BentoGrid resilience states", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;
    queryMock.mockReset();
    localStorage.clear();
  });

  /** The retry handler refuses to run without a Convex URL configured. */
  function withConvexUrl() {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://mock.convex.cloud";
  }

  it("renders the error state with a retry button when the server fetch failed", () => {
    renderGrid(null);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(/not responding right now/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeTruthy();
    expect(screen.queryByText(/loading articles/i)).toBeNull();
  });

  it("renders the empty state when Convex answered with zero articles", () => {
    renderGrid([]);

    expect(screen.getByText(/no articles have been published yet/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("recovers to the article grid when a retry succeeds", async () => {
    withConvexUrl();
    queryMock.mockResolvedValue([rawDoc()]);
    renderGrid(null);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/a founder's guide to succession/i)
      ).toBeTruthy();
    });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("stays in the error state when a retry fails", async () => {
    withConvexUrl();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    queryMock.mockRejectedValue(new Error("backend down"));
    renderGrid(null);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(queryMock).toHaveBeenCalled();
    });
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it("renders the filter-empty state when the active perspective has no articles", () => {
    localStorage.setItem("forhemit-pathway", "lenders");
    renderGrid([listItem()]);

    expect(
      screen.getByText(/no articles match this perspective yet/i)
    ).toBeTruthy();
  });
});
