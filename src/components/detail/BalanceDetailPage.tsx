"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import type { ChartLegendItem } from "@/components/instrument/ChartFrame";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { FOLD_CHART_BODY } from "@/lib/layout";
import { BalanceDetailChart } from "./BalanceDetailChart";
import { DetailPageShell } from "./DetailPageShell";
import { FoldAnswer, FoldAnswerSkeleton } from "./FoldAnswer";
import { OutcomeBadge } from "./OutcomeBadge";

export function BalanceDetailPage() {
  const result = useDetailSeriesData();
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

  const payoffYears = result ? Math.round(result.stats.monthsToPayoff / 12) : 0;

  function getClaimText() {
    if (!result) return null;
    const { peakBalanceMonth, writtenOff, peakBalance, initialBalance } =
      result.stats;

    const peakYears = Math.round(peakBalanceMonth / 12);

    if (peakBalanceMonth === 0) {
      return writtenOff
        ? `Your repayments exceed interest from day one. You'll have remaining balance written off after ${String(payoffYears)} years.`
        : `Your repayments exceed interest from day one. You'll pay it off in full in ${String(payoffYears)} years.`;
    }

    if (writtenOff) {
      const peakPct =
        initialBalance > 0
          ? Math.round(((peakBalance - initialBalance) / initialBalance) * 100)
          : 0;
      return `Interest outpaces repayments for the first ${String(peakYears)} years, pushing your balance ${String(peakPct)}% above what you borrowed. The remaining balance is written off after ${String(payoffYears)} years.`;
    }

    return `Interest outpaces repayments for the first ${String(peakYears)} years. After that, your growing salary tips the balance and you pay off the loan in ${String(payoffYears)} years.`;
  }

  const legend: ChartLegendItem[] = result
    ? [
        { label: "Balance", color: "var(--chart-1)" },
        ...(result.stats.peakBalanceMonth > 0
          ? [
              {
                label: "Peak balance",
                color: "var(--signal)",
                variant: "dash" as const,
              },
            ]
          : []),
        ...(result.stats.writeOffMonth !== null
          ? [
              {
                label: "Written off",
                color: "var(--muted-foreground)",
                variant: "dash" as const,
              },
            ]
          : []),
      ]
    : [];

  return (
    <DetailPageShell
      heading="Payoff timeline"
      description="See when you'll pay off your student loan and how your balance changes over time."
      answer={
        result ? (
          <FoldAnswer
            figure={`${String(payoffYears)} years`}
            badge={
              <OutcomeBadge
                conditions={[
                  {
                    when: result.stats.writtenOff,
                    label: "Written off",
                    variant: "warning",
                  },
                  {
                    when: payoffYears <= 15,
                    label: "Ahead of schedule",
                    variant: "success",
                  },
                  { when: true, label: "Paid off", variant: "success" },
                ]}
              />
            }
            claim={getClaimText()}
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
            caption={`Fig. 1: Balance over time · ${planName}`}
            figure={`Peak ${formatGBP(Math.round(result.stats.peakBalance))}`}
            figureTone="cost"
            legend={legend}
          >
            <BalanceDetailChart
              data={result.balanceSeries}
              peakBalanceMonth={result.stats.peakBalanceMonth}
              peakBalance={result.stats.peakBalance}
              writeOffMonth={result.stats.writeOffMonth}
            />
          </ChartFrame>
        ) : null
      }
    />
  );
}
