import Link from "next/link";
import { LoginForm } from "./LoginForm";

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const nextPath =
    typeof next === "string" &&
    next.startsWith("/admin") &&
    !next.startsWith("/admin/login")
      ? next
      : "/admin";

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "48px auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Admin sign-in
      </h1>
      <p style={{ opacity: 0.85, marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>
        Use the same value as <code>ADMIN_TOKEN</code> in your environment (and
        in Convex). This sets an httpOnly session cookie for one week.
      </p>
      <LoginForm nextPath={nextPath} />
      <p style={{ marginTop: 24, fontSize: 14 }}>
        <Link href="/" style={{ textDecoration: "underline" }}>
          ← Home
        </Link>
      </p>
    </main>
  );
}
