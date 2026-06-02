"use client";

import type { NdaStatus } from "@forhemit/shared/features/crm";

// ============================================
// NDA Badge Component
// ============================================

interface NdaBadgeProps {
	status: NdaStatus | string;
	size?: "sm" | "md";
}

const STATUS_STYLES: Record<
	string,
	{
		bg: string;
		color: string;
		borderColor: string;
		bgDark: string;
		colorDark: string;
		borderDark: string;
	}
> = {
	Signed: {
		bg: "rgba(5, 150, 105, 0.1)",
		color: "#059669",
		borderColor: "rgba(5, 150, 105, 0.25)",
		bgDark: "rgba(74, 222, 128, 0.15)",
		colorDark: "#4ade80",
		borderDark: "rgba(74, 222, 128, 0.3)",
	},
	Pending: {
		bg: "rgba(217, 119, 6, 0.1)",
		color: "#d97706",
		borderColor: "rgba(217, 119, 6, 0.3)",
		bgDark: "rgba(251, 191, 36, 0.15)",
		colorDark: "#fbbf24",
		borderDark: "rgba(251, 191, 36, 0.3)",
	},
	None: {
		bg: "rgba(0, 0, 0, 0.03)",
		color: "#9ca3af",
		borderColor: "#e5e7eb",
		bgDark: "rgba(255, 255, 255, 0.05)",
		colorDark: "#6a645a",
		borderDark: "rgba(245, 240, 232, 0.12)",
	},
};

export function NdaBadge({ status, size = "md" }: NdaBadgeProps) {
	const style = STATUS_STYLES[status] || STATUS_STYLES.None;

	const sizeClasses = {
		sm: "px-1.5 py-0.5 text-[9px]",
		md: "px-2 py-1 text-[10px]",
	};

	return (
		<>
			{/* Light mode */}
			<span
				className={`inline-block rounded font-medium dark:hidden ${sizeClasses[size]}`}
				style={{
					backgroundColor: style.bg,
					color: style.color,
					border: `1px solid ${style.borderColor}`,
				}}
			>
				{status}
			</span>
			{/* Dark mode */}
			<span
				className={`hidden inline-block rounded font-medium dark:inline-block ${sizeClasses[size]}`}
				style={{
					backgroundColor: style.bgDark,
					color: style.colorDark,
					border: `1px solid ${style.borderDark}`,
				}}
			>
				{status}
			</span>
		</>
	);
}
