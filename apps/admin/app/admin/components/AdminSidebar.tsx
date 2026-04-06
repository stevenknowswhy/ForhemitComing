"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isSuperAdmin } from "@/lib/clerk";
import {
  LayoutDashboard,
  Mail,
  Bell,
  FileText,
  BarChart3,
  History,
  FileCode,
  Users,
  Network,
  UserCog,
  PenTool,
  Phone,
  Menu,
  PanelLeftClose,
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
  userButton?: React.ReactNode;
  /** When true (mobile drawer open), sidebar is visible off-canvas */
  mobileOpen?: boolean;
  /** Close drawer after navigating (mobile) */
  onCloseMobile?: () => void;
  /** Desktop only: narrow icon rail when true */
  desktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export default function AdminSidebar({
  contactCount = 0,
  earlyAccessCount = 0,
  applicationCount = 0,
  userButton,
  mobileOpen = false,
  onCloseMobile,
  desktopCollapsed = false,
  onToggleDesktopCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isSuperAdminUser = isSuperAdmin(userEmail);

  const mainNavItems: NavItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/admin/phone-messages",
      label: "Phone Messages",
      icon: <Phone size={20} />,
    },
    {
      href: "/admin/contacts",
      label: "Contact Submissions",
      icon: <Mail size={20} />,
      badge: contactCount,
    },
    {
      href: "/admin/early-access",
      label: "Early Access",
      icon: <Bell size={20} />,
      badge: earlyAccessCount,
    },
    {
      href: "/admin/applications",
      label: "Job Applications",
      icon: <FileText size={20} />,
      badge: applicationCount,
    },
  ];

  const toolsNavItems: NavItem[] = [
    {
      href: "/admin/crm",
      label: "Business Tracker",
      icon: <Users size={20} />,
    },
    {
      href: "/admin/esop-partners",
      label: "ESOP Partners",
      icon: <Network size={20} />,
    },
    {
      href: "/admin/letters",
      label: "Letters",
      icon: <PenTool size={20} />,
    },
    {
      href: "/admin/templates",
      label: "Templates",
      icon: <FileCode size={20} />,
    },
    {
      href: "/admin/stats",
      label: "Statistics",
      icon: <BarChart3 size={20} />,
    },
    {
      href: "/admin/audit",
      label: "Audit Log",
      icon: <History size={20} />,
    },
  ];

  // Admin-only navigation items (super admin only)
  const adminNavItems: NavItem[] = isSuperAdminUser
    ? [
        {
          href: "/admin/users",
          label: "User Management",
          icon: <UserCog size={20} />,
        },
      ]
    : [];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const asideClass =
    "admin-sidebar-stitch" +
    (mobileOpen ? " open" : "") +
    (desktopCollapsed ? " collapsed" : "");

  return (
    <aside className={asideClass}>
      <div className="sidebar-header">
        <div className="sidebar-header-inner">
          <Link
            href="/admin"
            className="sidebar-logo"
            onClick={() => onCloseMobile?.()}
            title="Forhemit Admin"
          >
            <span className="sidebar-logo-icon">F</span>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">Forhemit</span>
              <span className="sidebar-logo-subtitle">Admin</span>
            </div>
          </Link>
          {onToggleDesktopCollapse ? (
            <button
              type="button"
              className="sidebar-rail-toggle"
              aria-label={
                desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              aria-expanded={!desktopCollapsed}
              onClick={onToggleDesktopCollapse}
            >
              <span className="sidebar-rail-toggle-icon" aria-hidden>
                {desktopCollapsed ? (
                  <Menu size={20} strokeWidth={2.25} />
                ) : (
                  <PanelLeftClose size={20} strokeWidth={2} />
                )}
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <span className="sidebar-section-title">Main</span>
          <ul className="sidebar-menu">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => onCloseMobile?.()}
                  title={item.label}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-label">{item.label}</span>
                  {item.badge ? (
                    <span className="sidebar-badge">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-title">Tools</span>
          <ul className="sidebar-menu">
            {toolsNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => onCloseMobile?.()}
                  title={item.label}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-label">{item.label}</span>
                  {item.badge ? (
                    <span className="sidebar-badge">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {adminNavItems.length > 0 && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Administration</span>
            <ul className="sidebar-menu">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={() => onCloseMobile?.()}
                    title={item.label}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    <span className="sidebar-link-label">{item.label}</span>
                    {item.badge ? (
                      <span className="sidebar-badge">{item.badge}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        {userButton && (
          <div className="flex items-center gap-3">
            {userButton}
          </div>
        )}
      </div>
    </aside>
  );
}
