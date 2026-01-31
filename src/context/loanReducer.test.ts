import { describe, it, expect } from "vitest";
import {
  loanReducer,
  initialState,
  updateFieldAction,
  resetAction,
} from "./loanReducer";

describe("loanReducer", () => {
  describe("initial state", () => {
    it("should have correct initial values", () => {
      expect(initialState.underGradPlanType).toBe("PLAN_2");
      expect(initialState.underGradBalance).toBe(45_000); // "2012-23 Grad" preset
      expect(initialState.postGradBalance).toBe(0);
      expect(initialState.salary).toBe(70_000);
      expect(initialState.repaymentDate).toBeInstanceOf(Date);
    });
  });

  describe("UPDATE_FIELD action", () => {
    it("should update underGradBalance", () => {
      const action = updateFieldAction("underGradBalance", 75_000);
      const newState = loanReducer(initialState, action);
      expect(newState.underGradBalance).toBe(75_000);
    });

    it("should update postGradBalance", () => {
      const action = updateFieldAction("postGradBalance", 25_000);
      const newState = loanReducer(initialState, action);
      expect(newState.postGradBalance).toBe(25_000);
    });

    it("should update underGradPlanType", () => {
      const action = updateFieldAction("underGradPlanType", "PLAN_5");
      const newState = loanReducer(initialState, action);
      expect(newState.underGradPlanType).toBe("PLAN_5");
    });

    it("should update to different plan types", () => {
      const action1 = updateFieldAction("underGradPlanType", "PLAN_1");
      const state1 = loanReducer(initialState, action1);
      expect(state1.underGradPlanType).toBe("PLAN_1");

      const action2 = updateFieldAction("underGradPlanType", "PLAN_4");
      const state2 = loanReducer(state1, action2);
      expect(state2.underGradPlanType).toBe("PLAN_4");
    });

    it("should update salary", () => {
      const action = updateFieldAction("salary", 45_000);
      const newState = loanReducer(initialState, action);
      expect(newState.salary).toBe(45_000);
    });

    it("should update repaymentDate", () => {
      const date = new Date("2020-04-01");
      const action = updateFieldAction("repaymentDate", date);
      const newState = loanReducer(initialState, action);
      expect(newState.repaymentDate).toEqual(date);
    });

    it("should allow setting repaymentDate to null", () => {
      const action = updateFieldAction("repaymentDate", null);
      const newState = loanReducer(initialState, action);
      expect(newState.repaymentDate).toBeNull();
    });

    it("should not mutate the original state", () => {
      const originalState = { ...initialState };
      const action = updateFieldAction("salary", 100_000);
      loanReducer(initialState, action);
      expect(initialState.salary).toBe(originalState.salary);
    });
  });

  describe("RESET action", () => {
    it("should reset all fields to initial values", () => {
      // Start with modified state
      let state = loanReducer(
        initialState,
        updateFieldAction("underGradBalance", 100_000),
      );
      state = loanReducer(state, updateFieldAction("postGradBalance", 30_000));
      state = loanReducer(
        state,
        updateFieldAction("underGradPlanType", "PLAN_5"),
      );
      state = loanReducer(state, updateFieldAction("salary", 60_000));

      // Reset
      const resetState = loanReducer(state, resetAction());

      // Verify all fields are back to initial values
      expect(resetState.underGradBalance).toBe(45_000); // "2012-23 Grad" preset
      expect(resetState.postGradBalance).toBe(0);
      expect(resetState.underGradPlanType).toBe("PLAN_2");
      expect(resetState.salary).toBe(70_000);
    });

    it("should create a new repaymentDate on reset", () => {
      const action = resetAction();
      const newState = loanReducer(initialState, action);
      expect(newState.repaymentDate).toBeInstanceOf(Date);
    });
  });
});
