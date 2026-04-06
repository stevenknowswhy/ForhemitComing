"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface BlogThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const BlogThemeContext = createContext<BlogThemeContextType | undefined>(undefined);

const STORAGE_KEY = "forhemit-blog-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) return stored;
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  // Apply to container for scoped styling
  const container = document.querySelector('.blog-standalone');
  if (container) {
    if (theme === "dark") {
      container.classList.add("dark");
      container.classList.remove("light");
    } else {
      container.classList.remove("dark");
      container.classList.add("light");
    }
  }
  // Also apply to html for initial render consistency
  if (theme === "dark") {
    document.documentElement.classList.add("blog-dark");
    document.documentElement.classList.remove("blog-light");
  } else {
    document.documentElement.classList.remove("blog-dark");
    document.documentElement.classList.add("blog-light");
  }
}

export function BlogThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isClient, setIsClient] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setIsClient(true);
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Listen for system theme changes (only if no stored preference)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch - render with default theme first
  // The useEffect will correct it immediately after mount
  return (
    <BlogThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </BlogThemeContext.Provider>
  );
}

export function useBlogTheme(): BlogThemeContextType {
  const context = useContext(BlogThemeContext);
  if (context === undefined) {
    // Return fallback during SSR/static generation
    if (typeof window === "undefined") {
      return {
        theme: "light",
        toggleTheme: () => {},
      };
    }
    throw new Error("useBlogTheme must be used within BlogThemeProvider");
  }
  return context;
}
