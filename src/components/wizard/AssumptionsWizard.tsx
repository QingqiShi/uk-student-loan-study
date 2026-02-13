"use client";

import { useReducer } from "react";
import { LivePreview } from "./LivePreview";
import { SalaryGrowthStep } from "./SalaryGrowthStep";
import { ThresholdGrowthStep } from "./ThresholdGrowthStep";
import {
  createWizardReducer,
  ASSUMPTIONS_STEP_ORDER,
  initialAssumptionsWizardState,
} from "./wizardReducer";
import type { AssumptionsWizardStep } from "./wizardReducer";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { trackWizardStepViewed, trackWizardBackClicked } from "@/lib/analytics";

const assumptionsReducer = createWizardReducer(
  ASSUMPTIONS_STEP_ORDER,
  initialAssumptionsWizardState,
);

interface AssumptionsWizardProps {
  onComplete: () => void;
  onClose: () => void;
  entryStep?: AssumptionsWizardStep;
}

export function AssumptionsWizard({
  onComplete,
  onClose,
  entryStep,
}: AssumptionsWizardProps) {
  const [state, dispatch] = useReducer(
    assumptionsReducer,
    entryStep
      ? { currentStep: entryStep, direction: "forward" as const }
      : initialAssumptionsWizardState,
  );

  const { currentStep, direction } = state;
  const stepIndex = ASSUMPTIONS_STEP_ORDER.indexOf(currentStep);

  function goToStep(step: AssumptionsWizardStep) {
    trackWizardStepViewed("assumptions", step);
    dispatch({ type: "GO_TO_STEP", step });
  }

  function goBack() {
    trackWizardBackClicked("assumptions", currentStep);
    dispatch({ type: "GO_BACK" });
  }

  const canGoBack = currentStep !== "salary-growth";

  function renderStep() {
    switch (currentStep) {
      case "salary-growth":
        return (
          <SalaryGrowthStep
            direction={direction}
            onNext={() => {
              goToStep("threshold-growth");
            }}
          />
        );
      case "threshold-growth":
        return (
          <ThresholdGrowthStep direction={direction} onComplete={onComplete} />
        );
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <QuizProgress
        currentStep={stepIndex}
        totalSteps={ASSUMPTIONS_STEP_ORDER.length}
        onBack={canGoBack ? goBack : undefined}
        onClose={onClose}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">{renderStep()}</div>
      </main>

      <LivePreview />
    </div>
  );
}
