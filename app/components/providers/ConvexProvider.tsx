"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo, useEffect, useState } from "react";

// We need to provide a client even during build to prevent errors
// This dummy client won't actually connect to anything
const DUMMY_URL = "https://dummy.convex.cloud";

function createClient(): ConvexReactClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL || DUMMY_URL;
  return new ConvexReactClient(url);
}

// Inner component to handle client-side only rendering
function ConvexProviderInner({ children }: { children: ReactNode }) {
  const client = useMemo(() => createClient(), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering on client
  if (!mounted) {
    return <>{children}</>;
  }

  return <ConvexProviderInner>{children}</ConvexProviderInner>;
}
