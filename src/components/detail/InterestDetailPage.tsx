"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import type { ChartLegendItem } from "@/components/instrument/ChartFrame";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { FOLD_CHART_BODY } from "@/lib/layout";
import { DetailPageShell } from "./DetailPageShell";
import { FoldAnswer, FoldAnswerSkeleton } from "./FoldAnswer";
import { AnnualInterestChart } from "./InterestBreakdownChart";

function getClaimText(
  annualBreakdown: { year: number; principalPortion: number }[],
  writtenOff: boolean,
): string {
  const firstGreenYear = annualBreakdown.find(
    (r) => r.principalPortion > 0,
  )?.year;

  if (!firstGreenYear) {
    return "Your repayments never exceeded the monthly interest — the remaining balance is written off.";
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
      heading="Interest paid"
      description="Understand how much of your repayments go towards interest vs reducing your loan balance."
      answer={
        result ? (
          <FoldAnswer
            figure={currencyFormatter.format(result.stats.totalInterestPaid)}
            tone="cost"
            claim={getClaimText(
              result.annualBreakdown,
              result.stats.writtenOff,
            )}
            note={
              result.stats.writtenOff && (
                <p>
                  You were charged{" "}
                  {currencyFormatter.format(
                    result.stats.attributedInterestPaid,
                  )}{" "}
                  in interest. When the loan is written off, the remaining
                  balance is treated as a final principal repayment, so the
                  adjusted figure above counts only what you repaid on top of
                  your original loan.
                </p>
              )
            }
          />
        ) : (
          <FoldAnswerSkeleton />
        )
      }
      chart={
        result ? (
          <ChartFrame
            fill
            bodyClassName={FOLD_CHART_BODY}
            caption={`Fig. 1 — Interest vs principal each year · ${planName}`}
            figure={`Interest ${formatGBP(Math.round(result.stats.totalInterestPaid))}`}
            figureTone="cost"
            legend={legend}
          >
            <AnnualInterestChart data={result.annualBreakdown} />
          </ChartFrame>
        ) : null
      }
    />
  );
}
