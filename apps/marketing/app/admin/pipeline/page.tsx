import Link from "next/link";
import DealPipeline from "../deal-pipeline";

// /admin/pipeline — the full deal pipeline board (v2 shape, P2), inside
// the existing ADMIN_TOKEN password-session login (middleware-enforced,
// same as /admin). Server-rendered; all Supabase reads happen
// server-side.

export default function PipelinePage() {
  return (
    <main
      style={{
        padding: 24,
        maxWidth: 1400,
        margin: "0 auto",
        background: "#F4F6F8",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Link
          href="/admin"
          style={{
            fontSize: 14,
            textDecoration: "underline",
            display: "inline-block",
            padding: "10px 2px",
          }}
        >
          ← Admin
        </Link>
        <a
          href="/admin/logout"
          style={{
            fontSize: 14,
            textDecoration: "underline",
            opacity: 0.9,
            display: "inline-block",
            padding: "10px 2px",
          }}
        >
          Sign out
        </a>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
        Deal Pipeline
      </h1>
      <p style={{ opacity: 0.75, fontSize: 14, marginBottom: 20 }}>
        One pipeline from first research to stewardship. The action queue
        comes first — due and overdue work only. Then four bands: A Top
        of funnel (outreach founders), B Qualification &amp; engagement
        (the anonymous Check / Estimate / Fit steps run as a funnel
        strip, not columns; Onboarding bridges to the spine), C
        Transition (spine cases, 120 days from Documents-Ready),
        D Stewardship (Managed only, as a register). There is no
        outreach-to-case link in the data yet (Gap G3), so the
        populations meet on this board, not in a record.
      </p>
      <DealPipeline />
    </main>
  );
}
