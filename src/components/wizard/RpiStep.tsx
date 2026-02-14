"use client";

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

  const isPreset = presetValues.has(rpiRate);
  const customDisplayValue = isPreset ? "" : rpiRate;

  return (
    <QuestionStep
      title="What RPI rate do you expect?"
      subtitle="RPI determines the interest rate on most student loans"
      direction={direction}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {RPI_OPTIONS.map((option) => (
              <OptionCard
                key={option.label}
                label={option.label}
                sublabel={option.description}
                isSelected={rpiRate === option.value}
                onClick={() => {
                  trackRpiRateSelected(option.value);
                  updateField("rpiRate", option.value);
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
                    updateField("rpiRate", values.floatValue);
                  }
                }}
                customInput={CustomInput}
                className="pr-8"
                allowNegative={false}
                decimalScale={1}
                inputMode="decimal"
                placeholder="e.g. 3"
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
