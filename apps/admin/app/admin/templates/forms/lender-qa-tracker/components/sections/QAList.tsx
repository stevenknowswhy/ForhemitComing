"use client";

import React from "react";
import { QAItem, QACategory } from "../../types";
import { CATEGORIES } from "../../constants";
import { isOverdue, isNearDue } from "../../lib/validation";
import { formatDate } from "../../lib/calculations";
import { groupItemsByCategory } from "../../lib/calculations";

interface QAListProps {
  items: (QAItem & { _idx: number })[];
  expandedItem: number | null;
  closeDate: string;
  onToggleExpand: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function StatusPill({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    Open: "lqa-pill-open",
    Pending: "lqa-pill-pending",
    Resolved: "lqa-pill-resolved",
    Blocked: "lqa-pill-blocked",
    Waived: "lqa-pill-waived",
  };
  return <span className={`lqa-pill ${classMap[status] || ""}`}>{status}</span>;
}

function PriorityPill({ priority }: { priority: string }) {
  const classMap: Record<string, string> = {
    High: "lqa-pill-high",
    Med: "lqa-pill-med",
    Low: "lqa-pill-low",
  };
  return <span className={`lqa-pill ${classMap[priority] || ""}`}>{priority}</span>;
}

export function QAList({
  items,
  expandedItem,
  closeDate,
  onToggleExpand,
  onEdit,
  onDelete,
}: QAListProps) {
  const grouped = groupItemsByCategory(items);

  if (items.length === 0) {
    return (
      <div className="lqa-empty-state">
        No items match this filter.
        <br />
        <span>Try &quot;All&quot; or add a new item below.</span>
      </div>
    );
  }

  return (
    <>
      {CATEGORIES.map((cat) => {
        const catItems = grouped[cat as QACategory];
        if (!catItems.length) return null;

        return (
          <div key={cat} className="lqa-qa-group">
            <div className="lqa-qa-group-header">
              <span>{cat}</span>
              <span>
                {catItems.length} item{catItems.length !== 1 ? "s" : ""}
              </span>
            </div>
            {catItems.map((item) => {
              const isItemOverdue = isOverdue(item);
              const isItemNearDue = isNearDue(item, closeDate);
              const isBlocked = item.status === "Blocked";
              const isExpanded = expandedItem === item._idx;

              let rowClass = "lqa-qa-item";
              if (isItemOverdue) rowClass += " overdue";
              if (isBlocked) rowClass += " blocked";
              if (isExpanded) rowClass += " expanded";

              const itemNum = item.id.split("-LQ-")[1] || item._idx + 1;

              return (
                <React.Fragment key={item._idx}>
                  <div
                    className={rowClass}
                    onClick={() => onToggleExpand(item._idx)}
                    id={`row-${item._idx}`}
                  >
                    <div className="lqa-qa-num">{itemNum}</div>
                    <div>
                      <div className="lqa-qa-q">{item.q}</div>
                      {item.notes ? (
                        <div className="lqa-qa-a">{item.notes}</div>
                      ) : (
                        <div className="lqa-qa-a lqa-no-notes">No response yet</div>
                      )}
                      {isItemNearDue && (
                        <div className="lqa-qa-near-due">⚠ Due before close date</div>
                      )}
                    </div>
                    <div>
                      <div className="lqa-qa-col-label">Status</div>
                      <StatusPill status={item.status} />
                    </div>
                    <div>
                      <div className="lqa-qa-col-label">Priority</div>
                      <PriorityPill priority={item.pri} />
                    </div>
                    <div>
                      <div className="lqa-qa-col-label">Due</div>
                      <div className={`lqa-qa-col-val ${isItemOverdue ? "lqa-overdue-text" : ""}`}>
                        {item.due ? formatDate(item.due) : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="lqa-qa-col-label">Owner</div>
                      <div className="lqa-qa-col-val">{item.owner || "—"}</div>
                    </div>
                    {(isItemOverdue || isBlocked) && (
                      <div className="lqa-qa-warning">⚠</div>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="lqa-qa-detail open">
                      <div className="lqa-qa-detail-grid">
                        <div className="lqa-field">
                          <label>Condition text</label>
                          <div className="lqa-detail-text">{item.q}</div>
                        </div>
                        <div className="lqa-field">
                          <label>Source</label>
                          <div className="lqa-detail-value">{item.source || "—"}</div>
                        </div>
                        <div className="lqa-field">
                          <label>Document reference</label>
                          <div className="lqa-detail-value">{item.docref || "—"}</div>
                        </div>
                        <div className="lqa-field">
                          <label>Date received</label>
                          <div className="lqa-detail-value">
                            {item.dateReceived ? formatDate(item.dateReceived) : "—"}
                          </div>
                        </div>
                        {(item.status === "Resolved" || item.status === "Waived") && (
                          <>
                            <div className="lqa-field">
                              <label>Resolved date</label>
                              <div className="lqa-detail-value">
                                {item.resdate ? formatDate(item.resdate) : "—"}
                              </div>
                            </div>
                            <div className="lqa-field">
                              <label>Resolved by</label>
                              <div className="lqa-detail-value">{item.resby || "—"}</div>
                            </div>
                          </>
                        )}
                        <div className="lqa-field">
                          <label>Item ID</label>
                          <div className="lqa-detail-id">{item.id}</div>
                        </div>
                        <div className="lqa-field">
                          <label>Last modified</label>
                          <div className="lqa-detail-value">
                            {item.lastModified
                              ? new Date(item.lastModified).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      </div>
                      <div className="lqa-detail-actions">
                        <button
                          className="lqa-btn lqa-btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item._idx);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="lqa-btn lqa-btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._idx);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
