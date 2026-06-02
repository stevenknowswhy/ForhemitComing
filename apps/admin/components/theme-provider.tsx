"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "forhemit-admin-theme";

interface ThemeContextValue {
	theme: Theme;
	toggle: () => void;
	setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.setAttribute("data-theme", theme);
}

function readTheme(): Theme {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light") return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	} catch {
		return "light";
	}
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return "light";
		// Sync with what the blocking script already applied
		return document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
	});

	// On mount, double-check we're in sync with localStorage
	useEffect(() => {
		const actual = readTheme();
		setThemeState(actual);
		applyTheme(actual);
	}, []);

	// Listen for OS theme changes when no stored preference
	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (!localStorage.getItem(STORAGE_KEY)) {
				const sys: Theme = mq.matches ? "dark" : "light";
				setThemeState(sys);
				applyTheme(sys);
			}
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const setTheme = useCallback((t: Theme) => {
		setThemeState(t);
		applyTheme(t);
		try {
			localStorage.setItem(STORAGE_KEY, t);
		} catch {
			/* ignore */
		}
	}, []);

	const toggle = useCallback(() => {
		setThemeState((prev) => {
			const next: Theme = prev === "light" ? "dark" : "light";
			applyTheme(next);
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {
				/* ignore */
			}
			return next;
		});
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggle, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
	return ctx;
}

/**
 * Inline script that MUST be placed in <head> before any CSS/JS loads.
 * Reads localStorage and applies the .dark class + data-theme attribute
 * before React hydrates — prevents flash of wrong theme.
 */
export const THEME_SCRIPT = `
(function(){
  try {
    var k="${STORAGE_KEY}";
    var s=localStorage.getItem(k);
    var t=(s==="dark"||s==="light")?s:
      window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";
    if(t==="dark"){
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme","dark");
    } else {
      document.documentElement.setAttribute("data-theme","light");
    }
  } catch(e){}
})()
`;
