"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Pathway } from '@/lib/blog-data';

const STORAGE_KEY = 'forhemit-pathway';

/* ── Pathway Context ── */
/* Shared state so PathwaySelector + BentoGrid (and any other consumer) 
   read/write the same pathway value. Without this, each usePathway() call 
   creates an independent useState — clicks in the selector never reach the grid. */

interface PathwayContextValue {
  pathway: Pathway;
  setPathway: (p: Pathway) => void;
  isInitialized: boolean;
}

const PathwayContext = createContext<PathwayContextValue | null>(null);

export { PathwayContext };

export function usePathwayProvider() {
  const [pathway, setPathwayState] = useState<Pathway>('all');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as Pathway | null;
    if (stored && ['all', 'founders', 'attorneys', 'lenders', 'cpas', 'employees'].includes(stored)) {
      setPathwayState(stored);
    }

    // Also check URL param
    const url = new URL(window.location.href);
    const roleParam = url.searchParams.get('role') as Pathway | null;
    if (roleParam && ['founders', 'attorneys', 'lenders', 'cpas', 'employees'].includes(roleParam)) {
      setPathwayState(roleParam);
      localStorage.setItem(STORAGE_KEY, roleParam);
    }

    setIsInitialized(true);
  }, []);

  const setPathway = useCallback((newPathway: Pathway) => {
    setPathwayState(newPathway);
    localStorage.setItem(STORAGE_KEY, newPathway);
    
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newPathway === 'all') {
        url.searchParams.delete('role');
      } else {
        url.searchParams.set('role', newPathway);
      }
      window.history.pushState({}, '', url);
    }
    
    console.log('[Analytics] Pathway selected:', { 
      pathway: newPathway, 
      timestamp: new Date().toISOString() 
    });
  }, []);

  return { pathway, setPathway, isInitialized };
}

export function usePathway() {
  const ctx = useContext(PathwayContext);
  if (!ctx) {
    throw new Error('usePathway must be used within a PathwayProvider. Wrap your blog layout with <PathwayProvider>.');
  }
  return ctx;
}

/* ── Other hooks (unchanged) ── */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

export function useScrollDepth(thresholds: number[] = [25, 50, 75, 90]) {
  const [firedThresholds, setFiredThresholds] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !firedThresholds.includes(threshold)) {
          setFiredThresholds((prev) => [...prev, threshold]);
          console.log('[Analytics] Scroll threshold reached:', { 
            threshold, 
            scrollPercent: Math.round(scrollPercent),
            timestamp: new Date().toISOString()
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds, firedThresholds]);

  return firedThresholds;
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

export function useDossierForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [walkthroughRequested, setWalkthroughRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submit = async () => {
    if (!email) return;
    
    setIsSubmitting(true);
    
    console.log('[CRM] Dossier download:', {
      email,
      role,
      walkthroughRequested,
      timestamp: new Date().toISOString()
    });
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return {
    email,
    setEmail,
    role,
    setRole,
    walkthroughRequested,
    setWalkthroughRequested,
    submit,
    isSubmitting,
    isSubmitted,
  };
}
