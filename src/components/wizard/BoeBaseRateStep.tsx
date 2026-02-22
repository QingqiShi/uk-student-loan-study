"use client";

import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOE_BASE_RATE_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackBoeBaseRateSelected } from "@/lib/analytics";

interface BoeBaseRateStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  done?: boolean;
}

const presetValues = new Set(BOE_BASE_RATE_OPTIONS.map((o) => o.value));

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export function BoeBaseRateStep({
  direction,
  onNext,
  done,
}: BoeBaseRateStepProps) {
  const { updateField } = useLoanActions();
  const { boeBaseRate } = useLoanConfigState();

  const isPreset = presetValues.has(boeBaseRate);
  const customDisplayValue = isPreset ? "" : boeBaseRate;

  return (
    <QuestionStep
      title="What Bank of England base rate do you expect?"
      subtitle="Plan 1 &amp; 4 interest is the lesser of RPI or base rate + 1%"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
            {BOE_BASE_RATE_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={boeBaseRate === option.value}
                onClick={() => {
                  trackBoeBaseRateSelected(option.value);
                  updateField("boeBaseRate", option.value);
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
                    updateField("boeBaseRate", values.floatValue);
                  }
                }}
                customInput={CustomInput}
                className="pr-8"
                allowNegative={false}
                decimalScale={2}
                inputMode="decimal"
                placeholder="e.g. 4"
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
