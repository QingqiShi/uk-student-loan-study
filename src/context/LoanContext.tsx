"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  applyPresetAction,
} from "./loanReducer";
import type { Preset } from "@/lib/presets";
import type { LoanState } from "@/types/store";

interface LoanContextValue {
  state: LoanState;
  updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => void;
  applyPreset: (preset: Preset) => void;
}

const LoanContext = createContext<LoanContextValue | null>(null);

interface LoanProviderProps {
  children: ReactNode;
}

export function LoanProvider({ children }: LoanProviderProps) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const updateField = <K extends keyof LoanState>(
    key: K,
    value: LoanState[K],
  ) => {
    dispatch(updateFieldAction(key, value));
  };

  const applyPreset = (preset: Preset) => {
    dispatch(applyPresetAction(preset));
  };

  return (
    <LoanContext.Provider value={{ state, updateField, applyPreset }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoanContext(): LoanContextValue {
  const context = useContext(LoanContext);
  if (context === null) {
    throw new Error("useLoanContext must be used within a LoanProvider");
  }
  return context;
}
