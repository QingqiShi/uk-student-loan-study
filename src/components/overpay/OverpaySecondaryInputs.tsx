"use client";

import type { SalaryGrowthRate } from "@/types/store";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLoanContext } from "@/context/LoanContext";

const salaryGrowthOptions: {
  value: SalaryGrowthRate;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "0%", description: "No salary growth" },
  { value: "conservative", label: "2%", description: "Matches inflation only" },
  { value: "moderate", label: "4%", description: "Typical career progression" },
  {
    value: "aggressive",
    label: "6%",
    description: "Fast-track careers (tech, finance)",
  },
];

export function OverpaySecondaryInputs() {
  const { state, updateField } = useLoanContext();

  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger>Advanced</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-4">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Salary Growth</legend>
            <div
              role="group"
              aria-label="Salary growth rate options"
              className="flex gap-1"
            >
              {salaryGrowthOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    state.salaryGrowthRate === option.value
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    updateField("salaryGrowthRate", option.value);
                  }}
                  aria-pressed={state.salaryGrowthRate === option.value}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                salaryGrowthOptions.find(
                  (o) => o.value === state.salaryGrowthRate,
                )?.description
              }
            </p>
          </fieldset>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
