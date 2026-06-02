"use client";

import { getDueDateStatus } from "@forhemit/shared/features/crm";

// ============================================
// Due Date Tag Component
// ============================================

interface DueDateTagProps {
	date: string | undefined | null;
}

export function DueDateTag({ date }: DueDateTagProps) {
	const status = getDueDateStatus(date);

	if (!status) return null;

	const variant =
		status.className === "crm-tag-overdue"
			? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
			: status.className === "crm-tag-today"
				? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
				: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";

	return (
		<span
			className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] ${variant}`}
		>
			{status.className === "crm-tag-overdue" && "⚠ "}
			{status.className === "crm-tag-today" && "◉ "}
			{status.className === "crm-tag-soon" && "◎ "}
			{status.label}
		</span>
	);
}
