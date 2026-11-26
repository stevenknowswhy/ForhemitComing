"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// URL-driven cross-area nav for the navy rail. Cross-area active state can
// only follow the URL (each area owns its own state), while navigation inside
// an area stays state-driven — e.g. the ESOP Views rows below this section.

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Daily view", exact: true },
  { href: "/admin/pipeline", label: "Deal Pipeline" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/esop-partners", label: "ESOP Partners" },
  { href: "/admin/blog", label: "Blog Posts" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

// Shared by AdminChrome (non-ESOP routes) and the ESOP Sidebar (rendered on
// /admin/esop-partners), so the rail shows exactly one Admin-areas section.
export function AdminAreaLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="px-2.5 pb-2 pt-4">
      <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        Admin
      </div>
      <nav aria-label="Admin areas" className="flex flex-col gap-0.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              // min-h-[44px] keeps 44px+ tap targets in the mobile drawer
              className={cn(
                "flex min-h-[44px] items-center rounded-md px-2.5 py-2 text-xs font-medium transition-all",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white/90"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function SignOutLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      href="/admin/logout"
      onClick={onNavigate}
      className="flex min-h-[44px] items-center rounded-md px-2.5 py-2 text-xs font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white/90"
    >
      Sign out
    </a>
  );
}
