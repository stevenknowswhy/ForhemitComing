"use client";

import { useMemo } from "react";
import { UserInputs, Scenarios } from "../types";
import { calculateScenarios } from "../lib/calculations";

/**
 * Hook to calculate ESOP term sheet scenarios
 * Memoized to prevent recalculation unless inputs change
 */
export function useTermSheetCalculations(inputs: UserInputs): Scenarios {
  return useMemo(() => calculateScenarios(inputs), [inputs]);
}
