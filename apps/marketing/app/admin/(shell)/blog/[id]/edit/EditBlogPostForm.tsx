"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { updateBlogPost } from "../../actions";

const btnStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
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

interface Props {
  post: Doc<"posts">;
  configError: string | null;
}

const relatedPathwayOptions = [
  { value: "founders", label: "Founders" },
  { value: "attorneys", label: "Attorneys" },
  { value: "lenders", label: "Lenders" },
  { value: "cpas", label: "CPAs" },
  { value: "employees", label: "Employees" },
] as const;

export function EditBlogPostForm({ post, configError }: Props) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const pathwayDefault =
    post.pathway === "founders" ||
    post.pathway === "attorneys" ||
    post.pathway === "lenders" ||
    post.pathway === "cpas" ||
    post.pathway === "employees"
      ? post.pathway
      : "founders";

  const contentJson = JSON.stringify(post.content ?? {}, null, 2);
  const resilienceText = (post.resilienceSummary ?? []).join("\n");
  const relatedSet = new Set(post.relatedPathways ?? []);

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Link href="/admin/blog" style={{ ...btnStyle, fontSize: 14 }}>
          ← All posts
        </Link>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link
            href={`/admin/blog/${post._id}/preview`}
            style={{ ...btnStyle, fontSize: 14 }}
          >
            Preview
          </Link>
          <a href="/admin/logout" style={{ ...btnStyle, fontSize: 14 }}>
            Sign out
          </a>
        </div>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>
        Edit post
      </h1>
      <p style={{ opacity: 0.8, marginBottom: 20, fontSize: 14 }}>
        Status: <strong>{post.status}</strong> — use the list page to publish
        or unpublish.
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

      <form
        style={{ display: "grid", gap: 12 }}
        action={async (fd) => {
          setFormError(null);
          try {
            await updateBlogPost(fd);
            router.push("/admin/blog");
            router.refresh();
          } catch (e) {
            setFormError(e instanceof Error ? e.message : String(e));
          }
        }}
      >
        <input type="hidden" name="id" value={post._id} />
        <label style={labelStyle}>
          Title
          <input
            name="title"
            required
            style={inputStyle}
            defaultValue={post.title}
          />
        </label>
        <label style={labelStyle}>
          Slug
          <input
            name="slug"
            required
            style={inputStyle}
            defaultValue={post.slug}
          />
        </label>
        <label style={labelStyle}>
          Subtitle (optional)
          <input
            name="subtitle"
            style={inputStyle}
            defaultValue={post.subtitle ?? ""}
          />
        </label>
        <label style={labelStyle}>
          Excerpt (optional)
          <textarea
            name="excerpt"
            rows={2}
            style={inputStyle}
            defaultValue={post.excerpt ?? ""}
          />
        </label>
        <label style={labelStyle}>
          Category (optional)
          <input
            name="category"
            style={inputStyle}
            defaultValue={post.category ?? ""}
          />
        </label>
        <label style={labelStyle}>
          Meta title (optional, SEO)
          <input
            name="metaTitle"
            style={inputStyle}
            defaultValue={post.metaTitle ?? ""}
            placeholder="Overrides page title when set"
          />
        </label>
        <label style={labelStyle}>
          Meta description (optional, SEO)
          <textarea
            name="metaDescription"
            rows={2}
            style={inputStyle}
            defaultValue={post.metaDescription ?? ""}
            placeholder="Search / social snippet"
          />
        </label>
        <label style={labelStyle}>
          Open Graph image URL (optional)
          <input
            name="ogImage"
            style={inputStyle}
            defaultValue={post.ogImage ?? ""}
            placeholder="https://…"
          />
        </label>
        <label style={labelStyle}>
          Pathway
          <select
            name="pathway"
            style={inputStyle}
            defaultValue={pathwayDefault}
          >
            <option value="founders">Founders</option>
            <option value="attorneys">Attorneys</option>
            <option value="lenders">Lenders</option>
            <option value="cpas">CPAs</option>
            <option value="employees">Employees</option>
          </select>
        </label>
        <label style={labelStyle}>
          Depth level
          <select
            name="depthLevel"
            style={inputStyle}
            defaultValue={post.depthLevel ?? ""}
          >
            <option value="">— Not set —</option>
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
        </label>
        <fieldset
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <legend style={{ fontSize: 14, padding: "0 4px" }}>
            Also relevant for (optional)
          </legend>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 8,
            }}
          >
            {relatedPathwayOptions.map(({ value, label }) => (
              <label
                key={value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  name="relatedPathways"
                  value={value}
                  defaultChecked={relatedSet.has(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label style={labelStyle}>
          Featured image URL (optional)
          <input
            name="featuredImage"
            style={inputStyle}
            defaultValue={post.featuredImage ?? ""}
          />
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          <label style={labelStyle}>
            Read (overview sec)
            <input
              name="readTimeOverview"
              type="number"
              style={inputStyle}
              defaultValue={post.readTimeOverview ?? ""}
            />
          </label>
          <label style={labelStyle}>
            Read (deep min)
            <input
              name="readTimeDeepDive"
              type="number"
              style={inputStyle}
              defaultValue={post.readTimeDeepDive ?? ""}
            />
          </label>
          <label style={labelStyle}>
            Read (method min)
            <input
              name="readTimeMethodology"
              type="number"
              style={inputStyle}
              defaultValue={post.readTimeMethodology ?? ""}
            />
          </label>
        </div>
        <label style={labelStyle}>
          Resilience bullets (one per line)
          <textarea
            name="resilienceSummary"
            rows={4}
            style={inputStyle}
            defaultValue={resilienceText}
          />
        </label>
        <label style={labelStyle}>
          Content (TipTap JSON)
          <textarea
            name="content"
            rows={16}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
            defaultValue={contentJson}
          />
        </label>
        {formError && (
          <div style={{ color: "#fecaca", fontSize: 14 }}>{formError}</div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={!!configError}
            style={btnStyle}
          >
            Save changes
          </button>
          <Link href="/admin/blog" style={btnStyle}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
