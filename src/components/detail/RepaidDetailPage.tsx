"use client";

import { CumulativeRepaidChart } from "./CumulativeRepaidChart";
import { DetailPageShell } from "./DetailPageShell";
import { StatCard, StatCardSkeleton } from "./StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { DETAIL_PAGE_COLOR } from "@/lib/detail-pages";

const ACCENT = DETAIL_PAGE_COLOR["/repaid"];

export function RepaidDetailPage() {
  const result = useDetailSeriesData();

  const years = result ? Math.round(result.stats.monthsToPayoff / 12) : 0;

  return (
    <DetailPageShell
      heading="Cumulative Repayments"
      description="Track how your total repayments grow over the life of your loan."
    >
      {result ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Repaid"
              value={currencyFormatter.format(result.stats.totalPaid)}
              subtext={`over ${String(years)} years`}
              accentColor={ACCENT}
            />
            <StatCard
              label="Monthly Repayment"
              value={currencyFormatter.format(result.stats.monthlyRepayment)}
              subtext="at current salary"
              accentColor={ACCENT}
            />
            <div className="col-span-2 sm:col-span-1">
              <StatCard
                label="Outcome"
                value={result.stats.writtenOff ? "Written off" : "Paid in full"}
                subtext={
                  result.stats.writtenOff
                    ? `${currencyFormatter.format(result.balanceSeries[result.balanceSeries.length - 1]?.balance ?? 0)} forgiven`
                    : undefined
                }
                accentColor={ACCENT}
              />
            </div>
          </div>

          <div className="h-65 sm:h-75 md:h-85">
            <CumulativeRepaidChart
              data={result.cumulativeRepaid}
              writeOffMonth={result.stats.writeOffMonth}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <div className="col-span-2 sm:col-span-1">
              <StatCardSkeleton />
            </div>
          </div>
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </>
      )}
    </DetailPageShell>
  );
}
