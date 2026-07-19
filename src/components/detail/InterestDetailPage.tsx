"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import type { ChartLegendItem } from "@/components/instrument/ChartFrame";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { DetailPageShell } from "./DetailPageShell";
import { AnnualInterestChart } from "./InterestBreakdownChart";
import {
  InterestHeroStats,
  InterestHeroStatsSkeleton,
} from "./InterestHeroStats";

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
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

  const legend: ChartLegendItem[] = result
    ? [
        { label: "Principal", color: "var(--chart-principal)" },
        { label: "Interest", color: "var(--signal)" },
      ]
    : [];

  return (
    <DetailPageShell
      heading="Interest Breakdown"
      description="Understand how much of your repayments go towards interest vs reducing your loan balance."
    >
      {result ? (
        <div className="space-y-6">
          <InterestHeroStats
            totalInterestPaid={currencyFormatter.format(
              result.stats.totalInterestPaid,
            )}
            principalPaid={
              result.stats.writtenOff || result.stats.totalPrincipalPaid <= 0
                ? ""
                : currencyFormatter.format(result.stats.totalPrincipalPaid)
            }
            interestPct={Math.round(result.stats.interestRatio * 100)}
            writtenOff={result.stats.writtenOff}
            attributedInterestPaid={currencyFormatter.format(
              result.stats.attributedInterestPaid,
            )}
          />

          <ChartFrame
            caption={`Fig. 1 — Interest vs principal each year · ${planName}`}
            figure={`Interest ${formatGBP(Math.round(result.stats.totalInterestPaid))}`}
            figureTone="cost"
            legend={legend}
            bodyClassName="h-65 sm:h-75 md:h-85"
          >
            <AnnualInterestChart data={result.annualBreakdown} />
          </ChartFrame>

          <div className="max-w-prose space-y-2 text-sm text-muted-foreground">
            <p>
              {getChartCaption(result.annualBreakdown, result.stats.writtenOff)}
            </p>
            {result.stats.writtenOff && (
              <p>
                You were charged{" "}
                {currencyFormatter.format(result.stats.attributedInterestPaid)}{" "}
                in interest. When the loan is written off, the cleared balance
                is treated as a final principal repayment, so the adjusted
                figure above counts only what you repaid on top of your original
                loan.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <InterestHeroStatsSkeleton />
          <Skeleton className="h-65 rounded-xl sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
