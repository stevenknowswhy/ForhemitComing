"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Global client instance to ensure singleton
let convexClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (typeof window === "undefined") return null;
  
  if (!convexClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      console.error("[Convex] NEXT_PUBLIC_CONVEX_URL not set");
      return null;
    }
    convexClient = new ConvexReactClient(url);
  }
  
  return convexClient;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getConvexClient(), []);

  // During SSR/build, client will be null - just render children
  // The components using Convex hooks need to handle this gracefully
  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
