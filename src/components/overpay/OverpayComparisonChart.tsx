"use client";

import { useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { OverpayAnalysisResult } from "@/lib/loans";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { currencyFormatter } from "@/constants";

const chartConfig = {
  overpayNetWorth: {
    label: "Overpay",
    color: "var(--chart-1)",
  },
  investNetWorth: {
    label: "Invest",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface OverpayComparisonChartProps {
  analysis: OverpayAnalysisResult;
}

export function OverpayComparisonChart({
  analysis,
}: OverpayComparisonChartProps) {
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  const { netWorthTimeSeries, writeOffMonth, crossoverMonth } = analysis;

  // Sample data to reduce chart complexity (every 12 months)
  const sampledData = netWorthTimeSeries.filter(
    (_, index) => index % 12 === 0 || index === netWorthTimeSeries.length - 1,
  );

  if (sampledData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Enter an overpayment amount to see the comparison
      </div>
    );
  }

  const formatYear = (month: number) => `Year ${String(Math.floor(month / 12))}`;

  return (
    <div
      role="img"
      aria-label="Net worth comparison chart showing overpay vs invest scenarios over time"
      className="h-full w-full overflow-hidden select-none touch-pinch-zoom"
      onMouseEnter={() => { setIsTooltipActive(true); }}
      onMouseLeave={() => { setIsTooltipActive(false); }}
      onTouchStart={() => { setIsTooltipActive(true); }}
      onTouchEnd={() => { setIsTooltipActive(false); }}
    >
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart
          data={sampledData}
          accessibilityLayer
          margin={{ top: 5, right: 5, bottom: 25, left: 25 }}
        >
          <CartesianGrid vertical={false} className="stroke-border/50" />
          <XAxis
            dataKey="month"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatYear}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: "Time",
              position: "bottom",
              offset: 5,
              className: "fill-muted-foreground text-xs",
            }}
          />
          <YAxis
            tickFormatter={(value: number) => currencyFormatter.format(value)}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: "Net Worth",
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
                  const firstItem = payload[0] as
                    | { payload: { month: number } }
                    | undefined;
                  if (firstItem) {
                    return formatYear(firstItem.payload.month);
                  }
                  return "";
                }}
                formatter={(value, name) => [
                  currencyFormatter.format(value as number),
                  name === "overpayNetWorth" ? "Overpay" : "Invest",
                ]}
              />
            }
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) =>
              value === "overpayNetWorth" ? "Overpay" : "Invest"
            }
          />
          <Line
            dataKey="overpayNetWorth"
            type="monotone"
            stroke="var(--color-overpayNetWorth)"
            strokeWidth={2}
            dot={false}
            activeDot={isTooltipActive ? { r: 4 } : false}
          />
          <Line
            dataKey="investNetWorth"
            type="monotone"
            stroke="var(--color-investNetWorth)"
            strokeWidth={2}
            dot={false}
            activeDot={isTooltipActive ? { r: 4 } : false}
          />
          {writeOffMonth && !isTooltipActive && (
            <ReferenceLine
              x={writeOffMonth}
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              label={{
                value: "Write-off",
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
          )}
          {crossoverMonth && !isTooltipActive && (
            <ReferenceLine
              x={crossoverMonth}
              stroke="var(--chart-4)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: "Crossover",
                position: "insideTopLeft",
                fill: "var(--chart-4)",
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default OverpayComparisonChart;
