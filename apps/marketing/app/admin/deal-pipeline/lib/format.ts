// Display formatting for the deal pipeline (Pacific time, matching the
// daily view's convention).

const PT = "America/Los_Angeles";

export function formatPt(iso: string | null): string {
  if (!iso) return "never";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PT,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function pathLabel(path: string | null): string | null {
  if (!path) return null;
  // Spine path values arrive as e.g. "Managed" / "Self Guided" — show as-is.
  return path;
}
