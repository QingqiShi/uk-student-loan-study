"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { useReducer } from "react";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { useLoanConfigState } from "@/context/LoanContext";
import { trackWizardStepViewed, trackWizardBackClicked } from "@/lib/analytics";
import { BoeBaseRateStep } from "./BoeBaseRateStep";
import { DiscountRateStep } from "./DiscountRateStep";
import { LivePreview } from "./LivePreview";
import { RpiStep } from "./RpiStep";
import { SalaryGrowthStep } from "./SalaryGrowthStep";
import { ThresholdGrowthStep } from "./ThresholdGrowthStep";
import {
  createWizardReducer,
  ALL_ASSUMPTIONS_STEPS,
  getNextStep,
  isLastStep,
  initialAssumptionsWizardState,
} from "./wizardReducer";
import type { AssumptionsWizardStep } from "./wizardReducer";

/** BOE base rate only affects Plan 1 & Plan 4 interest */
const BOE_RELEVANT_PLANS = new Set(["PLAN_1", "PLAN_4"]);

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
  const { loans, showPresentValue } = useLoanConfigState();

  const hasBoeRelevantLoan = loans.some((l) =>
    BOE_RELEVANT_PLANS.has(l.planType),
  );

  const stepOrder = ALL_ASSUMPTIONS_STEPS.filter((step) => {
    if (step === "boe-base-rate") return hasBoeRelevantLoan;
    if (step === "discount-rate") return showPresentValue;
    return true;
  });

  const reducer = createWizardReducer(stepOrder, initialAssumptionsWizardState);

  const [state, dispatch] = useReducer(
    reducer,
    entryStep
      ? { currentStep: entryStep, direction: "forward" as const }
      : initialAssumptionsWizardState,
  );

  const { currentStep, direction } = state;
  const stepIndex = stepOrder.indexOf(currentStep);

  function goToStep(step: AssumptionsWizardStep) {
    trackWizardStepViewed("assumptions", step);
    dispatch({ type: "GO_TO_STEP", step });
  }

  function goBack() {
    trackWizardBackClicked("assumptions", currentStep);
    dispatch({ type: "GO_BACK" });
  }

  function advance() {
    const next = getNextStep(currentStep, stepOrder);
    if (next) {
      goToStep(next);
    } else {
      onComplete();
    }
  }

  const canGoBack = currentStep !== stepOrder[0];
  const lastStep = isLastStep(currentStep, stepOrder);

  function renderStep() {
    switch (currentStep) {
      case "salary-growth":
        return <SalaryGrowthStep direction={direction} onNext={advance} />;
      case "threshold-growth":
        return <ThresholdGrowthStep direction={direction} onNext={advance} />;
      case "rpi":
        return lastStep ? (
          <RpiStep direction={direction} onNext={onComplete} done />
        ) : (
          <RpiStep direction={direction} onNext={advance} />
        );
      case "boe-base-rate":
        return lastStep ? (
          <BoeBaseRateStep direction={direction} onNext={onComplete} done />
        ) : (
          <BoeBaseRateStep direction={direction} onNext={advance} />
        );
      case "discount-rate":
        return lastStep ? (
          <DiscountRateStep direction={direction} onNext={onComplete} done />
        ) : (
          <DiscountRateStep direction={direction} onNext={advance} />
        );
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <QuizProgress
        currentStep={stepIndex}
        totalSteps={stepOrder.length}
        onBack={canGoBack ? goBack : undefined}
        onClose={onClose}
        closeIcon={Tick02Icon}
        closeLabel="Done"
      />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">{renderStep()}</div>
      </main>

      <LivePreview />
    </div>
  );
}
