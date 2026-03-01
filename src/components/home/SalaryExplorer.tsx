"use client";

import { TotalRepaymentChart } from "@/components/charts/TotalRepaymentChart";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

interface SalaryExplorerProps {
  badge?: React.ReactNode;
}

export function SalaryExplorer({ badge }: SalaryExplorerProps) {
  const showPresentValue = useShowPresentValue();

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          {showPresentValue
            ? "Total repayment by salary (inflation-adjusted)"
            : "Total repayment by salary"}
        </h2>
        {badge}
      </div>

      <div className="h-75 sm:h-100 lg:h-112">
        <TotalRepaymentChart />
      </div>
    </div>
  );
}
