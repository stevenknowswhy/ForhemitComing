"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useMemo } from "react";

// Create client with the actual Convex URL
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";

function createClient(): ConvexReactClient {
  return new ConvexReactClient(CONVEX_URL);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createClient(), []);
  
  return (
    <ConvexProviderWithClerk client={client} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
