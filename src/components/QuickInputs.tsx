"use client";

import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/store";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import CurrencyInput from "./CurrencyInput";

export function QuickInputs() {
  const salary = useStore((state) => state.salary);
  const underGradBalance = useStore((state) => state.underGradBalance);
  const updateField = useStore((state) => state.updateField);

  const handleSalaryChange = useCallback(
    (value: number | readonly number[]) => {
      const newSalary = Array.isArray(value) ? value[0] : value;
      updateField("salary", newSalary);
    },
    [updateField],
  );

  const handleBalanceChange = useCallback(
    (value: number) => {
      updateField("underGradBalance", value);
    },
    [updateField],
  );

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="salary-slider">Your Salary</Label>
          <span className="text-sm font-medium tabular-nums">
            {currencyFormatter.format(salary)}
          </span>
        </div>
        <Slider
          id="salary-slider"
          value={[salary]}
          onValueChange={handleSalaryChange}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          aria-label="Adjust your annual salary"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{currencyFormatter.format(MIN_SALARY)}</span>
          <span>{currencyFormatter.format(MAX_SALARY)}</span>
        </div>
      </div>

      <div className="w-full sm:w-48">
        <CurrencyInput
          id="quick-balance"
          label="Loan Balance"
          value={underGradBalance}
          onChange={handleBalanceChange}
        />
      </div>
    </div>
  );
}

export default QuickInputs;
