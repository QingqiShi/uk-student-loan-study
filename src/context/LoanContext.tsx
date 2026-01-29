"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type { LoanState } from "@/types/store";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  resetAction,
} from "./loanReducer";

interface LoanContextValue {
  state: LoanState;
  updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => void;
  reset: () => void;
}

const LoanContext = createContext<LoanContextValue | null>(null);

interface LoanProviderProps {
  children: ReactNode;
}

export function LoanProvider({ children }: LoanProviderProps) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const contextValue = useMemo<LoanContextValue>(
    () => ({
      state,
      updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => {
        dispatch(updateFieldAction(key, value));
      },
      reset: () => {
        dispatch(resetAction());
      },
    }),
    [state],
  );

  return (
    <LoanContext.Provider value={contextValue}>{children}</LoanContext.Provider>
  );
}

export function useLoanContext(): LoanContextValue {
  const context = useContext(LoanContext);
  if (context === null) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
}
