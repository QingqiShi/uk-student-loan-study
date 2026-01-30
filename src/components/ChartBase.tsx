"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
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
import { MIN_SALARY, MAX_SALARY } from "@/constants";
import type { ChartBaseProps } from "@/types";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartBase({
  data,
  xAxisLabel,
  yAxisLabel,
  xFormatter,
  yFormatter,
  annotationSalary,
  annotationValue,
  ariaLabel,
}: ChartBaseProps) {
  const gradientId = useId();
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  // Calculate label offset to avoid edge clipping
  // Left side (<25%): push right; Right side (>75%): push left
  const getAnnotationLabelOffset = () => {
    if (annotationSalary === undefined) return 0;
    const position =
      (annotationSalary - MIN_SALARY) / (MAX_SALARY - MIN_SALARY);
    if (position < 0.25) return 35; // Push right
    if (position > 0.75) return -35; // Push left
    return 0;
  };

  return (
    <div
      role="img"
      aria-label={ariaLabel || `Chart showing ${yAxisLabel} by ${xAxisLabel}`}
      className="h-full w-full overflow-hidden select-none touch-pinch-zoom"
      onMouseEnter={() => setIsTooltipActive(true)}
      onMouseLeave={() => setIsTooltipActive(false)}
      onTouchStart={() => setIsTooltipActive(true)}
      onTouchEnd={() => setIsTooltipActive(false)}
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
            type="number"
            domain={["dataMin", "dataMax"]}
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
            active={isTooltipActive}
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
            activeDot={isTooltipActive}
          />
          {annotationSalary !== undefined &&
            annotationValue !== undefined &&
            !isTooltipActive && (
              <ReferenceLine
                x={annotationSalary}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                label={{
                  value: yFormatter(annotationValue),
                  position: "insideTop",
                  fill: "rgba(255, 255, 255, 0.9)",
                  fontSize: 11,
                  fontWeight: 500,
                  dx: getAnnotationLabelOffset(),
                }}
              />
            )}
          {annotationSalary !== undefined &&
            annotationValue !== undefined &&
            !isTooltipActive && (
              <ReferenceDot
                x={annotationSalary}
                y={annotationValue}
                r={4}
                fill="var(--color-value)"
              />
            )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
