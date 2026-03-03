"use client";

import { BalanceDetailChart } from "./BalanceDetailChart";
import { DetailPageShell } from "./DetailPageShell";
import { PayoffHeroStats, PayoffHeroStatsSkeleton } from "./PayoffHeroStats";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";

export function BalanceDetailPage() {
  const result = useDetailSeriesData();

  const payoffYears = result ? Math.round(result.stats.monthsToPayoff / 12) : 0;

  function getInsightText() {
    if (!result) return null;
    const { peakBalanceMonth, writtenOff, peakBalance, initialBalance } =
      result.stats;

    const peakYears = Math.round(peakBalanceMonth / 12);
    const peakPct = Math.round(
      ((peakBalance - initialBalance) / initialBalance) * 100,
    );

    if (peakBalanceMonth === 0) {
      return writtenOff
        ? `Your repayments exceed interest from day one. You'll have remaining balance written off after ${String(payoffYears)} years.`
        : `Your repayments exceed interest from day one. You'll pay it off in full in ${String(payoffYears)} years.`;
    }

    if (writtenOff) {
      return `Interest outpaces repayments for the first ${String(peakYears)} years, pushing your balance ${String(peakPct)}% above what you borrowed. The remaining balance is written off after ${String(payoffYears)} years.`;
    }

    return `Interest outpaces repayments for the first ${String(peakYears)} years. After that, your growing salary tips the balance and you pay off the loan in ${String(payoffYears)} years.`;
  }

  return (
    <DetailPageShell
      heading="Payoff Timeline"
      description="See when you'll pay off your student loan and how your balance changes over time."
    >
      {result ? (
        <div className="space-y-2">
          <PayoffHeroStats
            payoffYears={payoffYears}
            writtenOff={result.stats.writtenOff}
            totalWrittenOffAmount={
              result.stats.writtenOff
                ? currencyFormatter.format(result.stats.totalWrittenOff)
                : undefined
            }
            aheadOfSchedule={payoffYears <= 15 && !result.stats.writtenOff}
          />
          <figure className="space-y-2">
            <div className="h-65 sm:h-75 md:h-85">
              <BalanceDetailChart
                data={result.balanceSeries}
                peakBalanceMonth={result.stats.peakBalanceMonth}
                peakBalance={result.stats.peakBalance}
                writeOffMonth={result.stats.writeOffMonth}
              />
            </div>
            <figcaption className="text-center text-xs text-muted-foreground">
              {getInsightText()}
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className="space-y-3">
          <PayoffHeroStatsSkeleton />
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
