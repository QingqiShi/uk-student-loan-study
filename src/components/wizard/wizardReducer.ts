export type AssumptionsWizardStep = "salary-growth" | "threshold-growth";

type WizardDirection = "forward" | "backward";

export interface WizardState<S extends string = AssumptionsWizardStep> {
  currentStep: S;
  direction: WizardDirection;
}

type WizardAction<S extends string = AssumptionsWizardStep> =
  | { type: "GO_TO_STEP"; step: S; direction?: WizardDirection }
  | { type: "GO_BACK" }
  | { type: "RESTART" };

export const ASSUMPTIONS_STEP_ORDER: AssumptionsWizardStep[] = [
  "salary-growth",
  "threshold-growth",
];

function getPreviousStep<S extends string>(
  current: S,
  stepOrder: S[],
): S | undefined {
  const index = stepOrder.indexOf(current);
  return index > 0 ? stepOrder[index - 1] : undefined;
}

export const initialAssumptionsWizardState: WizardState = {
  currentStep: "salary-growth",
  direction: "forward",
};

export function createWizardReducer<S extends string>(
  stepOrder: S[],
  initialState: WizardState<S>,
) {
  return function wizardReducer(
    state: WizardState<S>,
    action: WizardAction<S>,
  ): WizardState<S> {
    switch (action.type) {
      case "GO_TO_STEP":
        return {
          currentStep: action.step,
          direction: action.direction ?? "forward",
        };
      case "GO_BACK": {
        const prev = getPreviousStep(state.currentStep, stepOrder);
        if (!prev) return state;
        return { currentStep: prev, direction: "backward" };
      }
      case "RESTART":
        return initialState;
    }
  };
}
