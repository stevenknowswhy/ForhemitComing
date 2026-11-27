"use client";

// One-tap touch logging (Backend Step 6). Client island used inside the
// server-rendered Outreach block: it carries NO Supabase credential — it
// POSTs to the admin-session-guarded API route
// (app/api/admin/outreach-touches), which writes server-side with the
// service-role key. On success it refreshes the server component so the
// due list and touch history re-render from Supabase.

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogTouchButton({
  contactId,
  touchNo,
}: {
  contactId: string;
  touchNo: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function log() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/outreach-touches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact_id: contactId, touch_no: touchNo }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? `Log failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPending(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={log}
        disabled={pending}
        // Fix pass #9: min-h-10 keeps the tap target ≥40px tall on
        // touch devices (was ~24px with py-0.5).
        className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded border px-3 py-0.5 text-sm hover:bg-muted disabled:opacity-50"
      >
        {pending ? "Logging…" : `Log Touch ${touchNo}`}
      </button>
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </span>
  );
}
