"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Phone, CheckCircle, Clock, FileText, PlayCircle, Trash2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { formatPhoneNumber } from "@/app/lib/formatters";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "../admin.css";

interface PhoneMessage {
  _id: Id<"phoneMessages">;
  _creationTime: number;
  callId: string;
  agentId?: string;
  callerNumber?: string;
  transcript?: string;
  recordingUrl?: string;
  status?: string;
  duration?: number;
  summary?: string;
  createdAt: number;
  read?: boolean;
}

export default function PhoneMessagesPage() {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [messageToDelete, setMessageToDelete] = useState<Id<"phoneMessages"> | null>(null);
  const messages = useQuery(api.phoneMessages.getMessages);
  const markAsRead = useMutation(api.phoneMessages.markAsRead);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: string | undefined) => {
    const statusColors: Record<string, string> = {
      completed: "#10b981",
      failed: "#ef4444",
      "in-progress": "#f59e0b",
      missed: "#6b7280",
    };
    return statusColors[status || "missed"] || "#6b7280";
  };

  const handleToggleRead = (id: Id<"phoneMessages">, currentReadStatus: boolean) => {
    markAsRead({ id, read: !currentReadStatus });
  };

  const filteredMessages = messages?.filter((msg) => {
    if (filterStatus && msg.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Phone Messages</h1>
        <p className="admin-page-subtitle">
          Manage AI agent phone calls, summaries, and recordings
        </p>
      </div>

      <div className="admin-section-header">
        <h2>Call History</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="failed">Failed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      {!messages ? (
        <div className="admin-loading">Loading...</div>
      ) : filteredMessages?.length === 0 ? (
        <div className="admin-empty-state">No phone messages found</div>
      ) : (
        <div className="admin-cards-grid">
          {filteredMessages?.map((msg) => (
            <div
              key={msg._id}
              className={`admin-card ${msg.read ? "read" : "unread"}`}
              style={{ borderLeft: msg.read ? "none" : "4px solid #3b82f6" }}
            >
              <div className="admin-card-header">
                <div className="admin-card-title-row">
                  <span className="admin-card-title flex items-center gap-2">
                    <Phone size={16} />
                    {msg.callerNumber ? formatPhoneNumber(msg.callerNumber) : "Unknown Caller"}
                  </span>
                  {!msg.read && (
                    <span className="admin-edited-badge" style={{ color: "#3b82f6", fontWeight: "bold" }}>
                      New
                    </span>
                  )}
                </div>
                <span
                  className="admin-status-badge"
                  style={{ backgroundColor: getStatusBadge(msg.status) }}
                >
                  {msg.status || "unknown"}
                </span>
              </div>

              <div className="admin-card-meta">
                <span className="admin-meta-item">
                  <Clock size={14} />
                  {formatDate(msg.createdAt)}
                </span>
                <span className="admin-meta-item">
                  <PlayCircle size={14} />
                  {formatDuration(msg.duration)}
                </span>
              </div>

              {msg.summary && (
                <div className="admin-card-message">
                  <strong>Summary:</strong> {msg.summary}
                </div>
              )}

              {msg.recordingUrl && (
                <div className="admin-card-actions" style={{ marginTop: "1rem" }}>
                  <audio controls src={msg.recordingUrl} style={{ width: "100%", height: "40px" }} />
                </div>
              )}

              {msg.transcript && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-1">
                      <FileText size={14} /> View Transcript
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {msg.transcript}
                    </div>
                  </details>
                </div>
              )}

              <div className="admin-card-actions mt-4 pt-3 border-t" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className="admin-action-btn"
                  onClick={() => handleToggleRead(msg._id, !!msg.read)}
                >
                  <CheckCircle size={14} />
                  {msg.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  className="admin-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessageToDelete(msg._id);
                  }}
                  style={{ color: '#ef4444', borderColor: 'transparent', backgroundColor: 'transparent' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={messageToDelete !== null}
        onClose={() => setMessageToDelete(null)}
        entityId={messageToDelete}
        entityType="phoneMessage"
        entityName="this phone message"
        onSuccess={() => {
          setMessageToDelete(null);
        }}
      />
    </div>
  );
}
