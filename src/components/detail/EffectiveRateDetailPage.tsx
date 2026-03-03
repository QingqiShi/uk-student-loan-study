"use client";

import { DetailPageShell } from "./DetailPageShell";
import { EffectiveRateBySalaryChart } from "./EffectiveRateBySalaryChart";
import { StatCard, StatCardSkeleton } from "./StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { MIN_SALARY, MAX_SALARY, percentageFormatter } from "@/constants";
import { useEffectiveRateBySalaryData } from "@/hooks/useDetailData";
import { useCurrentSalary } from "@/hooks/useStoreSelectors";
import { DETAIL_PAGE_COLOR } from "@/lib/detailPages";
import { findClosestBySalary } from "@/lib/utils";

const ACCENT = DETAIL_PAGE_COLOR["/effective-rate"];

export function EffectiveRateDetailPage() {
  const salaryResult = useEffectiveRateBySalaryData();
  const salary = useCurrentSalary();

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
      heading="True Cost of Your Loan"
      description="Compare your loan's effective annual rate to the Bank of England base rate across different salaries."
    >
      {salaryResult ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Effective Rate"
              value={percentageFormatter(effectiveRate)}
              subtext="at your salary"
              accentColor={ACCENT}
            />
            <StatCard
              label="vs BoE"
              value={`${diff >= 0 ? "+" : ""}${percentageFormatter(diff)}`}
              subtext={`BoE ${percentageFormatter(boeRate)} · ${isBelow ? "below" : "above"} base rate`}
              accentColor={isBelow ? "var(--chart-5)" : "var(--chart-3)"}
            />
          </div>

          <div className="space-y-2">
            <div className="h-65 sm:h-75 md:h-85">
              <EffectiveRateBySalaryChart
                data={salaryResult.data}
                boeRate={salaryResult.boeRate}
                annotationSalary={annotationSalary}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              The effective rate accounts for write-offs — lower earners pay
              less because more of their debt is forgiven.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <Skeleton className="h-65 sm:h-75 md:h-85" />
        </>
      )}
    </DetailPageShell>
  );
}
