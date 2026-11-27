"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  createDraftPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
} from "./actions";

interface Props {
  posts: Doc<"posts">[];
  configError: string | null;
}

type PostStatus = Doc<"posts">["status"];

// Monochrome status chips: the navy rail is the page's only source of color,
// so state is carried by chip treatment (solid / outline / dashed) not hue.
const STATUS_CHIP: Record<PostStatus, string> = {
  published: "border border-[#0E1C2F] bg-[#0E1C2F] text-white",
  draft: "border border-stone bg-white text-stone",
  scheduled: "border border-dashed border-[#0E1C2F]/60 bg-white text-ink",
};

const STATUS_LABEL: Record<PostStatus, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

function formatPublishDate(post: Doc<"posts">): string {
  const ts = post.publishedAt ?? post.scheduledAt;
  if (ts === undefined) return "No date set";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pathwayLabel(pathway: string | undefined): string {
  if (!pathway) return "";
  const label = pathway.charAt(0).toUpperCase() + pathway.slice(1);
  return label;
}

const actionBtn =
  "min-h-9 border border-stone bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-[#F2F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]";

const inputClass =
  "w-full border border-stone bg-white px-3 py-2 text-ink placeholder:text-stone-light focus:border-[#0E1C2F] focus:outline-none";

export function BlogAdminClient({ posts, configError }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

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

  const createDraft = () => {
    setCreateError(null);
    startTransition(async () => {
      try {
        const id = await createDraftPost(newTitle);
        router.push(`/admin/blog/${id}/edit`);
      } catch (e) {
        setCreateError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  const openCreate = () => {
    setCreating(true);
    setCreateError(null);
    // Focus lands after React renders the panel.
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  return (
    <div>
      {/* Page header, in the public /blog idiom */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Insights
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Blog posts</h1>
          <p className="mt-2 text-base text-stone">
            {posts.length === 0
              ? "The back-catalog is empty."
              : `${posts.length} ${posts.length === 1 ? "post" : "posts"}, most recently edited first.`}
          </p>
        </div>
        {!configError && (
          <button
            type="button"
            onClick={openCreate}
            className="border border-[#0E1C2F] bg-[#0E1C2F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1C344F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
          >
            New post
          </button>
        )}
      </header>

      {/* New post: title only; everything else happens in the editor */}
      {creating && !configError && (
        <section
          aria-label="New post"
          className="mb-8 border bg-white p-6"
        >
          <h2 className="font-serif text-2xl text-ink">New post</h2>
          <p className="mt-1 text-sm text-stone">
            Name it now — the draft opens in the editor, where the slug and
            body are set.
          </p>
          <form
            className="mt-4 flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              createDraft();
            }}
          >
            <label className="min-w-64 flex-1 text-sm font-medium text-ink">
              Title
              <input
                ref={titleRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                name="title"
                required
                placeholder="e.g. The Exit Crisis, revisited"
                className={inputClass + " mt-1"}
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="border border-[#0E1C2F] bg-[#0E1C2F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1C344F] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
            >
              Create draft
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="min-h-9 px-3 py-1.5 text-sm font-medium text-stone underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
            >
              Cancel
            </button>
          </form>
          {createError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {createError}
            </p>
          )}
        </section>
      )}

      {configError && (
        <div
          role="alert"
          className="mb-8 border border-red-700 bg-white p-4 text-sm text-red-700"
        >
          {configError}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="mb-8 border border-red-700 bg-white p-4 text-sm text-red-700"
        >
          {actionError}
        </div>
      )}

      {posts.length === 0 && !configError ? (
        <div className="border bg-white p-10 text-center">
          <p className="font-serif text-2xl text-ink">No posts yet.</p>
          <p className="mt-2 text-sm text-stone">
            Start the catalog: pick a title for the first post.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-5" aria-label="All posts">
          {posts.map((post) => {
            const standfirst =
              post.subtitle?.trim() || post.excerpt?.trim() || "No summary yet.";
            const category = post.category?.trim() || "Insights";
            const pathway = pathwayLabel(post.pathway);
            return (
              <li key={post._id}>
                <article className="relative flex border bg-white transition-colors hover:border-stone">
                  {/* The card itself is the edit link: a real <a> stretched
                      over the card (DOM-first for keyboard order), with the
                      action row lifted above it. */}
                  <Link
                    href={`/admin/blog/${post._id}/edit`}
                    className="absolute inset-0 z-0 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1C2F]"
                  >
                    <span className="sr-only">Edit “{post.title}”</span>
                  </Link>

                  {post.featuredImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featuredImage}
                      alt=""
                      className="h-36 w-48 shrink-0 self-start object-cover"
                    />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${STATUS_CHIP[post.status]}`}
                      >
                        {STATUS_LABEL[post.status]}
                      </span>
                      <span className="text-xs text-stone">
                        {formatPublishDate(post)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif text-2xl text-ink">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 max-w-prose text-sm text-stone">
                      {standfirst}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                      {category}
                      {pathway ? ` · ${pathway}` : ""}
                    </p>

                    <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 self-start">
                      <Link
                        href={`/admin/blog/${post._id}/preview`}
                        className={actionBtn}
                      >
                        Preview
                      </Link>
                      {post.status !== "published" && (
                        <button
                          type="button"
                          disabled={pending || !!configError}
                          onClick={() =>
                            run(() => publishBlogPost(post._id as Id<"posts">))
                          }
                          className={actionBtn}
                        >
                          Publish
                        </button>
                      )}
                      {post.status === "published" && (
                        <button
                          type="button"
                          disabled={pending || !!configError}
                          onClick={() =>
                            run(() =>
                              unpublishBlogPost(post._id as Id<"posts">)
                            )
                          }
                          className={actionBtn}
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
                            !window.confirm(`Delete “${post.title}”?`)
                          ) {
                            return;
                          }
                          run(() => deleteBlogPost(post._id as Id<"posts">));
                        }}
                        className={
                          actionBtn +
                          " border-red-700/60 text-red-700 hover:bg-red-50"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
