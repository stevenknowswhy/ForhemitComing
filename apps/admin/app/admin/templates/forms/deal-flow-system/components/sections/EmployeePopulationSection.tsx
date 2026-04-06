// ── EMPLOYEE POPULATION SECTION ──────────────────────────────────────────────

import React from "react";
import type { Stage2Data } from "../../types";
import type { UseDealFlowFormReturn } from "../../hooks/useDealFlowForm";
import {
  SelectInput,
  NumberInput,
} from "../inputs";
import { YES_NO_OPTIONS, KEY_PERSON_INS_OPTIONS } from "../../constants";

interface EmployeePopulationSectionProps {
  data: Stage2Data["employeePopulation"];
  updateEmployeeCategory: UseDealFlowFormReturn["updateEmployeeCategory"];
  updateEmployeePopulation: UseDealFlowFormReturn["updateEmployeePopulation"];
}

const CATEGORIES = [
  { key: "fullTime", label: "Full-Time" },
  { key: "partTime", label: "Part-Time", hasExclude: true },
  { key: "union", label: "Union", hasCba: true },
  { key: "management", label: "Management (>10% equity)", hasTopHeavy: true },
] as const;

export function EmployeePopulationSection({
  data,
  updateEmployeeCategory,
  updateEmployeePopulation,
}: EmployeePopulationSectionProps) {
  return (
    <div className="dfs-section">
      <div className="dfs-card">
        <div className="dfs-card-header dfs-card-header-blue">
          <span className="dfs-card-badge">2.3</span>
          <span className="dfs-card-title">Employee Population Analysis</span>
        </div>
        <div className="dfs-card-body">
          <div className="dfs-table-wrap">
            <table className="dfs-table dfs-employee-table">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Category</th>
                  <th style={{ width: "12%" }}>Count</th>
                  <th style={{ width: "15%" }}>Avg Tenure</th>
                  <th style={{ width: "15%" }}>Avg Comp</th>
                  <th style={{ width: "36%" }}>Notes / Flags</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat) => {
                  const category = data[cat.key as keyof typeof data] as {
                    count: number;
                    tenure: string;
                    avgComp: string;
                    notes: string;
                    excludeFromEsop?: string;
                    cbaRestrictions?: string;
                    topHeavyRisk?: string;
                  };
                  return (
                    <tr key={cat.key}>
                      <td>{cat.label}</td>
                      <td>
                        <input
                          type="number"
                          value={category.count || ""}
                          onChange={(e) =>
                            updateEmployeeCategory(cat.key as keyof typeof data, {
                              count: Number(e.target.value),
                            })
                          }
                          placeholder="#"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={category.tenure}
                          onChange={(e) =>
                            updateEmployeeCategory(cat.key as keyof typeof data, {
                              tenure: e.target.value,
                            })
                          }
                          placeholder="yrs"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={category.avgComp}
                          onChange={(e) =>
                            updateEmployeeCategory(cat.key as keyof typeof data, {
                              avgComp: e.target.value,
                            })
                          }
                          placeholder="$"
                          className="dfs-input dfs-table-input"
                        />
                      </td>
                      <td>
                        {"excludeFromEsop" in category ? (
                          <div className="dfs-inline-row">
                            <span>Exclude from ESOP?</span>
                            <label className="dfs-radio-inline">
                              <input
                                type="radio"
                                name={`${cat.key}_exclude`}
                                checked={category.excludeFromEsop === "Yes"}
                                onChange={() =>
                                  updateEmployeeCategory(cat.key as keyof typeof data, {
                                    excludeFromEsop: "Yes",
                                  })
                                }
                              />
                              <span>Yes</span>
                            </label>
                            <label className="dfs-radio-inline">
                              <input
                                type="radio"
                                name={`${cat.key}_exclude`}
                                checked={category.excludeFromEsop === "No"}
                                onChange={() =>
                                  updateEmployeeCategory(cat.key as keyof typeof data, {
                                    excludeFromEsop: "No",
                                  })
                                }
                              />
                              <span>No</span>
                            </label>
                          </div>
                        ) : "cbaRestrictions" in category ? (
                          <input
                            type="text"
                            value={category.cbaRestrictions}
                            onChange={(e) =>
                              updateEmployeeCategory(cat.key as keyof typeof data, {
                                cbaRestrictions: e.target.value,
                              })
                            }
                            placeholder="CBA restrictions..."
                            className="dfs-input dfs-table-input"
                          />
                        ) : "topHeavyRisk" in category ? (
                          <input
                            type="text"
                            value={category.topHeavyRisk}
                            onChange={(e) =>
                              updateEmployeeCategory(cat.key as keyof typeof data, {
                                topHeavyRisk: e.target.value,
                              })
                            }
                            placeholder="Top-heavy risk? HCE count..."
                            className="dfs-input dfs-table-input"
                          />
                        ) : (
                          <input
                            type="text"
                            value={category.notes}
                            onChange={(e) =>
                              updateEmployeeCategory(cat.key as keyof typeof data, {
                                notes: e.target.value,
                              })
                            }
                            placeholder="Notes..."
                            className="dfs-input dfs-table-input"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="dfs-grid dfs-grid-3" style={{ marginTop: "14px" }}>
            <SelectInput
              label="Key Employee Risk?"
              value={data.keyEmployeeRisk}
              onChange={(v) => updateEmployeePopulation({ keyEmployeeRisk: v as typeof data.keyEmployeeRisk })}
              options={YES_NO_OPTIONS}
            />
            <div className="dfs-field">
              <label className="dfs-label">Non-Compete Status</label>
              <input
                type="text"
                value={data.nonCompeteStatus}
                onChange={(e) =>
                  updateEmployeePopulation({ nonCompeteStatus: e.target.value })
                }
                placeholder="In place / Needed / N/A"
                className="dfs-input"
              />
            </div>
            <SelectInput
              label="Key Person Insurance"
              value={data.keyPersonInsurance}
              onChange={(v) =>
                updateEmployeePopulation({ keyPersonInsurance: v as typeof data.keyPersonInsurance })
              }
              options={KEY_PERSON_INS_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
