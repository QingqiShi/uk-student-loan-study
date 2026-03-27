"use client";

import { startTransition, useOptimistic } from "react";
import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SALARY_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackSalaryGrowthSelected } from "@/lib/analytics";

interface SalaryGrowthStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
}

const presetValues = new Set(SALARY_GROWTH_OPTIONS.map((o) => o.value));

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export function SalaryGrowthStep({ direction, onNext }: SalaryGrowthStepProps) {
  const { updateField } = useLoanActions();
  const { salaryGrowthRate } = useLoanConfigState();
  const [optimisticSalaryGrowthRate, setOptimisticSalaryGrowthRate] =
    useOptimistic(salaryGrowthRate);

  const isPreset = presetValues.has(optimisticSalaryGrowthRate);
  const customDisplayValue = isPreset ? "" : optimisticSalaryGrowthRate * 100;

  return (
    <QuestionStep
      title="How fast will your salary grow?"
      subtitle="This affects how quickly you repay your loan"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div
            role="radiogroup"
            aria-label="Salary growth rate"
            className="grid grid-cols-1 gap-3 xs:grid-cols-2"
          >
            {SALARY_GROWTH_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={optimisticSalaryGrowthRate === option.value}
                onClick={() => {
                  trackSalaryGrowthSelected(option.value);
                  startTransition(() => {
                    setOptimisticSalaryGrowthRate(option.value);
                    updateField("salaryGrowthRate", option.value);
                  });
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Custom
            </span>
            <div className="relative w-32">
              <NumericFormat
                value={customDisplayValue}
                onValueChange={(values) => {
                  const v = values.floatValue;
                  if (typeof v === "number") {
                    startTransition(() => {
                      setOptimisticSalaryGrowthRate(v / 100);
                      updateField("salaryGrowthRate", v / 100);
                    });
                  }
                }}
                customInput={CustomInput}
                className="pr-12"
                allowNegative
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 5"
                aria-label="Custom salary growth rate percentage"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                %/yr
              </span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </QuestionStep>
  );
}
