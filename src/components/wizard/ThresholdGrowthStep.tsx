"use client";

import { startTransition, useOptimistic } from "react";
import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { THRESHOLD_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import {
  trackPlan2FreezeToggled,
  trackThresholdGrowthSelected,
} from "@/lib/analytics";
import {
  PLAN_2_FREEZE_TARGET,
  PLAN_2_FREEZE_END_YEAR,
} from "@/lib/loans/plan2Freeze";

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
  const { thresholdGrowthRate, applyPlan2Freeze, loans } = useLoanConfigState();
  const [optimisticThresholdGrowthRate, setOptimisticThresholdGrowthRate] =
    useOptimistic(thresholdGrowthRate);
  const [optimisticApplyPlan2Freeze, setOptimisticApplyPlan2Freeze] =
    useOptimistic(applyPlan2Freeze);

  const hasPlan2 = loans.some((l) => l.planType === "PLAN_2");

  const isPreset = presetValues.has(optimisticThresholdGrowthRate);
  const customDisplayValue = isPreset
    ? ""
    : optimisticThresholdGrowthRate * 100;

  const subtitle =
    optimisticApplyPlan2Freeze && hasPlan2
      ? "After the freeze, how fast will thresholds grow?"
      : "Thresholds determine when you start repaying";

  return (
    <QuestionStep
      title="How will repayment thresholds change?"
      subtitle={subtitle}
      direction={direction}
    >
      <div className="space-y-6">
        {hasPlan2 && (
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
            <Switch
              checked={optimisticApplyPlan2Freeze}
              onCheckedChange={(checked) => {
                trackPlan2FreezeToggled(checked);
                startTransition(() => {
                  setOptimisticApplyPlan2Freeze(checked);
                  updateField("applyPlan2Freeze", checked);
                });
              }}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <span className="text-sm leading-none font-medium">
                Apply Plan 2 freeze (Budget 2025)
              </span>
              <p className="text-xs text-muted-foreground">
                Threshold rises to{" "}
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                  maximumFractionDigits: 0,
                }).format(PLAN_2_FREEZE_TARGET)}{" "}
                in April 2026, then frozen until{" "}
                {String(PLAN_2_FREEZE_END_YEAR)}
              </p>
            </div>
          </label>
        )}

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
        </div>

        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </QuestionStep>
  );
}
