"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "forhemit-theme";

function getSystemTheme(): ResolvedTheme {
  return "light";
}

function readStoredTheme(): { theme: Theme; resolvedTheme: ResolvedTheme } {
  return { theme: "light", resolvedTheme: "light" };
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const applyToDocument = useCallback((_resolved: ResolvedTheme) => {
    setResolvedTheme("light");
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.colorScheme = "light";
  }, []);

  // Hydrate from localStorage after mount (matches blocking script in layout.tsx)
  useEffect(() => {
    const initial = readStoredTheme();
    setThemeState(initial.theme);
    localStorage.setItem(STORAGE_KEY, "light");
    applyToDocument(initial.resolvedTheme);
  }, [applyToDocument]);

  useEffect(() => {
    applyToDocument("light");
    return;
  }, [theme, enableSystem, applyToDocument]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setThemeState("light");
      applyToDocument("light");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyToDocument]);

  const setTheme = useCallback(
    (_newTheme: Theme) => {
      setThemeState("light");
      localStorage.setItem(STORAGE_KEY, "light");
      applyToDocument("light");
    },
    [applyToDocument]
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "l" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: "system",
      resolvedTheme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
