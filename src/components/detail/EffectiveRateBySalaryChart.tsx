"use client";

import { useDeferredValue } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import type { EffectiveRateSalaryResult } from "@/workers/simulation.worker";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  currencyFormatter,
  percentageFormatter,
  MIN_SALARY,
  MAX_SALARY,
} from "@/constants";
import { findClosestBySalary } from "@/lib/utils";

const chartConfig = {
  effectiveRate: {
    label: "Effective Rate",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface EffectiveRateBySalaryChartProps {
  data: EffectiveRateSalaryResult["data"];
  boeRate: number;
  annotationSalary: number | undefined;
}

export function EffectiveRateBySalaryChart({
  data,
  boeRate,
  annotationSalary,
}: EffectiveRateBySalaryChartProps) {
  const deferredSalary = useDeferredValue(annotationSalary);

  if (data.length === 0) {
    return (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading effective rate chart"
      />
    );
  }

  const closestPoint =
    deferredSalary !== undefined
      ? findClosestBySalary(data, deferredSalary)
      : undefined;

  const annotations =
    deferredSalary !== undefined && closestPoint
      ? [
          {
            x: deferredSalary,
            y: closestPoint.effectiveRate,
            label: percentageFormatter(closestPoint.effectiveRate),
            bottomLabel: currencyFormatter.format(deferredSalary),
            color: "var(--chart-4)",
          },
        ]
      : [];

  const horizontalAnnotations = [
    {
      y: boeRate,
      label: `BoE base ${percentageFormatter(boeRate)}`,
      color: "var(--muted-foreground)",
      strokeDasharray: "6 4",
    },
  ];

  return (
    <ChartBase
      type="line"
      data={data}
      xDataKey="salary"
      xFormatter={(v) => currencyFormatter.format(v)}
      yFormatter={percentageFormatter}
      ariaLabel="Effective annual rate of student loan by salary"
      chartConfig={chartConfig}
      series={[{ dataKey: "effectiveRate" }]}
      interactionMode="none"
      annotations={annotations}
      horizontalAnnotations={horizontalAnnotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
      margin={{ top: 25, right: 25, bottom: 8, left: 25 }}
    />
  );
}
