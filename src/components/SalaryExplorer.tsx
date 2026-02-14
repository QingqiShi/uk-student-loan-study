"use client";

import { SalaryGrowthBadge } from "./SalaryGrowthBadge";
import { TotalRepaymentChart } from "./TotalRepaymentChart";
import { Slider } from "./ui/slider";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanFrequentState, useLoanActions } from "@/context/LoanContext";
import { trackSalaryChanged } from "@/lib/analytics";

export function SalaryExplorer() {
  const { salary } = useLoanFrequentState();
  const { updateField } = useLoanActions();

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total repayment
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Your salary:{" "}
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {currencyFormatter.format(salary)}
          </span>
          <SalaryGrowthBadge />
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
        <TotalRepaymentChart />
      </div>

      {/* Padding aligns slider track with chart plot area (25px margin + ~60px YAxis) */}
      <div className="-mt-1 pr-[25px] pl-[85px]">
        <Slider
          value={salary}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          onValueChange={(value) => {
            const v = typeof value === "number" ? value : value[0];
            updateField("salary", v);
          }}
          onValueCommitted={(value) => {
            const v = typeof value === "number" ? value : value[0];
            trackSalaryChanged(v);
          }}
          aria-label="Adjust your annual salary"
        />
      </div>
    </div>
  );
}
