"use client";

import { startTransition, useOptimistic } from "react";
import { TotalRepaymentChart } from "@/components/charts/TotalRepaymentChart";
import { SalaryGrowthBadge } from "@/components/shared/SalaryGrowthBadge";
import { Slider } from "@/components/ui/slider";
import {
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  currencyFormatter,
} from "@/constants";
import { useLoanFrequentState, useLoanActions } from "@/context/LoanContext";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";
import { trackSalaryChanged } from "@/lib/analytics";

export function SalaryExplorer() {
  const { salary } = useLoanFrequentState();
  const { updateField } = useLoanActions();
  const showPresentValue = useShowPresentValue();
  const [optimisticSalary, setOptimisticSalary] = useOptimistic(salary);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          {showPresentValue
            ? "Total repayment (inflation-adjusted)"
            : "Total repayment"}
        </h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Your salary:{" "}
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {currencyFormatter.format(optimisticSalary)}
          </span>
          <SalaryGrowthBadge />
        </div>
      </div>

      <div className="h-75 sm:h-100 lg:h-112">
        <TotalRepaymentChart />
      </div>

      {/* Padding aligns slider track with chart plot area (25px margin + ~60px YAxis) */}
      <div className="-mt-1 pr-6 pl-21">
        <Slider
          value={optimisticSalary}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={SALARY_STEP}
          onValueChange={(value) => {
            const v = typeof value === "number" ? value : value[0];
            startTransition(() => {
              setOptimisticSalary(v);
              updateField("salary", v);
            });
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
