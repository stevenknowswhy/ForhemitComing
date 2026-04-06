"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import "../admin.css";

export default function StatsPage() {
  const appStats = useQuery(api.jobApplications.getStats, {});

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      new: "#3b82f6",
      reviewing: "#8b5cf6",
      "interview-scheduled": "#ec4899",
      rejected: "#ef4444",
      hired: "#22c55e",
    };
    return statusColors[status] || "#6b7280";
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Statistics</h1>
        <p className="admin-page-subtitle">
          Application and submission statistics
        </p>
      </div>

      {!appStats ? (
        <div className="admin-loading">Loading statistics...</div>
      ) : (
        <div className="admin-stats-detail">
          <div className="admin-stat-hero">
            <span className="admin-stat-hero-number">{appStats.total}</span>
            <span className="admin-stat-hero-label">Total Applications</span>
          </div>

          <div className="admin-stats-sections">
            <div className="admin-stats-section">
              <h3>By Status</h3>
              <div className="admin-stat-bars">
                {Object.entries(appStats.byStatus).map(([status, count]) => (
                  <div key={status} className="admin-stat-bar-item">
                    <div className="admin-stat-bar-header">
                      <span className="admin-stat-bar-label">{status}</span>
                      <span className="admin-stat-bar-value">{count as number}</span>
                    </div>
                    <div className="admin-stat-bar-track">
                      <div
                        className="admin-stat-bar-fill"
                        style={{
                          width: `${appStats.total > 0 ? ((count as number) / appStats.total) * 100 : 0}%`,
                          backgroundColor: getStatusBadge(status),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-stats-section">
              <h3>By Position</h3>
              <div className="admin-stat-list">
                {Object.entries(appStats.byPosition)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([position, count]) => (
                    <div key={position} className="admin-stat-list-item">
                      <span className="admin-stat-list-label">{position}</span>
                      <span className="admin-stat-list-value">
                        {count as number}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
