import Link from "next/link";

export default function AdminPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Admin</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Choose an admin area.
      </p>

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

