"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { currencyFormatter } from "@/constants";
import { useDetailSeriesData } from "@/hooks/useDetailData";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { FOLD_CHART_BODY } from "@/lib/layout";
import { CumulativeRepaidChart } from "./CumulativeRepaidChart";
import { DetailPageShell } from "./DetailPageShell";
import { FoldAnswer, FoldAnswerSkeleton } from "./FoldAnswer";
import { OutcomeBadge } from "./OutcomeBadge";

/** Below this the two are the same number to the reader, and a signed difference would be noise. */
const LEVEL_TOLERANCE_GBP = 1;

export function RepaidDetailPage() {
  const result = useDetailSeriesData();
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

  const payoffYears = result ? Math.round(result.stats.monthsToPayoff / 12) : 0;

  /**
   * The page's claim, and the site's thesis in one line: what you repay measured
   * against what you borrowed.
   *
   * Stated as a comparison only, with no cause attached to a shortfall. Present
   * value discounts the total but not the balance it is compared against, so an
   * "adjust for inflation" reader can land below what they borrowed on a loan
   * that was paid off in full — a sentence blaming the write-off would be wrong
   * for them.
   */
  function getClaim() {
    if (!result) return null;
    const borrowed = result.stats.initialBalance;
    const difference = result.stats.totalPaid - borrowed;
    const formattedBorrowed = currencyFormatter.format(borrowed);

    if (Math.abs(difference) < LEVEL_TOLERANCE_GBP) {
      return `That's almost exactly the ${formattedBorrowed} you borrowed.`;
    }

    return `That's ${currencyFormatter.format(Math.abs(difference))} ${
      difference > 0 ? "more" : "less"
    } than the ${formattedBorrowed} you borrowed.`;
  }

  function getNoteText() {
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
      heading="Total repaid"
      description="Track how much you'll repay on your student loan over time."
      answer={
        result ? (
          <FoldAnswer
            figure={currencyFormatter.format(result.stats.totalPaid)}
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
            claim={getClaim()}
            note={<p>{getNoteText()}</p>}
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
          >
            <CumulativeRepaidChart
              data={result.cumulativeRepaid}
              writeOffMonth={result.stats.writeOffMonth}
            />
          </ChartFrame>
        ) : null
      }
    />
  );
}
