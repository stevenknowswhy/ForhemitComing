import type { Metadata } from "next";

/**
 * Shared Open Graph + Twitter metadata for marketing pages.
 *
 * Next.js shallow-merges page metadata over the root layout's, so any page
 * that defines its own `openGraph` object must restate every field it wants —
 * including images. These helpers keep that consistent and point each money
 * page at its branded 1200x630 card in /public. Cards live at the public root
 * (like og-image.png): nested public/ subpaths do not serve on this stack.
 * Relative URLs resolve against the layout's metadataBase, rendering as
 * absolute og:image URLs.
 */

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export type OgCard = {
  /** Image filename under public (e.g. "og-home.png"). */
  file: string;
  title: string;
  description: string;
  /** Canonical path for og:url, e.g. "/signal-os" or "/". */
  path: string;
};

export function ogMetadata({
  file,
  title,
  description,
  path,
}: OgCard): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [
    {
      url: `/${file}`,
      width: OG_WIDTH,
      height: OG_HEIGHT,
      alt: title,
    },
  ];

  return {
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: "Forhemit PBC",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}
