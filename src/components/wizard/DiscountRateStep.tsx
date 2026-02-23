"use client";

import { startTransition, useOptimistic } from "react";
import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DISCOUNT_RATE_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";

interface DiscountRateStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  done?: boolean;
}

const presetValues = new Set(DISCOUNT_RATE_OPTIONS.map((o) => o.value));

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export function DiscountRateStep({
  direction,
  onNext,
  done,
}: DiscountRateStepProps) {
  const { updateField } = useLoanActions();
  const { discountRate } = useLoanConfigState();
  const [optimisticDiscountRate, setOptimisticDiscountRate] =
    useOptimistic(discountRate);

  const isPreset = presetValues.has(optimisticDiscountRate);
  const customDisplayValue = isPreset ? "" : optimisticDiscountRate * 100;

  return (
    <QuestionStep
      title="How fast will prices rise?"
      subtitle="Unlike RPI, this uses general inflation to show amounts in today's money."
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div
            role="radiogroup"
            aria-label="Discount rate presets"
            className="grid grid-cols-1 gap-3 xs:grid-cols-2"
          >
            {DISCOUNT_RATE_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={optimisticDiscountRate === option.value}
                onClick={() => {
                  startTransition(() => {
                    setOptimisticDiscountRate(option.value);
                    updateField("discountRate", option.value);
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
                      setOptimisticDiscountRate(v / 100);
                      updateField("discountRate", v / 100);
                    });
                  }
                }}
                customInput={CustomInput}
                className="pr-8"
                allowNegative={false}
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 2"
                aria-label="Custom discount rate percentage"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={onNext}>
          {done ? "Done" : "Next"}
        </Button>
      </div>
    </QuestionStep>
  );
}
