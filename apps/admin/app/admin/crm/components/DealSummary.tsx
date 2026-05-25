"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Company } from "../types";
import { useDealEngine } from "../hooks/useDealEngine";

// ============================================
// Deal Summary Component
// ============================================

interface DealSummaryProps {
  company: Company;
}

export function DealSummary({ company }: DealSummaryProps) {
  const { initialize, passGate, markFeeStatus } = useDealEngine(company._id);
  const [initModalOpen, setInitModalOpen] = useState(false);
  const [ebitdaInput, setEbitdaInput] = useState("");
  const [refInput, setRefInput] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFees = company.fees != null;

  // Initialize deal handler
  const handleInitialize = async () => {
    if (!ebitdaInput || !refInput) return;
    setLoading(true);
    try {
      const ebitda = parseFloat(ebitdaInput);
      await initialize(ebitda, refInput);
      setInitModalOpen(false);
      setEbitdaInput("");
      setRefInput("");
    } catch (err) {
      console.error("Failed to initialize deal:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gate pass handler
  const handleGatePass = async (gateName: "gate1" | "gate2" | "gate3" | "gate4") => {
    setLoading(true);
    try {
      await passGate(gateName);
    } catch (err) {
      console.error("Failed to pass gate:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fee status update handler
  const handleFeeUpdate = async (
    milestone: "retainer" | "validation" | "commitment" | "success",
    status: "pending" | "invoiced" | "paid"
  ) => {
    setLoading(true);
    try {
      await markFeeStatus(milestone, status);
    } catch (err) {
      console.error("Failed to update fee:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gate labels
  const gateLabels: Record<string, string> = {
    gate1: "Gate 1: Feasibility",
    gate2: "Gate 2: Valuation",
    gate3: "Gate 3: Legal",
    gate4: "Gate 4: Funding",
  };

  // Fee milestone labels
  const feeLabels: Record<string, string> = {
    retainer: "Retainer",
    validation: "Validation",
    commitment: "Commitment",
    success: "Success",
  };

  // Fee milestone → gate mapping
  const feeToGate: Record<string, string> = {
    validation: "gate1",
    commitment: "gate2",
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      invoiced: { bg: "bg-blue-500/20", text: "text-blue-400" },
      paid: { bg: "bg-green-500/20", text: "text-green-400" },
    };
    const style = colors[status] || colors.pending;
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="mb-7">
      <h3 className="flex items-center justify-between text-[9px] uppercase tracking-[2px] text-[var(--text3)] mb-3 pb-2 border-b border-[var(--border)]">
        Deal Engine
      </h3>

      {!hasFees ? (
        /* No deal initialized — show Initialize button */
        <div>
          <button
            onClick={() => setInitModalOpen(true)}
            className="w-full px-4 py-3 bg-[var(--brass)]/10 border border-[var(--brass)]/30 rounded-lg text-[var(--brass)] text-[13px] font-medium hover:bg-[var(--brass)]/20 transition-colors"
          >
            + Initialize Deal
          </button>

          {/* Initialize Modal */}
          {initModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setInitModalOpen(false)}>
              <div className="bg-[var(--surface)] rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Initialize Deal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] block mb-1.5">
                      EBITDA ($)
                    </label>
                    <input
                      type="number"
                      value={ebitdaInput}
                      onChange={(e) => setEbitdaInput(e.target.value)}
                      placeholder="5000000"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] block mb-1.5">
                      Deal Reference
                    </label>
                    <input
                      type="text"
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      placeholder="FH-2026-001"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={() => setInitModalOpen(false)} className="flex-1 btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={handleInitialize}
                    disabled={!ebitdaInput || !refInput || loading}
                    className="flex-1 btn btn-primary disabled:opacity-50"
                  >
                    {loading ? "Initializing..." : "Initialize"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Deal initialized — show summary */
        <div className="space-y-5">
          {/* Deal Ref + Tier + Total */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">Ref</div>
              <div className="text-[13px] font-medium text-[var(--text)]">{company.ref || "—"}</div>
            </div>
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">Tier</div>
              <div className="text-[13px] font-medium text-[var(--text)]">Tier {company.fees?.tier || "—"}</div>
            </div>
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">Total Fee</div>
              <div className="text-[13px] font-medium text-[var(--text)]">
                {company.fees?.totalFee ? formatCurrency(company.fees.totalFee) : "—"}
              </div>
            </div>
          </div>

          {/* EBITDA */}
          <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
            <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">EBITDA</div>
            <div className="text-[13px] font-medium text-[var(--text)]">
              {company.fees?.ebitda ? formatCurrency(company.fees.ebitda) : "—"}
            </div>
          </div>

          {/* Gates */}
          {company.gates && (
            <div>
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-2">Gates</div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(gateLabels) as Array<keyof typeof gateLabels>).map((gateKey) => {
                  const gate = company.gates?.[gateKey as keyof typeof company.gates];
                  const passed = gate?.passed ?? false;
                  return (
                    <button
                      key={gateKey}
                      onClick={() => !passed && handleGatePass(gateKey as "gate1" | "gate2" | "gate3" | "gate4")}
                      disabled={passed || loading}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium border transition-colors ${
                        passed
                          ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-default"
                          : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text2)] hover:border-[var(--brass)] hover:bg-[var(--brass)]/10"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        passed ? "bg-green-500 text-white" : "border border-[var(--text3)]"
                      }`}>
                        {passed ? "✓" : ""}
                      </span>
                      {gateLabels[gateKey]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fee Milestones */}
          {company.fees && (
            <div>
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-2">Fee Milestones</div>
              <div className="space-y-2">
                {(["retainer", "validation", "commitment", "success"] as const).map((milestone) => {
                  const fee = company.fees?.[milestone];
                  if (!fee) return null;
                  return (
                    <div key={milestone} className="flex items-center justify-between bg-[var(--surface2)] border border-[var(--border)] rounded-md px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[var(--text)]">
                          {feeLabels[milestone]}
                        </span>
                        <span className="text-[11px] text-[var(--text3)]">
                          {formatCurrency(fee.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={fee.status} />
                        <select
                          value={fee.status}
                          onChange={(e) => handleFeeUpdate(
                            milestone,
                            e.target.value as "pending" | "invoiced" | "paid"
                          )}
                          disabled={loading}
                          className="text-[10px] bg-[var(--surface)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--text2)]"
                        >
                          <option value="pending">Pending</option>
                          <option value="invoiced">Invoiced</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stewardship */}
          {company.fees?.stewardshipAnnual != null && company.fees.stewardshipAnnual > 0 && (
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">Stewardship (Annual)</div>
              <div className="text-[13px] font-medium text-[var(--text)]">
                {formatCurrency(company.fees.stewardshipAnnual)}
              </div>
            </div>
          )}

          {/* Expected Close Date */}
          {company.expectedCloseDate && (
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] mb-1">Expected Close Date</div>
              <div className="text-[13px] font-medium text-[var(--text)]">{company.expectedCloseDate}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
