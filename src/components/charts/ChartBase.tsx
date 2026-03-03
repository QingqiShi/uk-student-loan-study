"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";

export interface ChartSeriesConfig {
  dataKey: string;
  stackId?: string;
}

export interface ChartAnnotationConfig {
  x: number;
  y?: number;
  label: string;
  /** Label shown at the bottom of the reference line (e.g. x-axis value) */
  bottomLabel?: string;
  color?: string;
  labelAnchor?: "start" | "end";
  labelOffsetY?: number;
  strokeDasharray?: string;
}

export interface HorizontalAnnotationConfig {
  y: number;
  label: string;
  color?: string;
  strokeDasharray?: string;
}

interface CrosshairPoint {
  x: number;
  values: Array<{ dataKey: string; y: number; stackedY: number }>;
}

export interface ChartBaseProps {
  type: "area" | "line" | "bar";
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
  horizontalAnnotations?: HorizontalAnnotationConfig[];
  showLegend?: boolean;
  interactionMode?: "crosshair" | "none";
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
  horizontalAnnotations = [],
  showLegend = false,
  interactionMode = "crosshair",
  xDomain,
  margin: marginProp,
}: ChartBaseProps) {
  const gradientId = useId();
  const [isActive, setIsActive] = useState(false);
  const [crosshairPoint, setCrosshairPoint] = useState<CrosshairPoint | null>(
    null,
  );

  const ChartComponent = type === "area" ? AreaChart : LineChart;
  const isCrosshair = interactionMode === "crosshair" && type !== "bar";

  // --- Bar chart: simple dedicated render path ---
  if (type === "bar") {
    const margin = marginProp ?? { top: 25, right: 25, bottom: 25, left: 25 };
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className="size-full overflow-hidden select-none"
      >
        <ChartContainer config={chartConfig} className="size-full">
          <BarChart data={data} accessibilityLayer margin={margin}>
            <CartesianGrid vertical={false} className="stroke-border/50" />
            <XAxis
              dataKey={xDataKey}
              tickFormatter={xFormatter}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={yFormatter}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const rawPayload = payload[0].payload as Record<
                  string,
                  unknown
                >;
                const year = Number(rawPayload[xDataKey]);
                const nonZero = payload.filter(
                  (item) => Number(item.value) !== 0,
                );
                return (
                  <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <p className="font-medium">{xFormatter(year)}</p>
                    <div className="grid gap-1.5">
                      {nonZero.map((item) => (
                        <div
                          key={String(item.dataKey)}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="size-2.5 shrink-0 rounded-[2px]"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">
                            {(chartConfig[String(item.dataKey)].label as
                              | string
                              | undefined) ?? String(item.dataKey ?? "")}
                          </span>
                          <span className="ml-auto pl-4 font-mono font-medium tabular-nums">
                            {yFormatter(Number(item.value))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            {showLegend && (
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => chartConfig[value].label ?? value}
              />
            )}
            {series.map((s) => {
              // Top segment in a stack gets rounded top corners
              const isTopInStack =
                s.stackId !== undefined
                  ? series.filter((x) => x.stackId === s.stackId).at(-1)
                      ?.dataKey === s.dataKey
                  : true;
              return (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  stackId={s.stackId}
                  fill={`var(--color-${s.dataKey})`}
                  radius={isTopInStack ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                  isAnimationActive={false}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  function handleChartMouseMove(state: {
    activePayload?: Array<{
      dataKey: string;
      value: number;
      payload: Record<string, unknown>;
    }>;
  }) {
    if (!isCrosshair || !state.activePayload?.length) {
      setCrosshairPoint(null);
      return;
    }
    const payload = state.activePayload;
    const xValue = Number(payload[0].payload[xDataKey]);
    const stackAccumulator: Record<string, number> = {};
    const values = series.map((s) => {
      const match = payload.find((p) => p.dataKey === s.dataKey);
      const y = match ? match.value : 0;
      if (s.stackId) {
        const acc = stackAccumulator[s.stackId] ?? 0;
        const stackedY = acc + y;
        stackAccumulator[s.stackId] = stackedY;
        return { dataKey: s.dataKey, y, stackedY };
      }
      return { dataKey: s.dataKey, y, stackedY: y };
    });
    setCrosshairPoint({ x: xValue, values });
  }

  function handleChartMouseLeave() {
    setCrosshairPoint(null);
  }

  const showCrosshair = isCrosshair && isActive && crosshairPoint !== null;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="size-full overflow-hidden select-none"
      {...(isCrosshair
        ? {
            onMouseEnter: () => {
              setIsActive(true);
            },
            onMouseLeave: () => {
              setIsActive(false);
            },
            onTouchStart: () => {
              setIsActive(true);
            },
            onTouchEnd: () => {
              setIsActive(false);
            },
          }
        : {})}
    >
      <ChartContainer config={chartConfig} className="size-full">
        <ChartComponent
          data={data}
          accessibilityLayer
          margin={marginProp ?? { top: 25, right: 25, bottom: 25, left: 25 }}
          onMouseMove={isCrosshair ? handleChartMouseMove : undefined}
          onMouseLeave={isCrosshair ? handleChartMouseLeave : undefined}
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
                  label: ({
                    viewBox,
                  }: {
                    viewBox: {
                      x: number;
                      y: number;
                      height: number;
                    };
                  }) => (
                    <text
                      x={viewBox.x - 10}
                      y={viewBox.y + viewBox.height / 2}
                      transform={`rotate(-90, ${String(viewBox.x - 10)}, ${String(viewBox.y + viewBox.height / 2)})`}
                      textAnchor="middle"
                      className="fill-muted-foreground text-xs"
                    >
                      {yLabel}
                    </text>
                  ),
                }
              : {})}
          />
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => chartConfig[value].label ?? value}
              wrapperStyle={
                showCrosshair ? { visibility: "hidden" } : undefined
              }
            />
          )}
          {isCrosshair && (
            <Tooltip
              content={() => null}
              isAnimationActive={false}
              cursor={false}
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
                activeDot={false}
                isAnimationActive={false}
                style={isCrosshair ? { touchAction: "none" } : undefined}
                {...(s.stackId ? { stackId: s.stackId } : {})}
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
                activeDot={false}
                isAnimationActive={false}
                style={isCrosshair ? { touchAction: "none" } : undefined}
              />
            ))}
          {showCrosshair && (
            <ReferenceLine
              x={crosshairPoint.x}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="6 4"
              label={({ viewBox }: { viewBox: { x: number; y: number } }) => {
                const isMulti = crosshairPoint.values.length > 1;
                const xText = xFormatter(crosshairPoint.x);
                const lines = crosshairPoint.values.map((v) => {
                  const yText = yFormatter(v.y);
                  const configLabel = chartConfig[v.dataKey].label;
                  const seriesName =
                    typeof configLabel === "string"
                      ? configLabel.toLowerCase()
                      : v.dataKey;
                  return isMulti
                    ? `${yText} at ${xText} ${seriesName}`
                    : `${yText} at ${xText}`;
                });
                return (
                  <text
                    x={viewBox.x}
                    y={viewBox.y}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={500}
                    stroke="var(--background)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    {crosshairPoint.values.map((v, i) => {
                      return (
                        <tspan
                          key={v.dataKey}
                          x={viewBox.x}
                          dy={i === 0 ? -10 - (isMulti ? 14 : 0) : 14}
                          fill={`var(--color-${v.dataKey})`}
                        >
                          {lines[i]}
                        </tspan>
                      );
                    })}
                  </text>
                );
              }}
            />
          )}
          {showCrosshair &&
            crosshairPoint.values.map((v) => (
              <ReferenceDot
                key={`crosshair-dot-${v.dataKey}`}
                x={crosshairPoint.x}
                y={v.stackedY}
                r={4}
                fill={`var(--color-${v.dataKey})`}
                stroke="var(--background)"
                strokeWidth={2}
              />
            ))}
          {!showCrosshair &&
            annotations.map((annotation) => (
              <ReferenceLine
                key={`line-${String(annotation.x)}-${annotation.label}`}
                x={annotation.x}
                stroke={annotation.color ?? "var(--muted-foreground)"}
                strokeWidth={1.5}
                strokeDasharray={annotation.strokeDasharray ?? "6 4"}
                label={
                  annotation.labelAnchor
                    ? ({ viewBox }: { viewBox: { x: number; y: number } }) => (
                        <text
                          x={viewBox.x}
                          y={viewBox.y + (annotation.labelOffsetY ?? 14)}
                          fill={annotation.color ?? "var(--muted-foreground)"}
                          fontSize={11}
                          fontWeight={500}
                          textAnchor={annotation.labelAnchor}
                        >
                          <tspan dy="0.355em">{annotation.label}</tspan>
                        </text>
                      )
                    : {
                        value: annotation.label,
                        position: "insideTop" as const,
                        fill: annotation.color ?? "var(--muted-foreground)",
                        fontSize: 11,
                        fontWeight: 500,
                        dy: -25,
                      }
                }
              />
            ))}
          {!showCrosshair &&
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
          {!showCrosshair &&
            annotations
              .filter(
                (a): a is ChartAnnotationConfig & { bottomLabel: string } =>
                  a.bottomLabel !== undefined,
              )
              .map((annotation) => (
                <ReferenceLine
                  key={`btm-${String(annotation.x)}-${annotation.bottomLabel}`}
                  x={annotation.x}
                  stroke="none"
                  label={({
                    viewBox,
                  }: {
                    viewBox: { x: number; y: number; height: number };
                  }) => {
                    const text = annotation.bottomLabel;
                    const tagX = viewBox.x;
                    const tagY = viewBox.y + viewBox.height - 10;
                    return (
                      <text
                        x={tagX}
                        y={tagY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={annotation.color ?? "var(--muted-foreground)"}
                        fontSize={11}
                        fontWeight={500}
                        stroke="var(--background)"
                        strokeWidth={4}
                        strokeLinejoin="round"
                        paintOrder="stroke"
                      >
                        {text}
                      </text>
                    );
                  }}
                />
              ))}
          {horizontalAnnotations.map((ha) => (
            <ReferenceLine
              key={`hline-${String(ha.y)}-${ha.label}`}
              y={ha.y}
              stroke={ha.color ?? "var(--muted-foreground)"}
              strokeWidth={1.5}
              strokeDasharray={ha.strokeDasharray ?? "6 4"}
              label={{
                value: ha.label,
                position: "right" as const,
                fill: ha.color ?? "var(--muted-foreground)",
                fontSize: 11,
                fontWeight: 500,
              }}
            />
          ))}
        </ChartComponent>
      </ChartContainer>
    </div>
  );
}
