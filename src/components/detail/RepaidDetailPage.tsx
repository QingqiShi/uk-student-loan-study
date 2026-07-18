"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { CumulativeRepaidChart } from "./CumulativeRepaidChart";
import { DetailPageShell } from "./DetailPageShell";
import { RepaidHeroStats, RepaidHeroStatsSkeleton } from "./RepaidHeroStats";

export function RepaidDetailPage() {
  const result = useDetailSeriesData();
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

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
        <div className="space-y-6">
          <RepaidHeroStats
            totalRepaid={currencyFormatter.format(result.stats.totalPaid)}
            monthlyRepayment={currencyFormatter.format(
              result.stats.monthlyRepayment,
            )}
            writtenOff={result.stats.writtenOff}
            payoffYears={payoffYears}
            aheadOfSchedule={payoffYears <= 15 && !result.stats.writtenOff}
            sparkline={result.cumulativeRepaid.map((d) => ({
              month: d.month,
              value: d.cumulative,
            }))}
          />

          <ChartFrame
            caption={`Fig. 1 — Lifetime repaid · ${planName}`}
            figure={`Total ${formatGBP(Math.round(result.stats.totalPaid))}`}
            legend={[
              { label: "Cumulative repaid", color: "var(--chart-1)" },
              ...(result.stats.writeOffMonth !== null
                ? [
                    {
                      label: "Written off",
                      color: "var(--muted-foreground)",
                      variant: "dash" as const,
                    },
                  ]
                : []),
            ]}
            bodyClassName="h-65 sm:h-75 md:h-85"
          >
            <CumulativeRepaidChart
              data={result.cumulativeRepaid}
              writeOffMonth={result.stats.writeOffMonth}
            />
          </ChartFrame>

          <p className="max-w-prose text-sm text-muted-foreground">
            {getInsightText()}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <RepaidHeroStatsSkeleton />
          <Skeleton className="h-65 rounded-xl sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
