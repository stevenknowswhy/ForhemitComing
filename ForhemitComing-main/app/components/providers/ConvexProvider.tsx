"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Create client with the actual Convex URL
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";

function createClient(): ConvexReactClient {
  return new ConvexReactClient(CONVEX_URL);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createClient(), []);
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
