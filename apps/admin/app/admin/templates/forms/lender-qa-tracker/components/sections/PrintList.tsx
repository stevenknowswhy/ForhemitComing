"use client";

import React from "react";
import { QAItem, QACategory } from "../../types";
import { CATEGORIES } from "../../constants";
import { isOverdue } from "../../lib/validation";
import { formatDate } from "../../lib/calculations";
import { groupItemsByCategory } from "../../lib/calculations";

interface PrintListProps {
  items: QAItem[];
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

export function PrintList({ items }: PrintListProps) {
  const grouped = groupItemsByCategory(items);

  if (items.length === 0) {
    return (
      <div className="lqa-card-body">
        <div className="lqa-empty-print">No items added yet.</div>
      </div>
    );
  }

  return (
    <div className="lqa-card-body">
      {CATEGORIES.map((cat) => {
        const catItems = grouped[cat as QACategory];
        if (!catItems.length) return null;

        return (
          <div key={cat} className="lqa-print-group">
            <div className="lqa-print-group-header">{cat}</div>
            {catItems.map((item, i) => {
              const isItemOverdue = isOverdue(item);
              const itemNum = item.id.split("-LQ-")[1] || String(i + 1);

              return (
                <div key={item.id} className="lqa-print-item">
                  <div className="lqa-print-num">{itemNum}</div>
                  <div>
                    <div className="lqa-print-q">{item.q}</div>
                    {item.notes && <div className="lqa-print-notes">{item.notes}</div>}
                    {item.docref && <div className="lqa-print-doc">Doc: {item.docref}</div>}
                    {(item.status === "Resolved" || item.status === "Waived") && item.resby && (
                      <div className="lqa-print-resolved">
                        {item.status} by {item.resby}
                        {item.resdate ? ` on ${formatDate(item.resdate)}` : ""}
                      </div>
                    )}
                    {isItemOverdue && (
                      <div className="lqa-print-overdue">
                        ⚠ OVERDUE (Due: {formatDate(item.due)})
                      </div>
                    )}
                  </div>
                  <StatusPill status={item.status} />
                  <PriorityPill priority={item.pri} />
                  <div className="lqa-print-owner">
                    {item.owner || "—"}
                    <br />
                    {item.due ? formatDate(item.due) : ""}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
