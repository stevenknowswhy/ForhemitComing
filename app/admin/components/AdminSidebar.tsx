"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Bell,
  FileText,
  BarChart3,
  History,
  FileCode,
  Users,
  LogOut,
  Network,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminSidebarProps {
  contactCount?: number;
  earlyAccessCount?: number;
  applicationCount?: number;
  onLogout: () => void;
}

export default function AdminSidebar({
  contactCount = 0,
  earlyAccessCount = 0,
  applicationCount = 0,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: "/admin/contacts",
      label: "Contact Submissions",
      icon: <Mail size={18} />,
      badge: contactCount,
    },
    {
      href: "/admin/early-access",
      label: "Early Access",
      icon: <Bell size={18} />,
      badge: earlyAccessCount,
    },
    {
      href: "/admin/applications",
      label: "Job Applications",
      icon: <FileText size={18} />,
      badge: applicationCount,
    },
  ];

  const toolsNavItems: NavItem[] = [
    {
      href: "/admin/crm",
      label: "Business Tracker",
      icon: <Users size={18} />,
    },
    {
      href: "/admin/esop-partners",
      label: "ESOP Partners",
      icon: <Network size={18} />,
    },
    {
      href: "/admin/templates",
      label: "Templates",
      icon: <FileCode size={18} />,
    },
    {
      href: "/admin/stats",
      label: "Statistics",
      icon: <BarChart3 size={18} />,
    },
    {
      href: "/admin/audit",
      label: "Audit Log",
      icon: <History size={18} />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-sidebar-logo">
          <span className="admin-sidebar-logo-icon">F</span>
          <div className="admin-sidebar-logo-text">
            <span className="admin-sidebar-logo-title">Forhemit</span>
            <span className="admin-sidebar-logo-subtitle">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section">
          <span className="admin-sidebar-section-title">Main</span>
          <ul className="admin-sidebar-menu">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-sidebar-link ${isActive(item.href) ? "active" : ""}`}
                >
                  <span className="admin-sidebar-link-icon">{item.icon}</span>
                  <span className="admin-sidebar-link-label">{item.label}</span>
                  {item.badge ? (
                    <span className="admin-sidebar-badge">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-sidebar-section">
          <span className="admin-sidebar-section-title">Tools</span>
          <ul className="admin-sidebar-menu">
            {toolsNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-sidebar-link ${isActive(item.href) ? "active" : ""}`}
                >
                  <span className="admin-sidebar-link-icon">{item.icon}</span>
                  <span className="admin-sidebar-link-label">{item.label}</span>
                  {item.badge ? (
                    <span className="admin-sidebar-badge">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={onLogout} className="admin-sidebar-logout">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
