"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { DETAIL_PAGE_COLOR } from "@/lib/detailPages";
import { DetailPageShell } from "./DetailPageShell";
import { AnnualInterestChart } from "./InterestBreakdownChart";
import {
  InterestHeroStats,
  InterestHeroStatsSkeleton,
} from "./InterestHeroStats";

const ACCENT = DETAIL_PAGE_COLOR["/interest"];

function getChartCaption(
  annualBreakdown: { year: number; principalPortion: number }[],
  writtenOff: boolean,
): string {
  const firstGreenYear = annualBreakdown.find(
    (r) => r.principalPortion > 0,
  )?.year;

  if (!firstGreenYear) {
    return "Your repayments never exceeded the monthly interest — the outstanding balance is cleared at write-off.";
  }
  if (firstGreenYear === 1) {
    return "Your repayments covered the interest every year — you were always reducing your balance.";
  }
  if (writtenOff) {
    return `You start reducing your balance in year ${String(firstGreenYear)}, but the loan is written off before it's fully repaid.`;
  }
  return `You start reducing your balance in year ${String(firstGreenYear)}, once your salary grows past the monthly interest charge.`;
}

export function InterestDetailPage() {
  const result = useDetailSeriesData();

  return (
    <DetailPageShell
      heading="Interest Breakdown"
      description="Understand how much of your repayments go towards interest vs reducing your loan balance."
    >
      {result ? (
        <div className="space-y-2">
          <InterestHeroStats
            totalInterestPaid={currencyFormatter.format(
              result.stats.totalInterestPaid,
            )}
            totalPrincipalPaid={
              result.stats.writtenOff || result.stats.totalPrincipalPaid <= 0
                ? ""
                : currencyFormatter.format(result.stats.totalPrincipalPaid)
            }
            interestPct={Math.round(result.stats.interestRatio * 100)}
            writtenOff={result.stats.writtenOff}
            payoffYears={Math.round(result.stats.monthsToPayoff / 12)}
            attributedInterestPaid={currencyFormatter.format(
              result.stats.attributedInterestPaid,
            )}
            accentColor={ACCENT}
          />
          <figure className="space-y-2">
            <div className="h-65 sm:h-75 md:h-85">
              <AnnualInterestChart data={result.annualBreakdown} />
            </div>
            <figcaption className="text-center text-xs text-muted-foreground">
              {getChartCaption(result.annualBreakdown, result.stats.writtenOff)}
            </figcaption>
          </figure>
        </div>
      ) : (
        <div className="space-y-3">
          <InterestHeroStatsSkeleton />
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
