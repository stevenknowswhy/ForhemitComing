"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Mail,
  Bell,
  FileText,
  BarChart3,
  History,
  FileCode,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import "./admin.css";

export default function AdminDashboardPage() {
  const contacts = useQuery(api.contactSubmissions.list, { limit: 100 });
  const earlyAccess = useQuery(api.earlyAccessSignups.list, { limit: 100 });
  const applications = useQuery(api.jobApplications.list, { limit: 100 });
  const appStats = useQuery(api.jobApplications.getStats, {});

  const statsCards = [
    {
      title: "Contact Submissions",
      count: contacts?.length || 0,
      icon: <Mail size={24} />,
      href: "/admin/contacts",
      color: "#3b82f6",
    },
    {
      title: "Early Access Signups",
      count: earlyAccess?.length || 0,
      icon: <Bell size={24} />,
      href: "/admin/early-access",
      color: "#f59e0b",
    },
    {
      title: "Job Applications",
      count: applications?.length || 0,
      icon: <FileText size={24} />,
      href: "/admin/applications",
      color: "#10b981",
    },
  ];

  const quickLinks = [
    {
      title: "Business Tracker",
      description: "Track companies and deals",
      icon: <Users size={20} />,
      href: "/admin/crm",
    },
    {
      title: "Templates",
      description: "Document templates and forms",
      icon: <FileCode size={20} />,
      href: "/admin/templates",
    },
    {
      title: "Statistics",
      description: "View application statistics",
      icon: <BarChart3 size={20} />,
      href: "/admin/stats",
    },
    {
      title: "Audit Log",
      description: "Track system changes",
      icon: <History size={20} />,
      href: "/admin/audit",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Welcome to the Forhemit admin dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <section className="admin-dashboard-section">
        <h2 className="admin-section-title">Overview</h2>
        <div className="admin-stats-grid">
          {statsCards.map((card) => (
            <Link key={card.href} href={card.href} className="admin-stat-card">
              <div
                className="admin-stat-card-icon"
                style={{ color: card.color, background: `${card.color}15` }}
              >
                {card.icon}
              </div>
              <div className="admin-stat-card-content">
                <span className="admin-stat-card-count">{card.count}</span>
                <span className="admin-stat-card-title">{card.title}</span>
              </div>
              <ArrowRight size={18} className="admin-stat-card-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="admin-dashboard-section">
        <h2 className="admin-section-title">Quick Links</h2>
        <div className="admin-quick-links">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="admin-quick-link">
              <span className="admin-quick-link-icon">{link.icon}</span>
              <div className="admin-quick-link-content">
                <span className="admin-quick-link-title">{link.title}</span>
                <span className="admin-quick-link-description">
                  {link.description}
                </span>
              </div>
              <ArrowRight size={16} className="admin-quick-link-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Summary */}
      <section className="admin-dashboard-section">
        <h2 className="admin-section-title">Application Status Overview</h2>
        {!appStats ? (
          <div className="admin-loading">Loading statistics...</div>
        ) : (
          <div className="admin-status-bars">
            {Object.entries(appStats.byStatus).map(([status, count]) => (
              <div key={status} className="admin-status-bar-item">
                <div className="admin-status-bar-header">
                  <span className="admin-status-bar-label">{status}</span>
                  <span className="admin-status-bar-value">{count as number}</span>
                </div>
                <div className="admin-status-bar-track">
                  <div
                    className="admin-status-bar-fill"
                    style={{
                      width: `${appStats.total > 0 ? ((count as number) / appStats.total) * 100 : 0}%`,
                      backgroundColor: getStatusColor(status),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: "#3b82f6",
    "in-progress": "#f59e0b",
    responded: "#10b981",
    closed: "#6b7280",
    reviewing: "#8b5cf6",
    "interview-scheduled": "#ec4899",
    rejected: "#ef4444",
    hired: "#22c55e",
  };
  return colors[status] || "#6b7280";
}
