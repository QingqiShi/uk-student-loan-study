import type { LoanState } from "@/types/store";
import { DEFAULT_SALARY } from "@/constants";
import { CURRENT_RATES } from "@/lib/loans/plans";
import { DEFAULT_PRESET, type Preset } from "@/lib/presets";

export const initialState: LoanState = {
  loans: DEFAULT_PRESET.loans,
  salary: DEFAULT_SALARY,

  // Overpay analysis defaults
  monthlyOverpayment: 0,
  salaryGrowthRate: 0.04, // 4% - typical career progression
  thresholdGrowthRate: 0, // 0% - frozen thresholds (current policy)
  rpiRate: CURRENT_RATES.rpi, // 3.2% - Sept 2025–Aug 2026
  boeBaseRate: CURRENT_RATES.boeBaseRate, // 3.75% - Feb 2026 MPC
  lumpSumPayment: 10_000,

  showPresentValue: false,
  discountRate: 0.02, // 2% - CPI target

  pendingQuizPlanTypes: null,
};

// Action types
type UpdateFieldAction<K extends keyof LoanState = keyof LoanState> = {
  type: "UPDATE_FIELD";
  key: K;
  value: LoanState[K];
};

type ResetAction = {
  type: "RESET";
};

type ApplyPresetAction = {
  type: "APPLY_PRESET";
  preset: Preset;
};

export type LoanAction = UpdateFieldAction | ResetAction | ApplyPresetAction;

// Action creators
export function updateFieldAction<K extends keyof LoanState>(
  key: K,
  value: LoanState[K],
): UpdateFieldAction<K> {
  return { type: "UPDATE_FIELD", key, value };
}

export function resetAction(): ResetAction {
  return { type: "RESET" };
}

export function applyPresetAction(preset: Preset): ApplyPresetAction {
  return { type: "APPLY_PRESET", preset };
}

// Reducer
export function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return initialState;
    case "APPLY_PRESET":
      return {
        ...state,
        loans: action.preset.loans,
      };
    default:
      return state;
  }
}
