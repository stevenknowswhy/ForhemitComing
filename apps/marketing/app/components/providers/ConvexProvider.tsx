"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({
  children,
  convexUrl,
}: {
  children: ReactNode;
  convexUrl: string;
}) {
  const client = useMemo(
    () => new ConvexReactClient(convexUrl),
    [convexUrl],
  );
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
