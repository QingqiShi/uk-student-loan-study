import { describe, it, expect } from "vitest";
import {
  ALL_ASSUMPTIONS_STEPS,
  createWizardReducer,
  getNextStep,
  isLastStep,
  type AssumptionsWizardStep,
  type WizardState,
} from "./wizardReducer";

describe("getNextStep", () => {
  it("returns the next step in the order", () => {
    expect(getNextStep("salary-growth", ALL_ASSUMPTIONS_STEPS)).toBe(
      "threshold-growth",
    );
    expect(getNextStep("threshold-growth", ALL_ASSUMPTIONS_STEPS)).toBe("rpi");
    expect(getNextStep("rpi", ALL_ASSUMPTIONS_STEPS)).toBe("boe-base-rate");
  });

  it("returns undefined when on the last step", () => {
    expect(getNextStep("boe-base-rate", ALL_ASSUMPTIONS_STEPS)).toBeUndefined();
  });

  it("works with filtered step orders", () => {
    const filtered: AssumptionsWizardStep[] = [
      "salary-growth",
      "threshold-growth",
      "rpi",
    ];
    expect(getNextStep("salary-growth", filtered)).toBe("threshold-growth");
    expect(getNextStep("rpi", filtered)).toBeUndefined();
  });
});

describe("isLastStep", () => {
  it("returns true for the last step", () => {
    expect(isLastStep("boe-base-rate", ALL_ASSUMPTIONS_STEPS)).toBe(true);
  });

  it("returns false for non-last steps", () => {
    expect(isLastStep("salary-growth", ALL_ASSUMPTIONS_STEPS)).toBe(false);
    expect(isLastStep("threshold-growth", ALL_ASSUMPTIONS_STEPS)).toBe(false);
    expect(isLastStep("rpi", ALL_ASSUMPTIONS_STEPS)).toBe(false);
  });
});

describe("createWizardReducer", () => {
  const initialState: WizardState = {
    currentStep: "salary-growth",
    direction: "forward",
  };
  const reducer = createWizardReducer(ALL_ASSUMPTIONS_STEPS, initialState);

  it("GO_TO_STEP sets currentStep and defaults direction to forward", () => {
    const result = reducer(initialState, {
      type: "GO_TO_STEP",
      step: "rpi",
    });
    expect(result).toEqual({ currentStep: "rpi", direction: "forward" });
  });

  it("GO_TO_STEP with explicit direction backward respects it", () => {
    const result = reducer(initialState, {
      type: "GO_TO_STEP",
      step: "threshold-growth",
      direction: "backward",
    });
    expect(result).toEqual({
      currentStep: "threshold-growth",
      direction: "backward",
    });
  });

  it("GO_BACK moves to previous step with direction backward", () => {
    const state: WizardState = {
      currentStep: "threshold-growth",
      direction: "forward",
    };
    const result = reducer(state, { type: "GO_BACK" });
    expect(result).toEqual({
      currentStep: "salary-growth",
      direction: "backward",
    });
  });

  it("GO_BACK at first step returns same state (no-op)", () => {
    const result = reducer(initialState, { type: "GO_BACK" });
    expect(result).toBe(initialState);
  });

  it("RESTART returns the initial state", () => {
    const state: WizardState = {
      currentStep: "boe-base-rate",
      direction: "forward",
    };
    const result = reducer(state, { type: "RESTART" });
    expect(result).toBe(initialState);
  });
});

describe("ALL_ASSUMPTIONS_STEPS", () => {
  it("contains exactly the four expected steps in order", () => {
    expect(ALL_ASSUMPTIONS_STEPS).toEqual([
      "salary-growth",
      "threshold-growth",
      "rpi",
      "boe-base-rate",
    ]);
  });
});

describe("step filtering scenario", () => {
  const filteredSteps: AssumptionsWizardStep[] = [
    "salary-growth",
    "threshold-growth",
    "rpi",
  ];
  const initialState: WizardState = {
    currentStep: "salary-growth",
    direction: "forward",
  };
  const reducer = createWizardReducer(filteredSteps, initialState);

  it("GO_BACK from rpi goes to threshold-growth", () => {
    const state: WizardState = {
      currentStep: "rpi",
      direction: "forward",
    };
    const result = reducer(state, { type: "GO_BACK" });
    expect(result).toEqual({
      currentStep: "threshold-growth",
      direction: "backward",
    });
  });

  it("getNextStep from rpi returns undefined (last step in filtered order)", () => {
    expect(getNextStep("rpi", filteredSteps)).toBeUndefined();
  });
});
