"use client";

import { CumulativeRepaidChart } from "./CumulativeRepaidChart";
import { DetailPageShell } from "./DetailPageShell";
import { RepaidHeroStats, RepaidHeroStatsSkeleton } from "./RepaidHeroStats";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";

export function RepaidDetailPage() {
  const result = useDetailSeriesData();

  const payoffYears = result ? Math.round(result.stats.monthsToPayoff / 12) : 0;

  function getInsightText() {
    if (!result) return null;
    const { monthlyRepayment, writtenOff } = result.stats;
    const monthly = currencyFormatter.format(monthlyRepayment);

    if (writtenOff) {
      return `Your repayments start at ${monthly}/month at your current salary. After ${String(payoffYears)} years, the remaining balance is written off.`;
    }

    return `Your repayments start at ${monthly}/month at your current salary, growing over ${String(payoffYears)} years as your income rises.`;
  }

  return (
    <DetailPageShell
      heading="Total Repayments"
      description="Track how much you'll repay on your student loan over time."
    >
      {result ? (
        <div className="space-y-2">
          <RepaidHeroStats
            totalRepaid={currencyFormatter.format(result.stats.totalPaid)}
            writtenOff={result.stats.writtenOff}
            payoffYears={payoffYears}
            aheadOfSchedule={payoffYears <= 15 && !result.stats.writtenOff}
          />
          <div className="h-65 sm:h-75 md:h-85">
            <CumulativeRepaidChart
              data={result.cumulativeRepaid}
              writeOffMonth={result.stats.writeOffMonth}
            />
          </div>
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            {getInsightText()}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <RepaidHeroStatsSkeleton />
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
