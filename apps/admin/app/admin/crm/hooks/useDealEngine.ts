import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import { api as gatesApi } from "@/convex/_generated/api";

// ============================================
// Deal Engine Hook
// ============================================

export function useDealEngine(companyId: Id<"crmCompanies"> | null) {
  // Mutations
  const initializeDeal = useMutation(api.dealEngine.initializeDeal);
  const setGate = useMutation(gatesApi.gates.setGate);
  const updateFee = useMutation(api.dealEngine.updateFee);
  const wireTriggers = useMutation(api.dealEngine.wireTriggers);

  // Initialize a deal on a company
  const initialize = useCallback(
    async (ebitda: number, ref: string) => {
      if (!companyId) throw new Error("No company selected");
      return await initializeDeal({ companyId, ebitda, ref });
    },
    [companyId, initializeDeal]
  );

  // Mark a gate as passed
  const passGate = useCallback(
    async (gateName: "gate1" | "gate2" | "gate3" | "gate4") => {
      if (!companyId) throw new Error("No company selected");
      return await setGate({ companyId, gateName });
    },
    [companyId, setGate]
  );

  // Update fee status
  const markFeeStatus = useCallback(
    async (
      milestone: "retainer" | "validation" | "commitment" | "success",
      status: "pending" | "invoiced" | "paid"
    ) => {
      if (!companyId) throw new Error("No company selected");
      return await updateFee({ companyId, milestone, status });
    },
    [companyId, updateFee]
  );

  // Wire triggers for a stage change or gate pass
  const trigger = useCallback(
    async (args: {
      event: "stage_change" | "gate_pass" | "time_check" | "post_close";
      previousStage?: string;
      newStage?: string;
      gateName?: "gate1" | "gate2" | "gate3" | "gate4";
    }) => {
      if (!companyId) throw new Error("No company selected");
      return await wireTriggers({ companyId, ...args });
    },
    [companyId, wireTriggers]
  );

  return {
    initialize,
    passGate,
    markFeeStatus,
    trigger,
  };
}
