import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "../store";

describe("useStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useStore.getState().reset();
  });

  describe("initial state", () => {
    it("should have correct initial values", () => {
      const state = useStore.getState();

      expect(state.underGradPlanType).toBe("PLAN_2");
      expect(state.underGradBalance).toBe(50_000);
      expect(state.postGradBalance).toBe(0);
      expect(state.salary).toBe(70_000);
      expect(state.repaymentDate).toBeInstanceOf(Date);
    });
  });

  describe("updateField", () => {
    it("should update underGradBalance", () => {
      useStore.getState().updateField("underGradBalance", 75_000);
      expect(useStore.getState().underGradBalance).toBe(75_000);
    });

    it("should update postGradBalance", () => {
      useStore.getState().updateField("postGradBalance", 25_000);
      expect(useStore.getState().postGradBalance).toBe(25_000);
    });

    it("should update underGradPlanType", () => {
      useStore.getState().updateField("underGradPlanType", "PLAN_5");
      expect(useStore.getState().underGradPlanType).toBe("PLAN_5");
    });

    it("should update to different plan types", () => {
      useStore.getState().updateField("underGradPlanType", "PLAN_1");
      expect(useStore.getState().underGradPlanType).toBe("PLAN_1");

      useStore.getState().updateField("underGradPlanType", "PLAN_4");
      expect(useStore.getState().underGradPlanType).toBe("PLAN_4");
    });

    it("should update salary", () => {
      useStore.getState().updateField("salary", 45_000);
      expect(useStore.getState().salary).toBe(45_000);
    });

    it("should update repaymentDate", () => {
      const date = new Date("2020-04-01");
      useStore.getState().updateField("repaymentDate", date);
      expect(useStore.getState().repaymentDate).toEqual(date);
    });

    it("should allow setting repaymentDate to null", () => {
      useStore.getState().updateField("repaymentDate", null);
      expect(useStore.getState().repaymentDate).toBeNull();
    });
  });

  describe("reset", () => {
    it("should reset all fields to initial values", () => {
      // Modify multiple fields
      const store = useStore.getState();
      store.updateField("underGradBalance", 100_000);
      store.updateField("postGradBalance", 30_000);
      store.updateField("underGradPlanType", "PLAN_5");
      store.updateField("salary", 60_000);

      // Reset
      useStore.getState().reset();

      // Verify all fields are back to initial values
      const resetState = useStore.getState();
      expect(resetState.underGradBalance).toBe(50_000);
      expect(resetState.postGradBalance).toBe(0);
      expect(resetState.underGradPlanType).toBe("PLAN_2");
      expect(resetState.salary).toBe(70_000);
    });
  });
});
