"use client";

import { TotalRepaymentChart } from "@/components/charts/TotalRepaymentChart";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

interface SalaryExplorerProps {
  badge?: React.ReactNode;
}

export function SalaryExplorer({ badge }: SalaryExplorerProps) {
  const showPresentValue = useShowPresentValue();

  return (
    <figure>
      <figcaption className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          {showPresentValue
            ? "Total repayment by salary (inflation-adjusted)"
            : "Total repayment by salary"}
        </h2>
        {badge}
      </figcaption>

      <div className="h-75 sm:h-100 lg:h-112">
        <TotalRepaymentChart />
      </div>
      <p className="sr-only">
        This chart shows total UK student loan repayment amounts across
        different salary levels. Middle earners typically pay the most in total,
        while lower earners benefit from loan write-off after the repayment term
        ends.
      </p>
    </figure>
  );
}
