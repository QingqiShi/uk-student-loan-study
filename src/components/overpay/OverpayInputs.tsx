"use client";

import type { SalaryGrowthRate } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  MIN_MONTHLY_OVERPAYMENT,
  MAX_MONTHLY_OVERPAYMENT,
  OVERPAYMENT_STEP,
  MIN_SAVINGS_RATE,
  MAX_SAVINGS_RATE,
  SAVINGS_RATE_STEP,
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanContext } from "@/context/LoanContext";

const salaryGrowthOptions: { value: SalaryGrowthRate; label: string }[] = [
  { value: "conservative", label: "2%" },
  { value: "moderate", label: "4%" },
  { value: "aggressive", label: "6%" },
];

export function OverpayInputs() {
  const { state, updateField } = useLoanContext();

  const handleSalaryChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    updateField("salary", newValue);
  };

  const handleOverpaymentChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    updateField("monthlyOverpayment", newValue);
  };

  const handleSavingsRateChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    updateField("alternativeSavingsRate", newValue);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="salary-slider">Your Current Salary</Label>
          <span className="text-sm font-medium tabular-nums">
            {currencyFormatter.format(state.salary)}
          </span>
        </div>
        <Slider
          id="salary-slider"
          value={[state.salary]}
          onValueChange={handleSalaryChange}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          aria-label="Adjust your annual salary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currencyFormatter.format(MIN_SALARY)}</span>
          <span>{currencyFormatter.format(MAX_SALARY)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="overpayment-slider">Monthly Overpayment</Label>
          <span className="text-sm font-medium tabular-nums">
            {currencyFormatter.format(state.monthlyOverpayment)}
          </span>
        </div>
        <Slider
          id="overpayment-slider"
          value={[state.monthlyOverpayment]}
          onValueChange={handleOverpaymentChange}
          min={MIN_MONTHLY_OVERPAYMENT}
          max={MAX_MONTHLY_OVERPAYMENT}
          step={OVERPAYMENT_STEP}
          aria-label="Adjust monthly overpayment amount"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currencyFormatter.format(MIN_MONTHLY_OVERPAYMENT)}</span>
          <span>{currencyFormatter.format(MAX_MONTHLY_OVERPAYMENT)}</span>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Expected Annual Salary Growth
        </legend>
        <div
          role="group"
          aria-label="Salary growth rate options"
          className="flex gap-2"
        >
          {salaryGrowthOptions.map((option) => (
            <Button
              key={option.value}
              variant={
                state.salaryGrowthRate === option.value ? "default" : "outline"
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
          {state.salaryGrowthRate === "conservative" &&
            "Matches inflation only"}
          {state.salaryGrowthRate === "moderate" &&
            "Typical career progression"}
          {state.salaryGrowthRate === "aggressive" &&
            "Fast-track careers (tech, finance)"}
        </p>
      </fieldset>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="savings-rate-slider">
            Alternative Investment Return
          </Label>
          <span className="text-sm font-medium tabular-nums">
            {(state.alternativeSavingsRate * 100).toFixed(1)}%
          </span>
        </div>
        <Slider
          id="savings-rate-slider"
          value={[state.alternativeSavingsRate]}
          onValueChange={handleSavingsRateChange}
          min={MIN_SAVINGS_RATE}
          max={MAX_SAVINGS_RATE}
          step={SAVINGS_RATE_STEP}
          aria-label="Adjust alternative investment return rate"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>10%</span>
        </div>
        <p className="text-xs text-muted-foreground">
          What you&apos;d earn if investing instead of overpaying
        </p>
      </div>
    </div>
  );
}

export default OverpayInputs;
