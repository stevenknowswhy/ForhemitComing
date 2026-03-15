"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState } from "react";

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!url) {
    const error = new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
      "Please check your .env.local file and ensure Convex is configured."
    );
    console.error(error.message);
    throw error;
  }
  
  return new ConvexReactClient(url);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => getConvexClient());
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
