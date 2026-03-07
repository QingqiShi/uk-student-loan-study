"use client";

import { createContext, use, useReducer, type ReactNode } from "react";
import type { Loan, PlanType } from "@/lib/loans/types";
import type { Preset } from "@/lib/presets";
import type { LoanState } from "@/types/store";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  applyPresetAction,
} from "./loanReducer";

// --- Context types ---

interface LoanActionsValue {
  updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => void;
  applyPreset: (preset: Preset) => void;
}

interface LoanFrequentState {
  salary: number;
  monthlyOverpayment: number;
  lumpSumPayment: number;
}

interface LoanConfigState {
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  rpiRate: number;
  boeBaseRate: number;
  showPresentValue: boolean;
  discountRate: number;
  pendingQuizPlanTypes: PlanType[] | null;
}

// --- Contexts ---

const LoanActionsContext = createContext<LoanActionsValue | null>(null);
const LoanFrequentContext = createContext<LoanFrequentState | null>(null);
const LoanConfigContext = createContext<LoanConfigState | null>(null);

// --- Provider ---

interface LoanProviderProps {
  children: ReactNode;
  initialStateOverride?: Partial<LoanState>;
}

export function LoanProvider({
  children,
  initialStateOverride,
}: LoanProviderProps) {
  const [state, dispatch] = useReducer(
    loanReducer,
    initialStateOverride
      ? { ...initialState, ...initialStateOverride }
      : initialState,
  );

  const updateField = <K extends keyof LoanState>(
    key: K,
    value: LoanState[K],
  ) => {
    dispatch(updateFieldAction(key, value));
  };

  const applyPreset = (preset: Preset) => {
    dispatch(applyPresetAction(preset));
  };

  const actions: LoanActionsValue = { updateField, applyPreset };

  const frequent: LoanFrequentState = {
    salary: state.salary,
    monthlyOverpayment: state.monthlyOverpayment,
    lumpSumPayment: state.lumpSumPayment,
  };

  const config: LoanConfigState = {
    loans: state.loans,
    salaryGrowthRate: state.salaryGrowthRate,
    thresholdGrowthRate: state.thresholdGrowthRate,
    rpiRate: state.rpiRate,
    boeBaseRate: state.boeBaseRate,
    showPresentValue: state.showPresentValue,
    discountRate: state.discountRate,
    pendingQuizPlanTypes: state.pendingQuizPlanTypes,
  };

  return (
    <LoanActionsContext value={actions}>
      <LoanConfigContext value={config}>
        <LoanFrequentContext value={frequent}>{children}</LoanFrequentContext>
      </LoanConfigContext>
    </LoanActionsContext>
  );
}

// --- Hooks ---

export function useLoanActions(): LoanActionsValue {
  const context = use(LoanActionsContext);
  if (context === null) {
    throw new Error("useLoanActions must be used within a LoanProvider");
  }
  return context;
}

export function useLoanFrequentState(): LoanFrequentState {
  const context = use(LoanFrequentContext);
  if (context === null) {
    throw new Error("useLoanFrequentState must be used within a LoanProvider");
  }
  return context;
}

export function useLoanConfigState(): LoanConfigState {
  const context = use(LoanConfigContext);
  if (context === null) {
    throw new Error("useLoanConfigState must be used within a LoanProvider");
  }
  return context;
}

/** Convenience hook that combines all 3 contexts (for components that need everything) */
export function useLoanContext() {
  const actions = useLoanActions();
  const frequent = useLoanFrequentState();
  const config = useLoanConfigState();
  return {
    state: { ...config, ...frequent },
    ...actions,
  };
}
