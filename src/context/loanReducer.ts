import type { LoanState } from "@/types/store";

export const initialState: LoanState = {
  underGradPlanType: "PLAN_2",
  underGradBalance: 50_000,
  postGradBalance: 0,
  repaymentDate: new Date(),
  salary: 70_000,
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

export type LoanAction = UpdateFieldAction | ResetAction;

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

// Reducer
export function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return { ...initialState, repaymentDate: new Date() };
    default:
      return state;
  }
}
