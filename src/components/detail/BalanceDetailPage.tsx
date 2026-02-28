"use client";

import { BalanceDetailChart } from "./BalanceDetailChart";
import { DetailPageShell } from "./DetailPageShell";
import { StatCard, StatCardSkeleton } from "./StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";

export function BalanceDetailPage() {
  const result = useDetailSeriesData();

  const peakYear = result ? Math.round(result.stats.peakBalanceMonth / 12) : 0;
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

  function getPayoffSubtext() {
    if (!result) return "";
    if (result.stats.writtenOff) {
      const forgiven =
        result.balanceSeries[result.balanceSeries.length - 1].balance;
      return `Written off — ${currencyFormatter.format(forgiven)} forgiven`;
    }
    return payoffYears <= 15
      ? "Paid in full — ahead of schedule"
      : "Paid in full";
  }

  return (
    <DetailPageShell
      pageTitle="Balance Over Time"
      heading="Balance Trajectory"
      description="See how your loan balance changes over time as interest accrues and repayments are made."
    >
      {result ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              label="Starting Balance"
              value={currencyFormatter.format(result.stats.initialBalance)}
              accentColor="var(--chart-2)"
            />
            <StatCard
              label="Peak Balance"
              value={currencyFormatter.format(result.stats.peakBalance)}
              subtext={
                result.stats.peakBalanceMonth > 0
                  ? `at year ${String(peakYear)}`
                  : "at start"
              }
              accentColor="var(--chart-3)"
            />
            <div className="col-span-2 sm:col-span-1">
              <StatCard
                label="Payoff"
                value={`${String(payoffYears)} years`}
                subtext={getPayoffSubtext()}
                accentColor={
                  result.stats.writtenOff ? "var(--chart-5)" : "var(--chart-1)"
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-65 sm:h-75 md:h-85">
              <BalanceDetailChart
                data={result.balanceSeries}
                peakBalanceMonth={result.stats.peakBalanceMonth}
                peakBalance={result.stats.peakBalance}
                writeOffMonth={result.stats.writeOffMonth}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {getInsightText()}
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
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </>
      )}
    </DetailPageShell>
  );
}
