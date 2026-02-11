"use client";

import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanActions, useLoanFrequentState } from "@/context/LoanContext";
import { useResultSummary } from "@/hooks/useResultSummary";
import { trackSalaryChanged } from "@/lib/analytics";

interface SalaryStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  isDone?: boolean;
}

export function SalaryStep({
  direction,
  onNext,
  isDone = false,
}: SalaryStepProps) {
  const { updateField } = useLoanActions();
  const { salary } = useLoanFrequentState();
  const summary = useResultSummary();

  const subtitle = summary
    ? `You'd pay ${currencyFormatter.format(summary.monthlyRepayment)}/month`
    : undefined;

  return (
    <QuestionStep
      title="What's your annual salary?"
      subtitle={subtitle}
      direction={direction}
    >
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="wizard-salary">Annual Salary</Label>
            <span className="font-mono text-lg font-semibold tabular-nums">
              {currencyFormatter.format(salary)}
            </span>
          </div>
          <Slider
            id="wizard-salary"
            value={[salary]}
            onValueChange={(value) => {
              const newSalary = typeof value === "number" ? value : value[0];
              updateField("salary", newSalary);
            }}
            onValueCommitted={(value) => {
              const salaryValue =
                typeof value === "number" ? value : value[0];
              trackSalaryChanged(salaryValue);
            }}
            min={MIN_SALARY}
            max={MAX_SALARY}
            step={SALARY_STEP}
            aria-label="Adjust your annual salary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currencyFormatter.format(MIN_SALARY)}</span>
            <span>{currencyFormatter.format(MAX_SALARY)}</span>
          </div>
        </div>

        <Button className="w-full" onClick={onNext}>
          {isDone ? "Done" : "Next"}
        </Button>
      </div>
    </QuestionStep>
  );
}
