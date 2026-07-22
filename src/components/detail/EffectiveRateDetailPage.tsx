"use client";

import { primaryPlanName } from "@/components/home/instrument/planInfo";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { Skeleton } from "@/components/ui/skeleton";
import { MIN_SALARY, MAX_SALARY, percentageFormatter } from "@/constants";
import { useEffectiveRateBySalaryData } from "@/hooks/useDetailData";
import { useCurrentSalary, useLoanConfig } from "@/hooks/useStoreSelectors";
import { findClosestBySalary } from "@/lib/utils";
import { DetailPageShell } from "./DetailPageShell";
import { EffectiveRateBySalaryChart } from "./EffectiveRateBySalaryChart";

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
  const diff = effectiveRate - boeRate;
  const isBelow = diff < 0;

  const annotationSalary =
    salary >= MIN_SALARY && salary <= MAX_SALARY ? salary : undefined;

  return (
    <DetailPageShell
      heading="The Effective Rate of Your Loan"
      description="Compare your loan's effective annual rate to the Bank of England base rate across different salaries."
    >
      {salaryResult ? (
        <div className="space-y-6">
          <MetricReadout columns={3} className="animate-timeline-enter">
            <MetricCell
              label="Effective rate · your salary"
              value={percentageFormatter(effectiveRate)}
              tone="emphasis"
            />
            <MetricCell
              label="BoE base rate"
              value={percentageFormatter(boeRate)}
            />
            <MetricCell
              label="vs base rate"
              value={`${diff >= 0 ? "+" : ""}${percentageFormatter(diff)}`}
              tone={isBelow ? "default" : "cost"}
            >
              <span className="text-xs text-muted-foreground">
                {isBelow ? "below base rate" : "above base rate"}
              </span>
            </MetricCell>
          </MetricReadout>

          <ChartFrame
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
            bodyClassName="h-65 sm:h-75 md:h-85"
          >
            <EffectiveRateBySalaryChart
              data={salaryResult.data}
              boeRate={salaryResult.boeRate}
              annotationSalary={annotationSalary}
            />
          </ChartFrame>

          <p className="max-w-prose text-sm text-muted-foreground">
            The effective rate accounts for write-offs — lower earners pay less
            because more of their balance is written off.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <MetricReadout columns={3}>
            <MetricCell
              label="Effective rate · your salary"
              loading
              tone="emphasis"
            />
            <MetricCell label="BoE base rate" loading />
            <MetricCell label="vs base rate" loading />
          </MetricReadout>
          <Skeleton className="h-65 rounded-xl sm:h-75 md:h-85" />
        </div>
      )}
    </DetailPageShell>
  );
}
