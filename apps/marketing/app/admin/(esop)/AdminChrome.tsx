"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Sidebar, type SidebarProps } from "./esop-partners/components/Sidebar";
import { AdminAreaLinks, SignOutLink } from "./admin-nav";

// Client chrome for the admin: the ESOP Partners navy rail becomes admin-wide
// chrome, and the content column is pinned to the endorsed light palette
// (constant in dark mode — the rail has no dark variant either).
//
// The server layout composes this component so the sync-health read stays
// server-side and force-dynamic rendering is preserved.

// The ESOP page's live view/filter state lives in usePartnerCRM inside the
// page component and cannot flow down through a server children tree, so the
// ESOP page registers its Sidebar sections here via context. The sections
// render only while that page is mounted (i.e. on /admin/esop-partners), and
// the rail never shows two competing "ESOP Partners" entries: on that route
// the area links are replaced by the page-fed sections, whose Sidebar renders
// the Admin-areas rows itself with ESOP Partners active.

export interface EsopRailController {
  register: (sections: SidebarProps) => void;
  clear: () => void;
}

const EsopRailContext = createContext<EsopRailController | null>(null);

// Register the ESOP rail sections for as long as the calling page is mounted.
export function useEsopRailSections(sections: SidebarProps) {
  const rail = useContext(EsopRailContext);
  useEffect(() => {
    if (!rail) return;
    rail.register(sections);
    return () => rail.clear();
  }, [rail, sections]);
}

function Wordmark() {
  return (
    <Link href="/admin" className="block border-b border-white/10 p-5 pb-4">
      <span className="font-serif text-lg leading-tight text-white">Forhemit</span>
      <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">Admin</span>
    </Link>
  );
}

function RailContent({
  esopSections,
  onNavigate,
}: {
  esopSections: SidebarProps | null;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Wordmark />
      {esopSections ? (
        <Sidebar {...esopSections} />
      ) : (
        <>
          <AdminAreaLinks onNavigate={onNavigate} />
          <div className="mt-auto px-2.5 pb-6">
            <SignOutLink onNavigate={onNavigate} />
          </div>
        </>
      )}
    </>
  );
}

export default function AdminChrome({
  syncLine,
  children,
}: {
  syncLine: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [esopSections, setEsopSections] = useState<SidebarProps | null>(null);

  const rail = useMemo<EsopRailController>(
    () => ({
      register: setEsopSections,
      clear: () => setEsopSections(null),
    }),
    [],
  );

  // Close the drawer whenever navigation happens (including back/forward).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const onEsopRoute = pathname.startsWith("/admin/esop-partners");

  return (
    <EsopRailContext.Provider value={rail}>
      <div className="min-h-screen bg-[#F2F5F9] text-[#0E1C2F]">
        {/* Desktop rail ≥768px */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col overflow-y-auto bg-[#0E1C2F] md:flex">
          <RailContent esopSections={onEsopRoute ? esopSections : null} />
        </aside>

        {/* Mobile top bar <768px */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#E8EDF5] bg-white px-4 md:hidden">
          <Link href="/admin" className="font-serif text-lg text-[#0E1C2F]">
            Forhemit <span className="text-[10px] uppercase tracking-wider text-[#8298AE]">Admin</span>
          </Link>
          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-[#0E1C2F] hover:bg-[#F2F5F9]"
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
              className="absolute inset-0 bg-[#0E1C2F]/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-64 max-w-[80%] flex-col overflow-y-auto bg-[#0E1C2F] py-2">
              <RailContent
                esopSections={onEsopRoute ? esopSections : null}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        ) : null}

        {/* Content column: light-pinned, full-bleed for ESOP (which owns its
            own topbar and padding), prose column for the other areas. */}
        <main className="flex min-h-screen min-w-0 flex-col md:pl-56">
          <div className="border-b border-[#E8EDF5] bg-white px-6 py-2 text-sm text-[#0E1C2F]">
            {syncLine}
          </div>
          {onEsopRoute ? (
            children
          ) : (
            <div className="mx-auto w-full max-w-[900px] px-6 py-8 md:px-10 md:py-10">{children}</div>
          )}
        </main>
      </div>
    </EsopRailContext.Provider>
  );
}
