"use client";

import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackPostgradBalanceChanged } from "@/lib/analytics";

interface PostgradStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  onSkipPostgrad: () => void;
  showPreselection?: boolean;
  isDone?: boolean;
}

const QUICK_PICKS = [8_000, 10_000, 12_000, 15_000];

export function PostgradStep({
  direction,
  onNext,
  onSkipPostgrad,
  showPreselection = false,
  isDone = false,
}: PostgradStepProps) {
  const { updateField } = useLoanActions();
  const { postGradBalance } = useLoanConfigState();
  const [hasPostgrad, setHasPostgrad] = useState<boolean | null>(
    showPreselection ? true : null,
  );

  return (
    <QuestionStep
      title="Do you have a postgraduate loan?"
      subtitle="A Master's or Doctoral loan from Student Finance"
      direction={direction}
    >
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          label="Yes"
          isSelected={hasPostgrad === true}
          onClick={() => {
            setHasPostgrad(true);
          }}
        />
        <OptionCard
          label="No"
          isSelected={hasPostgrad === false}
          onClick={onSkipPostgrad}
        />
      </div>

      <div
        className={`mt-6 space-y-6 ${
          hasPostgrad !== true ? "pointer-events-none opacity-40" : ""
        }`}
        aria-hidden={hasPostgrad !== true}
        {...(hasPostgrad !== true ? { inert: true } : {})}
      >
        <div className="mx-auto max-w-sm space-y-6">
          <CurrencyInput
            id="wizard-postgrad-balance"
            label="Outstanding balance"
            value={showPreselection ? postGradBalance : postGradBalance || ""}
            onChange={(value) => {
              updateField("postGradBalance", value);
            }}
            onBlur={() => {
              trackPostgradBalanceChanged(postGradBalance);
            }}
          />

          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant={postGradBalance === amount ? "default" : "outline"}
                onClick={() => {
                  updateField("postGradBalance", amount);
                  trackPostgradBalanceChanged(amount);
                }}
              >
                {currencyFormatter.format(amount)}
              </Button>
            ))}
          </div>

          <Button className="w-full" onClick={onNext}>
            {isDone ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </QuestionStep>
  );
}
