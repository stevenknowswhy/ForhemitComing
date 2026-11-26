import Link from "next/link";
import DealPipeline from "../deal-pipeline";

// /admin/pipeline — the full deal pipeline board, inside the existing
// ADMIN_TOKEN password-session login (middleware-enforced, same as /admin).
// Server-rendered; all Supabase reads happen server-side.

export default function PipelinePage() {
  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Link href="/admin" style={{ fontSize: 14, textDecoration: "underline" }}>
          ← Admin
        </Link>
        <a
          href="/admin/logout"
          style={{ fontSize: 14, textDecoration: "underline", opacity: 0.9 }}
        >
          Sign out
        </a>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
        Deal Pipeline
      </h1>
      <p style={{ opacity: 0.75, fontSize: 14, marginBottom: 20 }}>
        One pipeline from first research to stewardship, in four bands:
        A Top of funnel (outreach founders), B Qualification &amp; engagement
        (ruled stages, no stored data yet — Gap G4), C Transition (spine
        cases, 120 days from Documents-Ready), D Stewardship (Managed only).
        There is no outreach-to-case link in the data yet (Gap G3), so the
        populations meet on this board, not in a record.
      </p>
      <DealPipeline />
    </main>
  );
}
