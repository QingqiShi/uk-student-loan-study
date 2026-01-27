"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartBaseProps } from "@/types";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBase({
  data,
  xAxisLabel,
  yAxisLabel,
  xFormatter,
  yFormatter,
  annotationSalary,
  ariaLabel,
}: ChartBaseProps) {
  const gradientId = useId();

  return (
    <div
      role="img"
      aria-label={ariaLabel || `Chart showing ${yAxisLabel} by ${xAxisLabel}`}
      className="h-full w-full overflow-hidden"
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={data}
          accessibilityLayer
          margin={{ top: 5, right: 5, bottom: 25, left: 25 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-value)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-value)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} className="stroke-border/50" />
          <XAxis
            dataKey="salary"
            tickFormatter={xFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: xAxisLabel,
              position: "bottom",
              offset: 5,
              className: "fill-muted-foreground text-xs",
            }}
          />
          <YAxis
            tickFormatter={yFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "left",
              offset: 10,
              className: "fill-muted-foreground text-xs",
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  if (payload?.[0]) {
                    return `${xAxisLabel}: ${xFormatter(payload[0].payload.salary)}`;
                  }
                  return "";
                }}
                formatter={(value) => [yFormatter(value as number), yAxisLabel]}
              />
            }
          />
          <Area
            dataKey="value"
            type="natural"
            fill={`url(#${gradientId})`}
            stroke="var(--color-value)"
            strokeWidth={2}
          />
          {annotationSalary !== undefined && (
            <ReferenceLine
              x={annotationSalary}
              stroke="hsl(var(--foreground))"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
