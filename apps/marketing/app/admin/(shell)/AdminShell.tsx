"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Client island for the admin shell: the only interactive parts of the shell
// (mobile drawer toggle + active-state nav) run here; the shell layout stays
// a server component so the daily view keeps its force-dynamic data flow.

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Daily view", exact: true },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/esop-partners", label: "ESOP Partners" },
  { href: "/admin/blog", label: "Blog Posts" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <Link href="/admin" className="block px-3">
      <span className="font-serif text-xl font-semibold text-foreground">Forhemit</span>
      <span className="ml-2 text-sm uppercase tracking-wide text-muted-foreground">Admin</span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin areas" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            // py-3 keeps 44px+ tap targets at 390px (see globals.css mobile rules)
            className={cn(
              "rounded-md px-3 py-3 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <a
        href="/admin/logout"
        onClick={onNavigate}
        className="mt-4 rounded-md px-3 py-3 text-sm text-muted-foreground underline-offset-4 hover:bg-muted hover:text-foreground hover:underline"
      >
        Sign out
      </a>
    </nav>
  );
}

function RailFooter({ syncLine }: { syncLine: ReactNode }) {
  return (
    <div className="mt-auto space-y-3 px-3 pb-6">
      {syncLine}
      <p className="text-xs text-muted-foreground">Forhemit · Internal ops</p>
    </div>
  );
}

export default function AdminShell({ syncLine, children }: { syncLine: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever navigation happens (including back/forward).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop rail ≥768px */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card md:flex">
        <div className="px-3 py-6">
          <Wordmark />
        </div>
        <div className="px-3">
          <NavLinks pathname={pathname} />
        </div>
        <RailFooter syncLine={syncLine} />
      </aside>

      {/* Mobile top bar <768px */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Wordmark />
        <button
          type="button"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-muted"
        >
          {drawerOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 max-w-[80%] flex-col border-r border-border bg-card py-6">
            <div className="px-3 pb-6">
              <Wordmark />
            </div>
            <div className="px-3">
              <NavLinks pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <RailFooter syncLine={syncLine} />
          </div>
        </div>
      ) : null}

      {/* Content column: own padding and scroll; maxWidth 900 preserved */}
      <main className="md:pl-60">
        <div className="mx-auto max-w-[900px] px-6 py-8 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  );
}
