"use client";

import { Button } from "@/components/ui/button";
import { SALARY_GROWTH_OPTIONS } from "@/constants";
import { useLoanContext } from "@/context/LoanContext";
import { trackSalaryGrowthSelected } from "@/lib/analytics";

export function SalaryGrowthPicker() {
  const { state, updateField } = useLoanContext();

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Salary Growth</legend>
      <div
        role="group"
        aria-label="Salary growth rate options"
        className="flex gap-1"
      >
        {SALARY_GROWTH_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={
              state.salaryGrowthRate === option.value ? "default" : "outline"
            }
            size="sm"
            onClick={() => {
              trackSalaryGrowthSelected(option.value);
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
          SALARY_GROWTH_OPTIONS.find((o) => o.value === state.salaryGrowthRate)
            ?.description
        }
      </p>
    </fieldset>
  );
}
