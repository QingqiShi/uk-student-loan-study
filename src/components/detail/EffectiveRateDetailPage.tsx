"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { MIN_SALARY, MAX_SALARY, percentageFormatter } from "@/constants";
import { useEffectiveRateBySalaryData } from "@/hooks/useDetailData";
import { useCurrentSalary, useLoanConfig } from "@/hooks/useStoreSelectors";
import { FOLD_CHART_BODY } from "@/lib/layout";
import { findClosestBySalary } from "@/lib/utils";
import { DetailPageShell } from "./DetailPageShell";
import { EffectiveRateBySalaryChart } from "./EffectiveRateBySalaryChart";
import { FoldAnswer, FoldAnswerSkeleton } from "./FoldAnswer";

export function EffectiveRateDetailPage() {
  const salaryResult = useEffectiveRateBySalaryData();
  const salary = useCurrentSalary();
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

  const boeRate = salaryResult?.boeRate ?? 0;

  const closestPoint =
    salaryResult && salaryResult.data.length > 0
      ? findClosestBySalary(salaryResult.data, salary)
      : null;

  const effectiveRate = closestPoint?.effectiveRate ?? 0;

  const annotationSalary =
    salary >= MIN_SALARY && salary <= MAX_SALARY ? salary : undefined;

  return (
    <DetailPageShell
      heading="Effective rate"
      description="Compare your loan's effective annual rate to the Bank of England base rate across different salaries."
      answer={
        salaryResult ? (
          <FoldAnswer
            figure={percentageFormatter(effectiveRate)}
            claim="The effective rate accounts for write-offs — lower earners pay less because more of their balance is written off."
          />
        ) : (
          <FoldAnswerSkeleton />
        )
      }
      chart={
        salaryResult ? (
          <ChartFrame
            fill
            bodyClassName={FOLD_CHART_BODY}
            caption={`Fig. 1 — Effective rate by salary · ${planName}`}
            figure={`You ${percentageFormatter(effectiveRate)}`}
            legend={[
              { label: "Effective rate", color: "var(--chart-4)" },
              {
                label: `BoE base ${percentageFormatter(boeRate)}`,
                color: "var(--muted-foreground)",
                variant: "dash",
              },
            ]}
          >
            <EffectiveRateBySalaryChart
              data={salaryResult.data}
              boeRate={salaryResult.boeRate}
              annotationSalary={annotationSalary}
            />
          </ChartFrame>
        ) : null
      }
    />
  );
}
