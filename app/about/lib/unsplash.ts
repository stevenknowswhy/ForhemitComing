/**
 * Unsplash API Integration
 * Fetches high-quality images for the gallery
 */

// Gallery image configuration with search queries for each slide
export const galleryImageQueries = [
  {
    id: "origin",
    query: "modern architecture interior luxury minimal",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    id: "philosophy",
    query: "abstract geometric gold bronze metallic",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },
  {
    id: "process",
    query: "precision craftsmanship workshop detail",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80",
  },
  {
    id: "partnership",
    query: "handshake business professional partnership",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
  },
  {
    id: "future",
    query: "city skyline sunset horizon future",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80",
  },
  {
    id: "disaster",
    query: "storm preparation crisis management planning",
    orientation: "landscape" as const,
    fallback: "https://images.unsplash.com/photo-1533578442541-5c4645232ca0?w=1200&q=80",
  },
];

// Curated Unsplash image URLs that match our premium aesthetic
// Using direct URLs with specific photo IDs for reliability
export const curatedGalleryImages = [
  {
    id: "origin",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=60&auto=format&fit=crop",
    alt: "Luxury modern interior with warm lighting",
    credit: "R architecture",
    creditUrl: "https://unsplash.com/@rarchitecture",
  },
  {
    id: "philosophy",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60&auto=format&fit=crop",
    alt: "Abstract bronze and gold geometric forms",
    credit: "Pawel Czerwinski",
    creditUrl: "https://unsplash.com/@pawel_czerwinski",
  },
  {
    id: "process",
    url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&q=60&auto=format&fit=crop",
    alt: "Precision craftsmanship and attention to detail",
    credit: "Daniel von Appen",
    creditUrl: "https://unsplash.com/@dvna",
  },
  {
    id: "partnership",
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=60&auto=format&fit=crop",
    alt: "Professional partnership and collaboration",
    credit: "LinkedIn Sales Solutions",
    creditUrl: "https://unsplash.com/@linkedinsalesnavigator",
  },
  {
    id: "future",
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&q=60&auto=format&fit=crop",
    alt: "City skyline at sunset representing future vision",
    credit: "Ben O'Bro",
    creditUrl: "https://unsplash.com/@benobro",
  },
  {
    id: "disaster",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=60&auto=format&fit=crop",
    alt: "Strategic planning with analytical approach",
    credit: "Jorge Diaz",
    creditUrl: "https://unsplash.com/@jorge_diaz",
  },
];

// Alternative curated images if needed
export const alternativeImages = {
  luxury: [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=85",
  ],
  abstract: [
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=85",
    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1600&q=85",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=85",
  ],
  business: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=85",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=85",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=85",
  ],
};

/**
 * Get image URL for a gallery slide
 */
export function getGalleryImage(slideId: string): string {
  const image = curatedGalleryImages.find((img) => img.id === slideId);
  return image?.url || alternativeImages.luxury[0];
}

/**
 * Get thumbnail URL for a gallery slide
 */
export function getGalleryThumbnail(slideId: string): string {
  const image = curatedGalleryImages.find((img) => img.id === slideId);
  return image?.thumb || image?.url || alternativeImages.luxury[0];
}

/**
 * Get image credit information
 */
export function getImageCredit(slideId: string) {
  const image = curatedGalleryImages.find((img) => img.id === slideId);
  return {
    photographer: image?.credit || "Unsplash",
    url: image?.creditUrl || "https://unsplash.com",
  };
}

// Unsplash API client (for future dynamic fetching)
const UNSPLASH_API_BASE = "https://api.unsplash.com";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

/**
 * Fetch photos from Unsplash API
 * Note: This requires the access key to be set in environment variables
 */
export async function fetchUnsplashPhotos(
  query: string,
  count: number = 1,
  orientation: "landscape" | "portrait" | "squarish" = "landscape"
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn("Unsplash access key not configured, using fallback images");
    return [];
  }

  try {
    const url = new URL(`${UNSPLASH_API_BASE}/search/photos`);
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", count.toString());
    url.searchParams.set("orientation", orientation);
    url.searchParams.set("client_id", accessKey);

    const response = await fetch(url.toString(), {
      headers: {
        "Accept-Version": "v1",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results as UnsplashPhoto[];
  } catch (error) {
    console.error("Failed to fetch from Unsplash:", error);
    return [];
  }
}

/**
 * Get a random photo from Unsplash
 */
export async function fetchRandomUnsplashPhoto(
  query: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape"
): Promise<UnsplashPhoto | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return null;
  }

  try {
    const url = new URL(`${UNSPLASH_API_BASE}/photos/random`);
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", orientation);
    url.searchParams.set("client_id", accessKey);

    const response = await fetch(url.toString(), {
      headers: {
        "Accept-Version": "v1",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    return (await response.json()) as UnsplashPhoto;
  } catch (error) {
    console.error("Failed to fetch random photo from Unsplash:", error);
    return null;
  }
}
