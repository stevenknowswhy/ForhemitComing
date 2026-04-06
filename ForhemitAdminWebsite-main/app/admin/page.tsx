"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { isSuperAdmin } from "@/lib/clerk";
import {
  Mail,
  Bell,
  FileText,
  BarChart3,
  History,
  FileCode,
  Users,
  UserCog,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isSuperAdminUser = isSuperAdmin(userEmail);

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
    ...(isSuperAdminUser
      ? [
          {
            title: "User Management",
            description: "Invite admin users and manage access",
            icon: <UserCog size={20} />,
            href: "/admin/users",
          },
        ]
      : []),
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
    <div>
      {/* Page Header */}
      <div className="page-header-stitch">
        <div className="header-top">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome to the Forhemit admin dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 
          style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}
        >
          Overview
        </h2>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {statsCards.map((card) => (
            <Link 
              key={card.href} 
              href={card.href}
              className="card-stitch card-stitch-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  flexShrink: 0,
                  color: card.color,
                  background: `${card.color}15`,
                }}
              >
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span 
                  style={{ 
                    display: 'block',
                    fontSize: '1.75rem', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    marginBottom: '0.25rem'
                  }}
                >
                  {card.count}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.8125rem', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  {card.title}
                </span>
              </div>
              <ArrowRight 
                size={18} 
                style={{ 
                  color: 'var(--text-muted)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 
          style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}
        >
          Quick Links
        </h2>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem'
          }}
        >
          {quickLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="card-stitch card-stitch-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: 'var(--color-brand)', flexShrink: 0 }}>
                {link.icon}
              </span>
              <div style={{ flex: 1 }}>
                <span 
                  style={{ 
                    display: 'block',
                    fontWeight: 500, 
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem'
                  }}
                >
                  {link.title}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.8125rem', 
                    color: 'var(--text-secondary)',
                    marginTop: '0.125rem'
                  }}
                >
                  {link.description}
                </span>
              </div>
              <ArrowRight 
                size={16} 
                style={{ 
                  color: 'var(--text-muted)',
                  flexShrink: 0
                }} 
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Application Status Overview */}
      <section>
        <h2 
          style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}
        >
          Application Status Overview
        </h2>
        {!appStats ? (
          <div className="loading-state-stitch">
            <div className="spinner-stitch" />
          </div>
        ) : (
          <div 
            className="card-stitch"
            style={{ padding: '1.5rem', maxWidth: '600px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(appStats.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <span 
                      style={{ 
                        fontSize: '0.8125rem', 
                        color: 'var(--text-secondary)',
                        textTransform: 'capitalize'
                      }}
                    >
                      {status}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.8125rem', 
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {count as number}
                    </span>
                  </div>
                  <div 
                    style={{
                      height: '8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                        width: `${appStats.total > 0 ? ((count as number) / appStats.total) * 100 : 0}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
