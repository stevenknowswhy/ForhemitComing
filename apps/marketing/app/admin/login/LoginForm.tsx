"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAdminAction } from "./actions";

interface Props {
  nextPath: string;
}

export function LoginForm({ nextPath }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      style={{ display: "grid", gap: 14 }}
      action={(fd) => {
        setError(null);
        startTransition(async () => {
          const res = await loginAdminAction(fd);
          if (res.ok) {
            router.push(res.next);
            router.refresh();
          } else {
            setError(res.error);
          }
        });
      }}
    >
      <input type="hidden" name="next" value={nextPath} />
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 14 }}>Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          disabled={pending}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />
      </label>
      {error && (
        <div style={{ color: "#fecaca", fontSize: 14 }} role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "10px 14px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.25)",
          cursor: pending ? "wait" : "pointer",
          marginTop: 4,
        }}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
