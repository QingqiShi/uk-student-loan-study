import { describe, it, expect } from "vitest";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  resetAction,
  applyPresetAction,
} from "./loanReducer";
import { PRESETS } from "@/lib/presets";

describe("loanReducer", () => {
  describe("initial state", () => {
    it("should have correct initial values", () => {
      expect(initialState.loans).toEqual([
        { planType: "PLAN_2", balance: 45_000 },
      ]);
      expect(initialState.salary).toBe(40_000);
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
  });

  describe("RESET action", () => {
    it("should reset all fields to initial values", () => {
      // Start with modified state
      let state = loanReducer(
        initialState,
        updateFieldAction("loans", [
          { planType: "PLAN_5", balance: 100_000 },
          { planType: "POSTGRADUATE", balance: 30_000 },
        ]),
      );
      state = loanReducer(state, updateFieldAction("salary", 60_000));

      // Reset
      const resetState = loanReducer(state, resetAction());

      // Verify all fields are back to initial values
      expect(resetState.loans).toEqual([
        { planType: "PLAN_2", balance: 45_000 },
      ]);
      expect(resetState.salary).toBe(40_000);
    });
  });
});
