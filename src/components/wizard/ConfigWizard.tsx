"use client";

import { useReducer } from "react";
import { LivePreview } from "./LivePreview";
import { PostgradStep } from "./PostgradStep";
import { SalaryStep } from "./SalaryStep";
import { UndergradStep } from "./UndergradStep";
import { WizardProgress } from "./WizardProgress";
import {
  createWizardReducer,
  LOAN_STEP_ORDER,
  initialLoanWizardState,
} from "./wizardReducer";
import type { LoanWizardStep } from "./wizardReducer";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import {
  trackWizardStepViewed,
  trackWizardBackClicked,
  trackWizardSkippedUndergrad,
  trackWizardSkippedPostgrad,
} from "@/lib/analytics";

const loanReducer = createWizardReducer(
  LOAN_STEP_ORDER,
  initialLoanWizardState,
);

interface ConfigWizardProps {
  onComplete: () => void;
  onClose: () => void;
  entryStep?: LoanWizardStep;
  hasPersonalized?: boolean;
  onOpenAssumptions?: () => void;
}

export function ConfigWizard({
  onComplete,
  onClose,
  entryStep,
  hasPersonalized = false,
  onOpenAssumptions,
}: ConfigWizardProps) {
  const [state, dispatch] = useReducer(
    loanReducer,
    entryStep
      ? { currentStep: entryStep, direction: "forward" as const }
      : initialLoanWizardState,
  );
  const { updateField } = useLoanActions();
  const { postGradBalance } = useLoanConfigState();

  const isEditJump = entryStep !== undefined;
  const { currentStep, direction } = state;
  const stepIndex = LOAN_STEP_ORDER.indexOf(currentStep);

  function goToStep(step: LoanWizardStep) {
    trackWizardStepViewed("loan", step);
    dispatch({ type: "GO_TO_STEP", step });
  }

  function goBack() {
    trackWizardBackClicked("loan", currentStep);
    dispatch({ type: "GO_BACK" });
  }

  function handleSkipUndergrad() {
    trackWizardSkippedUndergrad();
    updateField("underGradBalance", 0);
    goToStep("postgrad");
  }

  function handleSkipPostgrad() {
    trackWizardSkippedPostgrad();
    updateField("postGradBalance", 0);
    goToStep("salary");
  }

  const canGoBack = !isEditJump && currentStep !== "undergrad";

  function renderStep() {
    switch (currentStep) {
      case "undergrad":
        return (
          <UndergradStep
            direction={direction}
            onNext={() => {
              goToStep("postgrad");
            }}
            onSkipUndergrad={handleSkipUndergrad}
            showPreselection={hasPersonalized || isEditJump}
            isDone={isEditJump}
          />
        );
      case "postgrad":
        return (
          <PostgradStep
            direction={direction}
            onNext={() => {
              goToStep("salary");
            }}
            onSkipPostgrad={handleSkipPostgrad}
            showPreselection={
              (hasPersonalized || isEditJump) && postGradBalance > 0
            }
            isDone={isEditJump}
          />
        );
      case "salary":
        return (
          <SalaryStep
            direction={direction}
            onNext={onComplete}
            isDone={isEditJump}
          />
        );
    }
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="px-4">
        <WizardProgress
          currentStep={stepIndex}
          totalSteps={LOAN_STEP_ORDER.length}
          onBack={canGoBack ? goBack : undefined}
          onClose={onClose}
        />
      </div>
      <div className="px-4 pb-4">
        {renderStep()}
        {currentStep === "salary" && onOpenAssumptions && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={onOpenAssumptions}
              className="text-primary underline-offset-4 hover:underline"
            >
              Want to refine growth assumptions?
            </button>
          </p>
        )}
      </div>
      {currentStep === "salary" && <LivePreview />}
    </div>
  );
}
