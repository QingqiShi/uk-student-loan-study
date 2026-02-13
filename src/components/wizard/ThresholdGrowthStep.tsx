"use client";

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
  onComplete: () => void;
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
  onComplete,
}: ThresholdGrowthStepProps) {
  const { updateField } = useLoanActions();
  const { thresholdGrowthRate } = useLoanConfigState();

  const isPreset = presetValues.has(thresholdGrowthRate);
  const customDisplayValue = isPreset ? "" : thresholdGrowthRate * 100;

  return (
    <QuestionStep
      title="How will repayment thresholds change?"
      subtitle="Thresholds determine when you start repaying"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {THRESHOLD_GROWTH_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={thresholdGrowthRate === option.value}
                onClick={() => {
                  trackThresholdGrowthSelected(option.value);
                  updateField("thresholdGrowthRate", option.value);
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Custom
            </span>
            <div className="relative w-24">
              <NumericFormat
                value={customDisplayValue}
                onValueChange={(values) => {
                  if (typeof values.floatValue === "number") {
                    updateField("thresholdGrowthRate", values.floatValue / 100);
                  } else if (values.value === "" || values.value === "-") {
                    // Keep current value while user is clearing/typing
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
            Note: Government has frozen thresholds through 2027.
          </p>
        </div>

        <Button className="w-full" onClick={onComplete}>
          Done
        </Button>
      </div>
    </QuestionStep>
  );
}
