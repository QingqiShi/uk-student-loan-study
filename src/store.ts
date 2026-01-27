import { create } from "zustand";
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
  salary: 35_000,
};

export const useStore = create<LoanStore>()(
  immer((set) => ({
    ...initialState,
    updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) =>
      set((state) => {
        (state as LoanState)[key] = value;
      }),
    reset: () => set(() => ({ ...initialState })),
  })),
);
