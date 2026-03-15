"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// We need to provide a client even during build to prevent errors
// This dummy client won't actually connect to anything
const DUMMY_URL = "https://dummy.convex.cloud";

function createClient(): ConvexReactClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL || DUMMY_URL;
  return new ConvexReactClient(url);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createClient(), []);

  // Always provide the client - even a dummy one prevents hook errors
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
