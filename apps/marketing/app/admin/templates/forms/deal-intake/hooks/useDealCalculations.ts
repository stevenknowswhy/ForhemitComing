"use client";

import { useMemo } from "react";
import { DealInputs, CalculatedValues, DSCRResult } from "../types";
import { calculateValues, calculateDSCR } from "../lib/calculations";

export interface UseDealCalculationsResult {
  calculated: CalculatedValues;
  dscr: DSCRResult;
  activeEbitda: number;
}

/**
 * Hook to calculate all deal intake form derived values
 * Memoized to prevent recalculation unless inputs change
 */
export function useDealCalculations(
  inputs: DealInputs
): UseDealCalculationsResult {
  return useMemo(() => {
    const calculated = calculateValues(inputs);
    const activeEbitda =
      inputs.dscr.scenario === "B"
        ? inputs.dscr.ebitdaB || inputs.financial.ebitda
        : inputs.financial.ebitda;
    const dscr = calculateDSCR(inputs, activeEbitda);

    return {
      calculated,
      dscr,
      activeEbitda,
    };
  }, [inputs]);
}
