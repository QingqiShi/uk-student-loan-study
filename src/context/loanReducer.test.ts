import { describe, it, expect } from "vitest";
import { CURRENT_RATES } from "@/lib/loans/plans";
import { PRESETS } from "@/lib/presets";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  applyPresetAction,
} from "./loanReducer";

describe("loanReducer", () => {
  describe("initial state", () => {
    it("should have correct initial values", () => {
      expect(initialState.loans).toEqual([
        { planType: "PLAN_2", balance: 45_000 },
      ]);
      expect(initialState.salary).toBe(45_000);
    });

    it("should have rpiRate equal to CURRENT_RATES.rpi", () => {
      expect(initialState.rpiRate).toBe(CURRENT_RATES.rpi);
    });

    it("should have boeBaseRate equal to CURRENT_RATES.boeBaseRate", () => {
      expect(initialState.boeBaseRate).toBe(CURRENT_RATES.boeBaseRate);
    });
  });

  describe("present value initial state", () => {
    it("should have showPresentValue false", () => {
      expect(initialState.showPresentValue).toBe(false);
    });

    it("should have discountRate derived from CURRENT_RATES.cpi", () => {
      expect(initialState.discountRate).toBe(CURRENT_RATES.cpi / 100);
    });
  });

  describe("UPDATE_FIELD action", () => {
    it("should update loans", () => {
      const newLoans = [{ planType: "PLAN_5" as const, balance: 50_000 }];
      const action = updateFieldAction("loans", newLoans);
      const newState = loanReducer(initialState, action);
      expect(newState.loans).toEqual(newLoans);
    });

    it("should update salary", () => {
      const action = updateFieldAction("salary", 45_000);
      const newState = loanReducer(initialState, action);
      expect(newState.salary).toBe(45_000);
    });

    it("should update rpiRate", () => {
      const action = updateFieldAction("rpiRate", 5.0);
      const newState = loanReducer(initialState, action);
      expect(newState.rpiRate).toBe(5.0);
    });

    it("should update boeBaseRate", () => {
      const action = updateFieldAction("boeBaseRate", 4.5);
      const newState = loanReducer(initialState, action);
      expect(newState.boeBaseRate).toBe(4.5);
    });

    it("should update showPresentValue", () => {
      const action = updateFieldAction("showPresentValue", true);
      const newState = loanReducer(initialState, action);
      expect(newState.showPresentValue).toBe(true);
    });

    it("should update discountRate", () => {
      const action = updateFieldAction("discountRate", 0.05);
      const newState = loanReducer(initialState, action);
      expect(newState.discountRate).toBe(0.05);
    });

    it("should not mutate the original state", () => {
      const originalLoans = [...initialState.loans];
      const action = updateFieldAction("salary", 100_000);
      loanReducer(initialState, action);
      expect(initialState.loans).toEqual(originalLoans);
    });
  });

  describe("APPLY_PRESET action", () => {
    it("should apply preset loans", () => {
      const comboPreset = PRESETS.find((p) => p.id === "ug-pg-combo");
      expect(comboPreset).toBeDefined();
      const action = applyPresetAction(comboPreset as (typeof PRESETS)[number]);
      const newState = loanReducer(initialState, action);
      expect(newState.loans).toEqual([
        { planType: "PLAN_2", balance: 45_000 },
        { planType: "POSTGRADUATE", balance: 12_000 },
      ]);
    });

    it("should preserve non-loan fields when applying preset", () => {
      const modified = loanReducer(
        initialState,
        updateFieldAction("salary", 80_000),
      );
      const preset = PRESETS.find((p) => p.id === "plan5-grad");
      expect(preset).toBeDefined();
      const newState = loanReducer(
        modified,
        applyPresetAction(preset as (typeof PRESETS)[number]),
      );
      expect(newState.salary).toBe(80_000);
      expect(newState.loans).toEqual([{ planType: "PLAN_5", balance: 50_000 }]);
    });

    it("should preserve custom rpiRate and boeBaseRate when applying preset", () => {
      let state = loanReducer(initialState, updateFieldAction("rpiRate", 6.0));
      state = loanReducer(state, updateFieldAction("boeBaseRate", 5.5));

      const preset = PRESETS.find((p) => p.id === "plan5-grad");
      expect(preset).toBeDefined();
      const newState = loanReducer(
        state,
        applyPresetAction(preset as (typeof PRESETS)[number]),
      );
      expect(newState.rpiRate).toBe(6.0);
      expect(newState.boeBaseRate).toBe(5.5);
    });
  });
});
