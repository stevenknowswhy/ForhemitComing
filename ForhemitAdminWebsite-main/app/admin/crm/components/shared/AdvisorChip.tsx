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
      className="inline-block rounded px-2 py-0.5 text-[10px] font-medium"
      style={{
        backgroundColor: "#1a4f8a",
        color: "#4d9eff",
        border: "1px solid #1a4f8a",
      }}
    >
      {advisor}
    </span>
  );
}
