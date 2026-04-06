"use client";

import { getDueDateStatus } from "../../lib";

// ============================================
// Due Date Tag Component
// ============================================

interface DueDateTagProps {
  date: string | undefined | null;
}

export function DueDateTag({ date }: DueDateTagProps) {
  const status = getDueDateStatus(date);

  if (!status) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px]"
      style={{
        backgroundColor:
          status.className === "crm-tag-overdue"
            ? "#7a1a1a"
            : status.className === "crm-tag-today"
            ? "#7a4f0a"
            : "#0d4a2a",
        color:
          status.className === "crm-tag-overdue"
            ? "#ff5f5f"
            : status.className === "crm-tag-today"
            ? "#f5a623"
            : "#2dd882",
        border: `1px solid ${
          status.className === "crm-tag-overdue"
            ? "#ff5f5f"
            : status.className === "crm-tag-today"
            ? "#f5a623"
            : "#1a8f52"
        }`,
      }}
    >
      {status.className === "crm-tag-overdue" && "⚠ "}
      {status.className === "crm-tag-today" && "◉ "}
      {status.className === "crm-tag-soon" && "◎ "}
      {status.label}
    </span>
  );
}
