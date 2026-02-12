"use client";

import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { THRESHOLD_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackThresholdGrowthSelected } from "@/lib/analytics";

interface ThresholdGrowthStepProps {
  direction: "forward" | "backward";
  onComplete: () => void;
}

export function ThresholdGrowthStep({
  direction,
  onComplete,
}: ThresholdGrowthStepProps) {
  const { updateField } = useLoanActions();
  const { thresholdGrowthRate } = useLoanConfigState();

  return (
    <QuestionStep
      title="How will repayment thresholds change?"
      subtitle="Thresholds determine when you start repaying"
      direction={direction}
    >
      <div className="mx-auto max-w-sm space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Threshold Growth</legend>
          <div className="flex gap-1">
            {THRESHOLD_GROWTH_OPTIONS.map((option) => (
              <Button
                key={option.label}
                variant={
                  thresholdGrowthRate === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  trackThresholdGrowthSelected(option.value);
                  updateField("thresholdGrowthRate", option.value);
                }}
                aria-pressed={thresholdGrowthRate === option.value}
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {
              THRESHOLD_GROWTH_OPTIONS.find(
                (o) => o.value === thresholdGrowthRate,
              )?.description
            }
          </p>
          <p className="text-xs text-status-warning">
            Note: Government has frozen thresholds through 2027.
          </p>
        </fieldset>

        <Button className="w-full" onClick={onComplete}>
          Done
        </Button>
      </div>
    </QuestionStep>
  );
}
