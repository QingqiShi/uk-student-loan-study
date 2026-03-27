"use client";

import { startTransition, useOptimistic } from "react";
import { NumericFormat } from "react-number-format";
import { OptionCard } from "@/components/quiz/OptionCard";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RPI_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackRpiRateSelected } from "@/lib/analytics";

interface RpiStepProps {
  direction: "forward" | "backward";
  onNext: () => void;
  done?: boolean;
}

const presetValues = new Set(RPI_OPTIONS.map((o) => o.value));

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export function RpiStep({ direction, onNext, done }: RpiStepProps) {
  const { updateField } = useLoanActions();
  const { rpiRate } = useLoanConfigState();
  const [optimisticRpiRate, setOptimisticRpiRate] = useOptimistic(rpiRate);

  const isPreset = presetValues.has(optimisticRpiRate);
  const customDisplayValue = isPreset ? "" : optimisticRpiRate;

  return (
    <QuestionStep
      title="What RPI rate do you expect?"
      subtitle="Used to set your student loan interest rate each year"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div
            role="radiogroup"
            aria-label="RPI rate"
            className="grid grid-cols-1 gap-3 xs:grid-cols-2"
          >
            {RPI_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={optimisticRpiRate === option.value}
                onClick={() => {
                  trackRpiRateSelected(option.value);
                  startTransition(() => {
                    setOptimisticRpiRate(option.value);
                    updateField("rpiRate", option.value);
                  });
                }}
              />
            ))}
          </div>

          <p className="text-xs text-status-warning-foreground">
            RPI includes housing costs, so it typically runs higher than general
            inflation (CPI).
          </p>

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
                      setOptimisticRpiRate(v);
                      updateField("rpiRate", v);
                    });
                  }
                }}
                customInput={CustomInput}
                className="pr-8"
                allowNegative={false}
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 3"
                aria-label="Custom RPI rate percentage"
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
