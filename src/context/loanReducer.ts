import type { LoanState } from "@/types/store";
import { DEFAULT_PRESET, type Preset } from "@/lib/presets";

export const initialState: LoanState = {
  underGradPlanType: DEFAULT_PRESET.underGradPlanType,
  underGradBalance: DEFAULT_PRESET.underGradBalance,
  postGradBalance: DEFAULT_PRESET.postGradBalance,
  salary: 65_000,

  // Overpay analysis defaults
  monthlyOverpayment: 0,
  salaryGrowthRate: "none",
  lumpSumPayment: 10_000,
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
        underGradBalance: action.preset.underGradBalance,
        postGradBalance: action.preset.postGradBalance,
        underGradPlanType: action.preset.underGradPlanType,
      };
    default:
      return state;
  }
}
