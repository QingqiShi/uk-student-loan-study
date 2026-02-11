"use client";

import Link from "next/link";
import { useState } from "react";
import type { UndergraduatePlanType } from "@/lib/loans/types";
import { CurrencyInput } from "@/components/CurrencyInput";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import {
  trackPlanSelected,
  trackUndergradBalanceChanged,
} from "@/lib/analytics";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

interface UndergradStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  onSkipUndergrad: () => void;
  showPreselection?: boolean;
  isDone?: boolean;
}

const PLAN_OPTIONS: { value: UndergraduatePlanType; label: string }[] = [
  { value: "PLAN_1", label: PLAN_DISPLAY_INFO.PLAN_1.name },
  { value: "PLAN_2", label: PLAN_DISPLAY_INFO.PLAN_2.name },
  { value: "PLAN_4", label: PLAN_DISPLAY_INFO.PLAN_4.name },
  { value: "PLAN_5", label: PLAN_DISPLAY_INFO.PLAN_5.name },
];

const QUICK_PICKS_BY_PLAN: Record<string, number[]> = {
  PLAN_1: [10_000, 15_000, 20_000, 25_000],
  PLAN_2: [20_000, 30_000, 45_000, 50_000],
  PLAN_4: [15_000, 20_000, 25_000, 30_000],
  PLAN_5: [30_000, 40_000, 50_000, 60_000],
};

export function UndergradStep({
  direction,
  onNext,
  onSkipUndergrad,
  showPreselection = false,
  isDone = false,
}: UndergradStepProps) {
  const { updateField } = useLoanActions();
  const { underGradPlanType, underGradBalance } = useLoanConfigState();
  const [hasUndergrad, setHasUndergrad] = useState<boolean | null>(
    showPreselection ? true : null,
  );
  const [hasInteracted, setHasInteracted] = useState(showPreselection);
  const [hasPlanInteracted, setHasPlanInteracted] = useState(showPreselection);

  const quickPicks = QUICK_PICKS_BY_PLAN[underGradPlanType] ?? QUICK_PICKS_BY_PLAN.PLAN_2;
  const planInfo = PLAN_DISPLAY_INFO[underGradPlanType];

  return (
    <QuestionStep
      title="Do you have an undergraduate loan?"
      direction={direction}
    >
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          label="Yes"
          isSelected={hasUndergrad === true}
          onClick={() => { setHasUndergrad(true); }}
        />
        <OptionCard
          label="No"
          isSelected={hasUndergrad === false}
          onClick={onSkipUndergrad}
        />
      </div>

      <div
        className={`mt-6 space-y-6 ${
          hasUndergrad !== true ? "pointer-events-none opacity-40" : ""
        }`}
        aria-hidden={hasUndergrad !== true}
        {...(hasUndergrad !== true ? { inert: true } : {})}
      >
        <div className="space-y-3">
          <p className="text-sm font-medium">Select your loan plan</p>
          <div className="grid auto-rows-fr grid-cols-2 gap-3">
            {PLAN_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                isSelected={
                  hasPlanInteracted && underGradPlanType === option.value
                }
                onClick={() => {
                  setHasPlanInteracted(true);
                  trackPlanSelected(option.value);
                  updateField("underGradPlanType", option.value);
                }}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-sm">
          <Link
            href="/which-plan"
            className="text-primary underline-offset-4 hover:underline"
          >
            Not sure? Take the quiz
          </Link>
        </p>

        <div className="mx-auto max-w-sm space-y-6">
          <CurrencyInput
            id="wizard-balance"
            label="Outstanding balance"
            value={hasInteracted ? underGradBalance : ""}
            onChange={(value) => {
              setHasInteracted(true);
              updateField("underGradBalance", value);
            }}
            onBlur={() => {
              trackUndergradBalanceChanged(underGradBalance);
            }}
          />

          <div className="flex flex-wrap gap-2">
            {quickPicks.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant={
                  hasInteracted && underGradBalance === amount
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setHasInteracted(true);
                  updateField("underGradBalance", amount);
                  trackUndergradBalanceChanged(amount);
                }}
              >
                {currencyFormatter.format(amount)}
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            The average {planInfo.name} graduate owes ~
            {currencyFormatter.format(quickPicks[2])}
          </p>

          <Button className="w-full" onClick={onNext}>
            {isDone ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </QuestionStep>
  );
}
