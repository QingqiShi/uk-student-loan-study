"use client";

import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { SALARY_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackSalaryGrowthSelected } from "@/lib/analytics";

interface SalaryGrowthStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
}

export function SalaryGrowthStep({ direction, onNext }: SalaryGrowthStepProps) {
  const { updateField } = useLoanActions();
  const { salaryGrowthRate } = useLoanConfigState();

  return (
    <QuestionStep
      title="How fast will your salary grow?"
      subtitle="This affects how quickly you repay your loan"
      direction={direction}
    >
      <div className="mx-auto max-w-sm space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Salary Growth</legend>
          <div className="flex gap-1">
            {SALARY_GROWTH_OPTIONS.map((option) => (
              <Button
                key={option.label}
                variant={
                  salaryGrowthRate === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  trackSalaryGrowthSelected(option.value);
                  updateField("salaryGrowthRate", option.value);
                }}
                aria-pressed={salaryGrowthRate === option.value}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {
              SALARY_GROWTH_OPTIONS.find((o) => o.value === salaryGrowthRate)
                ?.description
            }
          </p>
        </fieldset>

        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </QuestionStep>
  );
}
