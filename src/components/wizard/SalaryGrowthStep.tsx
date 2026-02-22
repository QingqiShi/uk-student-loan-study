"use client";

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

  const isPreset = presetValues.has(salaryGrowthRate);
  const customDisplayValue = isPreset ? "" : salaryGrowthRate * 100;

  return (
    <QuestionStep
      title="How fast will your salary grow?"
      subtitle="This affects how quickly you repay your loan"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            {SALARY_GROWTH_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={salaryGrowthRate === option.value}
                onClick={() => {
                  trackSalaryGrowthSelected(option.value);
                  updateField("salaryGrowthRate", option.value);
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
                  if (typeof values.floatValue === "number") {
                    updateField("salaryGrowthRate", values.floatValue / 100);
                  } else if (values.value === "" || values.value === "-") {
                    // Keep current value while user is clearing/typing
                  }
                }}
                customInput={CustomInput}
                className="pr-12"
                allowNegative
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 5"
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
