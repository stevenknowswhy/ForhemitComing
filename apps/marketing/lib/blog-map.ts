import type { Doc } from "@/convex/_generated/dataModel";
import type { Article, Author, Pathway } from "@/lib/blog-data";

function isPathway(v: string | undefined): v is Exclude<Pathway, "all"> {
  return (
    v === "founders" ||
    v === "attorneys" ||
    v === "lenders" ||
    v === "cpas" ||
    v === "employees"
  );
}

export function resolvePathway(
  stored: string | undefined
): Exclude<Pathway, "all"> {
  return isPathway(stored) ? stored : "founders";
}

const defaultAuthor: Author = {
  name: "Forhemit",
  title: "Editorial",
  credentials: "Stewardship & transition intelligence",
  photo: "",
  nextAvailability: "",
};

/** Card grid + filters (BentoGrid). */
export function postDocToListItem(post: Doc<"posts">) {
  const pathway = resolvePathway(post.pathway);
  const subtitle =
    (post.subtitle?.trim() || post.excerpt?.trim() || "").slice(0, 220) ||
    "Read the full article.";
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    subtitle,
    pathway,
    category: post.category?.trim() || "Insights",
    readTime: {
      overview: post.readTimeOverview ?? 60,
      deepDive: post.readTimeDeepDive ?? 5,
      methodology: post.readTimeMethodology ?? 12,
    },
    excerpt: post.excerpt?.trim() || subtitle,
    imageUrl: post.featuredImage,
    relatedPathways: (post.relatedPathways ?? []).filter(isPathway),
  };
}

/** Full article page (legacy Article shape + raw Convex doc for content). */
export function postDocToArticle(post: Doc<"posts">): Article {
  const pathway = resolvePathway(post.pathway);
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : "";

  const author: Author = {
    ...defaultAuthor,
    name: post.authorDisplayName?.trim() || defaultAuthor.name,
  };

  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    subtitle:
      post.subtitle?.trim() ||
      post.excerpt?.trim() ||
      "Stewardship and transition insights from Forhemit.",
    pathway,
    category: post.category?.trim() || "Insights",
    readTime: {
      overview: post.readTimeOverview ?? 60,
      deepDive: post.readTimeDeepDive ?? 5,
      methodology: post.readTimeMethodology ?? 12,
    },
    depthLevel: post.depthLevel ?? "detailed",
    imageUrl: post.featuredImage,
    resilienceSummary: post.resilienceSummary ?? [],
    author,
    reviewedBy: undefined,
    hasDossierDownload: false,
    excerpt: post.excerpt?.trim() || "",
    publishedAt,
    relatedPathways: (post.relatedPathways ?? []).filter(isPathway),
  };
}

export function filterListByPathway<
  T extends { pathway: Pathway; relatedPathways?: Pathway[] },
>(items: T[], pathway: Pathway): T[] {
  if (pathway === "all") return items;
  return items.filter(
    (a) =>
      a.pathway === pathway ||
      (a.relatedPathways?.some((p) => p === pathway) ?? false)
  );
}
