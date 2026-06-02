"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
	const { theme, toggle } = useTheme();

	return (
		<button
			type="button"
			onClick={toggle}
			className="flex h-8 w-8 items-center justify-center rounded-md text-[#5A5A5A] transition-colors hover:bg-[var(--bg-hover)] hover:text-[#1A1A1A] dark:text-[#A8A5A0] dark:hover:text-[#E8E6E1]"
			aria-label={
				theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
			}
		>
			{theme === "dark" ? (
				<Sun size={18} strokeWidth={2} />
			) : (
				<Moon size={18} strokeWidth={2} />
			)}
		</button>
	);
}
