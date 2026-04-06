// ── KEY CONTACTS SECTION ─────────────────────────────────────────────────────

import React from "react";
import type { Stage1Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";

interface KeyContactsSectionProps {
  data: Stage1Data["keyContacts"];
  updateKeyContact: UseDealFlowFormReturn["updateKeyContact"];
}

const ROLES = [
  { key: "decisionMaker", label: "Decision Maker (Owner/CEO)" },
  { key: "cfo", label: "CFO / Accounting Lead" },
  { key: "broker", label: "Broker / Intermediary" },
] as const;

export function KeyContactsSection({
  data,
  updateKeyContact,
}: KeyContactsSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-navy">
          <span className="dfs-card-badge">1.3</span>
          <span className="dfs-card-title">Key Contacts</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-contacts-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Role</th>
                  <th style={{ width: "26%" }}>Name</th>
                  <th style={{ width: "30%" }}>Email</th>
                  <th style={{ width: "22%" }}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((role) => (
                  <tr key={role.key}>
                    <td className="dfs-role-cell">{role.label}</td>
                    <td>
                      <input
                        type="text"
                        value={data[role.key].name}
                        onChange={(e) =>
                          updateKeyContact(role.key, { name: e.target.value })
                        }
                        placeholder="Full name"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={data[role.key].email}
                        onChange={(e) =>
                          updateKeyContact(role.key, { email: e.target.value })
                        }
                        placeholder="email@company.com"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="tel"
                        value={data[role.key].phone}
                        onChange={(e) =>
                          updateKeyContact(role.key, { phone: e.target.value })
                        }
                        placeholder="(555) 000-0000"
                        className="dfs-input dfs-table-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
