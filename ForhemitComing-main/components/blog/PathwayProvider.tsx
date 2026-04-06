"use client";

import { ReactNode } from 'react';
import { PathwayContext, usePathwayProvider } from '@/hooks/useBlog';

interface PathwayProviderProps {
  children: ReactNode;
}

export function PathwayProvider({ children }: PathwayProviderProps) {
  const value = usePathwayProvider();
  
  return (
    <PathwayContext.Provider value={value}>
      {children}
    </PathwayContext.Provider>
  );
}
