"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  createBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
} from "./actions";

const emptyTipTapDoc = `{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Start writing…" }]
    }
  ]
}`;

interface Props {
  posts: Doc<"posts">[];
  configError: string | null;
}

export function BlogAdminClient({ posts, configError }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = (fn: () => Promise<void>) => {
    setActionError(null);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        setActionError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>
        Blog posts
      </h1>
      <p style={{ opacity: 0.85, marginBottom: 20, lineHeight: 1.5 }}>
        Data lives in Convex <code>posts</code>. Server actions use{" "}
        <code>ADMIN_TOKEN</code> from the deployment environment (never expose
        this token to the browser in client-side code).
      </p>

      {configError && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            background: "#3d2914",
            borderRadius: 8,
            color: "#fde68a",
          }}
        >
          {configError}
        </div>
      )}

      {actionError && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            background: "#450a0a",
            borderRadius: 8,
            color: "#fecaca",
          }}
        >
          {actionError}
        </div>
      )}

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Existing posts</h2>
        {posts.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No posts yet.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gap: 12,
            }}
          >
            {posts.map((p) => (
              <li
                key={p._id}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>
                    /blog/{p.slug} · {p.status}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link
                    href={`/admin/blog/${p._id}/edit`}
                    style={{
                      ...btnStyle,
                      textDecoration: "none",
                      display: "inline-block",
                      opacity: configError ? 0.5 : 1,
                      pointerEvents: configError ? "none" : "auto",
                    }}
                    aria-disabled={!!configError}
                  >
                    Edit
                  </Link>
                  {p.status !== "published" && (
                    <button
                      type="button"
                      disabled={pending || !!configError}
                      onClick={() =>
                        run(() => publishBlogPost(p._id as Id<"posts">))
                      }
                      style={btnStyle}
                    >
                      Publish
                    </button>
                  )}
                  {p.status === "published" && (
                    <button
                      type="button"
                      disabled={pending || !!configError}
                      onClick={() =>
                        run(() => unpublishBlogPost(p._id as Id<"posts">))
                      }
                      style={btnStyle}
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending || !!configError}
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        !window.confirm(`Delete “${p.title}”?`)
                      ) {
                        return;
                      }
                      run(() => deleteBlogPost(p._id as Id<"posts">));
                    }}
                    style={{ ...btnStyle, borderColor: "#b91c1c", color: "#fecaca" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Create post</h2>
        <form
          style={{ display: "grid", gap: 12, maxWidth: 640 }}
          action={async (fd) => {
            setFormError(null);
            try {
              await createBlogPost(fd);
              router.refresh();
            } catch (e) {
              setFormError(e instanceof Error ? e.message : String(e));
            }
          }}
        >
          <label style={labelStyle}>
            Title
            <input name="title" required style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Slug (lowercase-kebab)
            <input name="slug" required style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Subtitle (optional)
            <input name="subtitle" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Excerpt (optional)
            <textarea name="excerpt" rows={2} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Category (optional)
            <input name="category" placeholder="Insights" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Pathway
            <select name="pathway" style={inputStyle} defaultValue="founders">
              <option value="founders">Founders</option>
              <option value="attorneys">Attorneys</option>
              <option value="lenders">Lenders</option>
              <option value="cpas">CPAs</option>
              <option value="employees">Employees</option>
            </select>
          </label>
          <label style={labelStyle}>
            Featured image URL (optional)
            <input name="featuredImage" style={inputStyle} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <label style={labelStyle}>
              Read (overview sec)
              <input name="readTimeOverview" type="number" style={inputStyle} placeholder="60" />
            </label>
            <label style={labelStyle}>
              Read (deep min)
              <input name="readTimeDeepDive" type="number" style={inputStyle} placeholder="5" />
            </label>
            <label style={labelStyle}>
              Read (method min)
              <input name="readTimeMethodology" type="number" style={inputStyle} placeholder="12" />
            </label>
          </div>
          <label style={labelStyle}>
            Resilience bullets (one per line, optional)
            <textarea name="resilienceSummary" rows={3} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Content (TipTap JSON)
            <textarea
              name="content"
              rows={12}
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
              defaultValue={emptyTipTapDoc}
            />
          </label>
          <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="publishNow" />
            Publish immediately
          </label>
          {formError && (
            <div style={{ color: "#fecaca", fontSize: 14 }}>{formError}</div>
          )}
          <button
            type="submit"
            disabled={!!configError}
            style={{ ...btnStyle, alignSelf: "start" }}
          >
            Create
          </button>
        </form>
      </section>
    </main>
  );
}

const btnStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  marginTop: 4,
  padding: 8,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.2)",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: 14,
};
