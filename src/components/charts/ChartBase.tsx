"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface ChartSeriesConfig {
  dataKey: string;
}

export interface ChartAnnotationConfig {
  x: number;
  y?: number;
  label: string;
  color?: string;
  labelPosition?: "insideTop" | "insideTopLeft" | "insideTopRight";
  strokeDasharray?: string;
}

export interface ChartBaseProps {
  type: "area" | "line";
  data: object[];
  xDataKey: string;
  xLabel?: string;
  xFormatter: (value: number) => string;
  yLabel?: string;
  yFormatter: (value: number) => string;
  ariaLabel: string;
  chartConfig: ChartConfig;
  series: ChartSeriesConfig[];
  annotations?: ChartAnnotationConfig[];
  showLegend?: boolean;
  showTooltip?: boolean;
  xDomain?: [number, number];
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function ChartBase({
  type,
  data,
  xDataKey,
  xLabel,
  xFormatter,
  yLabel,
  yFormatter,
  ariaLabel,
  chartConfig,
  series,
  annotations = [],
  showLegend = false,
  showTooltip = true,
  xDomain,
  margin: marginProp,
}: ChartBaseProps) {
  const gradientId = useId();
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  const ChartComponent = type === "area" ? AreaChart : LineChart;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="size-full touch-pinch-zoom overflow-hidden select-none"
      {...(showTooltip
        ? {
            onMouseEnter: () => {
              setIsTooltipActive(true);
            },
            onMouseLeave: () => {
              setIsTooltipActive(false);
            },
            onTouchStart: () => {
              setIsTooltipActive(true);
            },
            onTouchEnd: () => {
              setIsTooltipActive(false);
            },
          }
        : {})}
    >
      <ChartContainer config={chartConfig} className="size-full">
        <ChartComponent
          data={data}
          accessibilityLayer
          margin={marginProp ?? { top: 25, right: 25, bottom: 25, left: 25 }}
        >
          {type === "area" && (
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.dataKey}
                  id={`${gradientId}-${s.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${s.dataKey})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${s.dataKey})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
          )}
          <CartesianGrid vertical={false} className="stroke-border/50" />
          <XAxis
            dataKey={xDataKey}
            type="number"
            domain={xDomain ?? ["dataMin", "dataMax"]}
            tickFormatter={xFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            {...(xLabel
              ? {
                  label: {
                    value: xLabel,
                    position: "bottom" as const,
                    offset: 5,
                    className: "fill-muted-foreground text-xs",
                  },
                }
              : {})}
          />
          <YAxis
            tickFormatter={yFormatter}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            {...(yLabel
              ? {
                  label: {
                    value: yLabel,
                    angle: -90,
                    position: "left" as const,
                    offset: 10,
                    className: "fill-muted-foreground text-xs",
                  },
                }
              : {})}
          />
          {showTooltip && (
            <ChartTooltip
              cursor={false}
              active={isTooltipActive}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const item = payload[0].payload as Record<string, unknown>;
                    if (xDataKey in item) {
                      const formatted = xFormatter(Number(item[xDataKey]));
                      return xLabel ? `${xLabel}: ${formatted}` : formatted;
                    }
                    return "";
                  }}
                  formatter={(value, name) => {
                    // name corresponds to series dataKey, which must exist in chartConfig
                    const label = chartConfig[name].label ?? String(name);
                    return [yFormatter(Number(value)), label];
                  }}
                />
              }
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => chartConfig[value].label ?? value}
            />
          )}
          {type === "area" &&
            series.map((s) => (
              <Area
                key={s.dataKey}
                dataKey={s.dataKey}
                type="linear"
                fill={`url(#${gradientId}-${s.dataKey})`}
                stroke={`var(--color-${s.dataKey})`}
                strokeWidth={2}
                activeDot={isTooltipActive}
                isAnimationActive={false}
              />
            ))}
          {type === "line" &&
            series.map((s) => (
              <Line
                key={s.dataKey}
                dataKey={s.dataKey}
                type="linear"
                stroke={`var(--color-${s.dataKey})`}
                strokeWidth={2}
                dot={false}
                activeDot={isTooltipActive ? { r: 4 } : false}
                isAnimationActive={false}
              />
            ))}
          {!isTooltipActive &&
            annotations.map((annotation) => (
              <ReferenceLine
                key={`line-${String(annotation.x)}-${annotation.label}`}
                x={annotation.x}
                stroke={annotation.color ?? "var(--muted-foreground)"}
                strokeWidth={1.5}
                strokeDasharray={annotation.strokeDasharray ?? "6 4"}
                label={{
                  value: annotation.label,
                  position: annotation.labelPosition ?? "insideTop",
                  fill: annotation.color ?? "var(--muted-foreground)",
                  fontSize: 11,
                  fontWeight: 500,
                  dy: -25,
                }}
              />
            ))}
          {!isTooltipActive &&
            annotations
              .filter((a) => a.y !== undefined)
              .map((annotation) => (
                <ReferenceDot
                  key={`dot-${String(annotation.x)}-${String(annotation.y)}`}
                  x={annotation.x}
                  y={annotation.y}
                  r={4}
                  fill={annotation.color ?? "var(--muted-foreground)"}
                />
              ))}
        </ChartComponent>
      </ChartContainer>
    </div>
  );
}
