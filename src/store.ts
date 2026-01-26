import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { LoanState, LoanStore } from "./types";

const initialState: LoanState = {
  isPost2023: false,
  underGradBalance: 50_000,
  postGradBalance: 0,
  plan2LTRate: 6.5,
  plan2UTRate: 6.5,
  plan5Rate: 6.5,
  postGradRate: 6.5,
  repaymentDate: new Date(),
  salary: 0,
};

// Custom storage to handle Date serialization/deserialization
const customStorage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const parsed = JSON.parse(str);
    // Revive Date objects
    if (
      parsed.state?.repaymentDate &&
      typeof parsed.state.repaymentDate === "string"
    ) {
      parsed.state.repaymentDate = new Date(parsed.state.repaymentDate);
    }
    return JSON.stringify(parsed);
  },
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

export const useStore = create<LoanStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) =>
        set((state) => {
          (state as LoanState)[key] = value;
        }),
      reset: () => set(() => ({ ...initialState })),
    })),
    {
      name: "loan-calculator-storage",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        isPost2023: state.isPost2023,
        underGradBalance: state.underGradBalance,
        postGradBalance: state.postGradBalance,
        plan2LTRate: state.plan2LTRate,
        plan2UTRate: state.plan2UTRate,
        plan5Rate: state.plan5Rate,
        postGradRate: state.postGradRate,
        repaymentDate: state.repaymentDate,
        salary: state.salary,
      }),
    },
  ),
);
