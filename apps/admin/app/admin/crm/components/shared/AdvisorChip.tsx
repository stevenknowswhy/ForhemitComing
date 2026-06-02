"use client";

// ============================================
// Advisor Chip Component
// ============================================

interface AdvisorChipProps {
	advisor: string | undefined;
}

export function AdvisorChip({ advisor }: AdvisorChipProps) {
	if (!advisor) return <span className="text-[var(--text3)]">—</span>;

	return (
		<span
			className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium
        bg-blue-50 text-blue-700 border border-blue-200
        dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800`}
		>
			{advisor}
		</span>
	);
}
