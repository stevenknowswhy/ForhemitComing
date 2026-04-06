"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, Settings, Users } from "lucide-react";

type AdminMobileShellContextValue = {
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  mobileHeaderRight: ReactNode;
  setMobileHeaderRight: (node: ReactNode | null) => void;
};

const AdminMobileShellContext =
  createContext<AdminMobileShellContextValue | null>(null);

export function AdminMobileShellProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileHeaderRight, setMobileHeaderRightState] = useState<ReactNode>(
    null
  );

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const setMobileHeaderRight = useCallback((node: ReactNode | null) => {
    setMobileHeaderRightState(node);
  }, []);

  const value = useMemo(
    () => ({
      sidebarOpen,
      openSidebar,
      closeSidebar,
      mobileHeaderRight,
      setMobileHeaderRight,
    }),
    [sidebarOpen, openSidebar, closeSidebar, mobileHeaderRight, setMobileHeaderRight]
  );

  return (
    <AdminMobileShellContext.Provider value={value}>
      {children}
    </AdminMobileShellContext.Provider>
  );
}

export function useAdminMobileShell() {
  const ctx = useContext(AdminMobileShellContext);
  if (!ctx) {
    throw new Error(
      "useAdminMobileShell must be used within AdminMobileShellProvider"
    );
  }
  return ctx;
}

/** Fixed top bar: menu · Management · optional right slot (e.g. Add on users page) */
export function AdminMobileAppBar() {
  const { openSidebar, mobileHeaderRight } = useAdminMobileShell();

  return (
    <header className="admin-mobile-appbar" role="banner">
      <button
        type="button"
        className="admin-mobile-appbar-btn"
        aria-label="Open navigation menu"
        onClick={openSidebar}
      >
        <Menu className="h-5 w-5 text-[#4c635d]" strokeWidth={2} />
      </button>
      <span className="admin-mobile-appbar-title">Management</span>
      <div className="admin-mobile-appbar-right">{mobileHeaderRight}</div>
    </header>
  );
}

export function AdminMobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="users-mobile-bottom-nav" aria-label="Admin navigation">
      <Link
        href="/admin"
        className={`admin-mobile-nav-link ${isActive("/admin") ? "active" : ""}`}
      >
        <LayoutDashboard className="h-5 w-5" strokeWidth={1.75} />
        <span className="admin-mobile-nav-label">Dashboard</span>
      </Link>
      <Link
        href="/admin/users"
        className={`admin-mobile-nav-link ${isActive("/admin/users") ? "active" : ""}`}
      >
        <Users className="h-5 w-5" strokeWidth={1.75} />
        <span className="admin-mobile-nav-label">Users</span>
      </Link>
      <Link
        href="/admin/audit"
        className={`admin-mobile-nav-link ${isActive("/admin/audit") ? "active" : ""}`}
      >
        <Settings className="h-5 w-5" strokeWidth={1.75} />
        <span className="admin-mobile-nav-label">Settings</span>
      </Link>
    </nav>
  );
}
