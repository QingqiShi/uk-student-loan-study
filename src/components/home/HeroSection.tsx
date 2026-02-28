"use client";

import { useEffect } from "react";
import { InputPanel } from "./InputPanel";
import { ResultSummary } from "./ResultSummary";
import { SalaryExplorer } from "./SalaryExplorer";
import type { InputMode } from "./InputPanel";
import { Heading } from "@/components/typography/Heading";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { useInputPanelMode } from "@/hooks/useInputPanelMode";

export function HeroSection() {
  const { updateField } = useLoanActions();
  const config = useLoanConfigState();
  const { pendingQuizPlanTypes } = config;

  const initialMode: InputMode | undefined =
    pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0
      ? { view: "loan-config", initialPlanTypes: pendingQuizPlanTypes }
      : undefined;

  const {
    mode,
    hasPersonalized,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode({ initialMode });

  useEffect(() => {
    if (pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0) {
      updateField("pendingQuizPlanTypes", null);
    }
  }, [pendingQuizPlanTypes, updateField]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Heading as="h1" size="page-hero">
          Student Loan{" "}
          <span className="text-primary">Repayment Calculator</span>
        </Heading>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Middle earners pay the most on UK student loans. See where you fall.
        </p>
        <ul className="max-w-2xl space-y-1 text-sm text-muted-foreground sm:text-base">
          <li className="flex items-baseline gap-2">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40"
              aria-hidden="true"
            />
            Low earners get their loans written off.
          </li>
          <li className="flex items-baseline gap-2">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40"
              aria-hidden="true"
            />
            High earners pay them off quickly.
          </li>
          <li className="flex items-baseline gap-2 text-foreground">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary"
              aria-hidden="true"
            />
            Middle earners pay the most in total - and the most interest.
          </li>
        </ul>
      </div>

      <InputPanel
        hasPersonalized={hasPersonalized}
        mode={mode}
        onPersonalise={handlePersonalise}
        onPresetApplied={handlePresetApplied}
        onWizardComplete={handleWizardComplete}
        onWizardClose={handleWizardClose}
      />

      <div className="space-y-4">
        <ResultSummary />
        <SalaryExplorer />
      </div>
    </section>
  );
}
