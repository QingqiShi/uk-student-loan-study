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

      expect(state.isPost2023).toBe(false);
      expect(state.underGradBalance).toBe(50_000);
      expect(state.postGradBalance).toBe(0);
      expect(state.plan2LTRate).toBe(6.5);
      expect(state.plan2UTRate).toBe(6.5);
      expect(state.plan5Rate).toBe(6.5);
      expect(state.postGradRate).toBe(6.5);
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

    it("should update isPost2023", () => {
      useStore.getState().updateField("isPost2023", true);
      expect(useStore.getState().isPost2023).toBe(true);
    });

    it("should update plan2LTRate", () => {
      useStore.getState().updateField("plan2LTRate", 7.5);
      expect(useStore.getState().plan2LTRate).toBe(7.5);
    });

    it("should update plan2UTRate", () => {
      useStore.getState().updateField("plan2UTRate", 8.0);
      expect(useStore.getState().plan2UTRate).toBe(8.0);
    });

    it("should update plan5Rate", () => {
      useStore.getState().updateField("plan5Rate", 5.5);
      expect(useStore.getState().plan5Rate).toBe(5.5);
    });

    it("should update postGradRate", () => {
      useStore.getState().updateField("postGradRate", 7.0);
      expect(useStore.getState().postGradRate).toBe(7.0);
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
      store.updateField("isPost2023", true);
      store.updateField("salary", 60_000);
      store.updateField("plan2LTRate", 10);

      // Reset
      useStore.getState().reset();

      // Verify all fields are back to initial values
      const resetState = useStore.getState();
      expect(resetState.underGradBalance).toBe(50_000);
      expect(resetState.postGradBalance).toBe(0);
      expect(resetState.isPost2023).toBe(false);
      expect(resetState.salary).toBe(70_000);
      expect(resetState.plan2LTRate).toBe(6.5);
    });
  });
});
