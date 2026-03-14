"use client";

import { startTransition, useOptimistic } from "react";
import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THRESHOLD_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackThresholdGrowthSelected } from "@/lib/analytics";

interface ThresholdGrowthStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
}

const presetValues = new Set(THRESHOLD_GROWTH_OPTIONS.map((o) => o.value));

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export function ThresholdGrowthStep({
  direction,
  onNext,
}: ThresholdGrowthStepProps) {
  const { updateField } = useLoanActions();
  const { thresholdGrowthRate } = useLoanConfigState();
  const [optimisticThresholdGrowthRate, setOptimisticThresholdGrowthRate] =
    useOptimistic(thresholdGrowthRate);

  const isPreset = presetValues.has(optimisticThresholdGrowthRate);
  const customDisplayValue = isPreset
    ? ""
    : optimisticThresholdGrowthRate * 100;

  return (
    <QuestionStep
      title="How will repayment thresholds change?"
      subtitle="Thresholds determine when you start repaying"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            {THRESHOLD_GROWTH_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={optimisticThresholdGrowthRate === option.value}
                onClick={() => {
                  trackThresholdGrowthSelected(option.value);
                  startTransition(() => {
                    setOptimisticThresholdGrowthRate(option.value);
                    updateField("thresholdGrowthRate", option.value);
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
                      setOptimisticThresholdGrowthRate(v / 100);
                      updateField("thresholdGrowthRate", v / 100);
                    });
                  }
                }}
                customInput={CustomInput}
                className="pr-12"
                allowNegative
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 3"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                %/yr
              </span>
            </div>
          </div>

          <p className="text-xs text-status-warning-foreground">
            Note: Thresholds are about to change.{" "}
            <a
              href="/guides/threshold-freeze"
              className="underline underline-offset-2 hover:text-status-warning-foreground/80"
            >
              Learn more
            </a>
          </p>
        </div>

        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </QuestionStep>
  );
}
