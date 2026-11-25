import Link from "next/link";
import DailyView from "./daily-view";

export default function AdminPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <a
          href="/admin/logout"
          style={{
            fontSize: 14,
            textDecoration: "underline",
            opacity: 0.9,
          }}
        >
          Sign out
        </a>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Admin</h1>

      <DailyView />

      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "24px 0 8px" }}>
        Admin areas
      </h2>
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        <li>
          <Link href="/admin/crm" style={{ textDecoration: "underline" }}>
            CRM
          </Link>
        </li>
        <li>
          <Link href="/admin/esop-partners" style={{ textDecoration: "underline" }}>
            ESOP Partners
          </Link>
        </li>
        <li>
          <Link href="/admin/blog" style={{ textDecoration: "underline" }}>
            Blog posts (Convex)
          </Link>
        </li>
      </ul>
    </main>
  );
}
