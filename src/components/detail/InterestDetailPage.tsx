"use client";

import { DetailPageShell } from "./DetailPageShell";
import { InterestBreakdownChart } from "./InterestBreakdownChart";
import { StatCard, StatCardSkeleton } from "./StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { DETAIL_PAGE_COLOR } from "@/lib/detail-pages";

const ACCENT = DETAIL_PAGE_COLOR["/interest"];

function ProportionBar({ interestRatio }: { interestRatio: number }) {
  return (
    <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
      <div
        className="flex h-4 overflow-hidden rounded-full"
        role="img"
        aria-label={`Interest is ${String(Math.round(interestRatio * 100))}% of total repayments`}
      >
        <div
          className="rounded-l-full transition-all duration-500"
          style={{
            width: `${String(Math.max(interestRatio * 100, 2))}%`,
            backgroundColor: ACCENT,
          }}
        />
        <div className="flex-1 bg-muted" />
      </div>
      <div className="mt-2 flex justify-between text-sm text-muted-foreground">
        <span>{String(Math.round(interestRatio * 100))}% interest</span>
        <span>{String(Math.round((1 - interestRatio) * 100))}% principal</span>
      </div>
    </div>
  );
}

export function InterestDetailPage() {
  const result = useDetailSeriesData();

  const costMultiplier = result
    ? result.stats.totalPaid / result.stats.initialBalance
    : 0;

  return (
    <DetailPageShell
      pageTitle="Interest Paid"
      heading="Interest Breakdown"
      description="Understand how much of your repayments go towards interest vs reducing your loan balance."
    >
      {result ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Interest"
              value={currencyFormatter.format(result.stats.totalInterest)}
              accentColor={ACCENT}
            />
            <StatCard
              label="Interest Ratio"
              value={`${String(Math.round(result.stats.interestRatio * 100))}%`}
              subtext="of total repayments"
              accentColor={ACCENT}
            />
            <div className="col-span-2 sm:col-span-1">
              <StatCard
                label="Total Cost"
                value={currencyFormatter.format(result.stats.totalPaid)}
                subtext={`${costMultiplier.toFixed(1)}x your original loan`}
                accentColor={ACCENT}
              />
            </div>
          </div>

          <ProportionBar interestRatio={result.stats.interestRatio} />

          <div className="space-y-2">
            <div className="h-65 sm:h-75 md:h-85">
              <InterestBreakdownChart data={result.interestBreakdown} />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              The stacked areas show how your payments split between interest
              and principal reduction over time.
            </p>
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
          <Skeleton className="h-12" />
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </>
      )}
    </DetailPageShell>
  );
}
