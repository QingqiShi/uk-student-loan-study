"use client";

import { SalaryGrowthPicker } from "@/components/SalaryGrowthPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import YearSelector from "@/components/YearSelector";
import {
  MIN_MONTHLY_OVERPAYMENT,
  MAX_MONTHLY_OVERPAYMENT,
  OVERPAYMENT_STEP,
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanContext } from "@/context/LoanContext";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import {
  trackOverpaySalaryChanged,
  trackOverpayMonthlyChanged,
  trackOverpayLumpsumChanged,
} from "@/lib/analytics";

interface OverpayPrimaryInputsProps {
  repaymentDate: Date;
  onRepaymentDateChange: (date: Date) => void;
}

export function OverpayPrimaryInputs({
  repaymentDate,
  onRepaymentDateChange,
}: OverpayPrimaryInputsProps) {
  const { state, updateField } = useLoanContext();
  const { underGradBalance, postGradBalance } = useLoanConfig();
  const totalBalance = underGradBalance + postGradBalance;

  const handleSalaryChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    updateField("salary", newValue);
  };

  const handleOverpaymentChange = (value: number | readonly number[]) => {
    const newValue = typeof value === "number" ? value : value[0];
    updateField("monthlyOverpayment", newValue);
  };

  const handleLumpSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);
    const clampedValue = Math.min(Math.max(0, numValue), totalBalance);
    updateField("lumpSumPayment", clampedValue);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lump-sum-input">Lump Sum Payment</Label>
          {totalBalance > 0 ? (
            <>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">
                  £
                </span>
                <Input
                  id="lump-sum-input"
                  type="text"
                  inputMode="numeric"
                  value={
                    state.lumpSumPayment === 0
                      ? ""
                      : state.lumpSumPayment.toLocaleString("en-GB")
                  }
                  onChange={handleLumpSumChange}
                  onBlur={() => {
                    trackOverpayLumpsumChanged(state.lumpSumPayment);
                  }}
                  placeholder="0"
                  className="pl-6"
                  aria-label="Enter one-off lump sum payment"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Max: {currencyFormatter.format(totalBalance)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Configure your loan balance first
            </p>
          )}
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
            onValueCommitted={(value) => {
              const overpayValue = typeof value === "number" ? value : value[0];
              trackOverpayMonthlyChanged(overpayValue);
            }}
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="salary-slider">Current Salary</Label>
            <span className="text-sm font-medium tabular-nums">
              {currencyFormatter.format(state.salary)}
            </span>
          </div>
          <Slider
            id="salary-slider"
            value={[state.salary]}
            onValueChange={handleSalaryChange}
            onValueCommitted={(value) => {
              const salaryValue = typeof value === "number" ? value : value[0];
              trackOverpaySalaryChanged(salaryValue);
            }}
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

        <SalaryGrowthPicker />

        <YearSelector
          id="overpay-repayment-year"
          label="Repayment Start Year"
          value={repaymentDate}
          onChange={(value) => {
            if (value) {
              onRepaymentDateChange(value);
            }
          }}
        />
      </div>
    </div>
  );
}
