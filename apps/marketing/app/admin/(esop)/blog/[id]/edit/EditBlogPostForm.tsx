"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { updateBlogPost } from "../../actions";

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

// Shared field idioms (kept as constants so the two forms stay visually
// identical without a runtime dependency).
const inputClass =
  "w-full border border-stone bg-white px-3 py-2 text-ink placeholder:text-stone-light focus:border-[#0E1C2F] focus:outline-none";

const labelClass = "block text-sm font-medium text-ink";

const groupLegend =
  "text-xs font-semibold uppercase tracking-[0.2em] text-stone";

function statusChipClass(status: Doc<"posts">["status"]): string {
  switch (status) {
    case "published":
      return "border border-[#0E1C2F] bg-[#0E1C2F] text-white";
    case "scheduled":
      return "border border-dashed border-[#0E1C2F]/60 bg-white text-ink";
    default:
      return "border border-stone bg-white text-stone";
  }
}

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
    <div>
      {/* Header: back, status, preview — everything contextual, no chrome
          duplication (Sign out lives in the shell rail). */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/blog"
          className="text-sm font-medium text-stone underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
        >
          ← All posts
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${statusChipClass(post.status)}`}
          >
            {post.status}
          </span>
          <Link
            href={`/admin/blog/${post._id}/preview`}
            className="min-h-9 border border-stone bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-[#F2F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
          >
            Preview
          </Link>
        </div>
      </div>

      <header className="mt-6 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
          Insights
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Edit post</h1>
        <p className="mt-2 text-sm text-stone">
          /blog/{post.slug}
        </p>
      </header>

      {configError && (
        <div
          role="alert"
          className="mb-8 border border-red-700 bg-white p-4 text-sm text-red-700"
        >
          {configError}
        </div>
      )}

      <form
        className="flex flex-col gap-10"
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

        {/* ── Post ── */}
        <fieldset className="flex flex-col gap-5">
          <legend className={groupLegend}>Post</legend>
          <label className={labelClass}>
            Title
            <input
              name="title"
              required
              className={inputClass + " mt-1"}
              defaultValue={post.title}
            />
          </label>
          <label className={labelClass}>
            Slug
            <input
              name="slug"
              required
              className={inputClass + " mt-1"}
              defaultValue={post.slug}
            />
          </label>
          <label className={labelClass}>
            Subtitle
            <input
              name="subtitle"
              className={inputClass + " mt-1"}
              defaultValue={post.subtitle ?? ""}
            />
          </label>
          <label className={labelClass}>
            Excerpt
            <textarea
              name="excerpt"
              rows={2}
              className={inputClass + " mt-1"}
              defaultValue={post.excerpt ?? ""}
            />
          </label>
          <label className={labelClass}>
            Category
            <input
              name="category"
              className={inputClass + " mt-1"}
              defaultValue={post.category ?? ""}
            />
          </label>
        </fieldset>

        {/* ── Body ── */}
        <fieldset className="flex flex-col gap-5">
          <legend className={groupLegend}>Body</legend>
          <label className={labelClass}>
            Content (TipTap document JSON)
            <textarea
              name="content"
              rows={16}
              className={
                inputClass + " mt-1 font-mono text-xs leading-relaxed"
              }
              defaultValue={contentJson}
            />
          </label>
          <p className="text-xs text-stone-light">
            The body is stored as a TipTap document. Editing it as rich text in
            this screen is a planned follow-up — for now, adjust the JSON here
            and check the result with Preview.
          </p>
        </fieldset>

        {/* ── Metadata ── */}
        <fieldset className="flex flex-col gap-5">
          <legend className={groupLegend}>Metadata</legend>
          <label className={labelClass}>
            Pathway
            <select
              name="pathway"
              className={inputClass + " mt-1"}
              defaultValue={pathwayDefault}
            >
              <option value="founders">Founders</option>
              <option value="attorneys">Attorneys</option>
              <option value="lenders">Lenders</option>
              <option value="cpas">CPAs</option>
              <option value="employees">Employees</option>
            </select>
          </label>
          <label className={labelClass}>
            Depth level
            <select
              name="depthLevel"
              className={inputClass + " mt-1"}
              defaultValue={post.depthLevel ?? ""}
            >
              <option value="">— Not set —</option>
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </label>
          <fieldset className="border p-4">
            <legend className="px-1 text-sm font-medium text-ink">
              Also relevant for
            </legend>
            <div className="flex flex-wrap gap-4">
              {relatedPathwayOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm text-ink"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              Read time — overview (sec)
              <input
                name="readTimeOverview"
                type="number"
                className={inputClass + " mt-1"}
                defaultValue={post.readTimeOverview ?? ""}
              />
            </label>
            <label className={labelClass}>
              Read time — deep dive (min)
              <input
                name="readTimeDeepDive"
                type="number"
                className={inputClass + " mt-1"}
                defaultValue={post.readTimeDeepDive ?? ""}
              />
            </label>
            <label className={labelClass}>
              Read time — methodology (min)
              <input
                name="readTimeMethodology"
                type="number"
                className={inputClass + " mt-1"}
                defaultValue={post.readTimeMethodology ?? ""}
              />
            </label>
          </div>
          <label className={labelClass}>
            Resilience bullets (one per line)
            <textarea
              name="resilienceSummary"
              rows={4}
              className={inputClass + " mt-1"}
              defaultValue={resilienceText}
            />
          </label>
          <label className={labelClass}>
            Featured image URL
            <input
              name="featuredImage"
              className={inputClass + " mt-1"}
              defaultValue={post.featuredImage ?? ""}
            />
          </label>
        </fieldset>

        {/* ── Search & social ── */}
        <fieldset className="flex flex-col gap-5">
          <legend className={groupLegend}>Search &amp; social</legend>
          <label className={labelClass}>
            Meta title
            <input
              name="metaTitle"
              className={inputClass + " mt-1"}
              defaultValue={post.metaTitle ?? ""}
              placeholder="Overrides page title when set"
            />
          </label>
          <label className={labelClass}>
            Meta description
            <textarea
              name="metaDescription"
              rows={2}
              className={inputClass + " mt-1"}
              defaultValue={post.metaDescription ?? ""}
              placeholder="Search / social snippet"
            />
          </label>
          <label className={labelClass}>
            Open Graph image URL
            <input
              name="ogImage"
              className={inputClass + " mt-1"}
              defaultValue={post.ogImage ?? ""}
              placeholder="https://…"
            />
          </label>
        </fieldset>

        {formError && (
          <p role="alert" className="text-sm text-red-700">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={!!configError}
            className="border border-[#0E1C2F] bg-[#0E1C2F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1C344F] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
          >
            Save changes
          </button>
          <Link
            href="/admin/blog"
            className="flex min-h-9 items-center border border-stone bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-[#F2F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
