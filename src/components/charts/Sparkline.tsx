"use client";

import { useId } from "react";
import type { SparklinePoint } from "@/types/insightCards";

interface SparklineProps {
  data: SparklinePoint[];
  color: string;
  ariaLabel: string;
  /** Raw data x-value (e.g. salary) to draw a dashed vertical annotation line */
  annotationX?: number;
}

const W = 100;
const H = 48;

export function Sparkline({
  data,
  color,
  ariaLabel,
  annotationX,
}: SparklineProps) {
  const gradientId = useId();

  if (data.length < 2) {
    return <div className="h-12" role="img" aria-label={ariaLabel} />;
  }

  const xMin = data[0].month;
  const xMax = data[data.length - 1].month;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const d of data) {
    if (d.value < yMin) yMin = d.value;
    if (d.value > yMax) yMax = d.value;
  }
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  let lineD = "";
  let areaD = "";
  for (let i = 0; i < data.length; i++) {
    const px = ((data[i].month - xMin) / xRange) * W;
    const py = (1 - (data[i].value - yMin) / yRange) * H;
    const cmd = i === 0 ? "M" : "L";
    lineD += `${cmd}${px.toFixed(1)},${py.toFixed(1)}`;
  }

  const lastX = ((data[data.length - 1].month - xMin) / xRange) * W;
  const firstX = ((data[0].month - xMin) / xRange) * W;
  areaD = `${lineD}L${lastX.toFixed(1)},${String(H)}L${firstX.toFixed(1)},${String(H)}Z`;

  return (
    <div className="h-12" role="img" aria-label={ariaLabel}>
      <svg
        viewBox={`0 0 ${String(W)} ${String(H)}`}
        preserveAspectRatio="none"
        className="size-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {annotationX != null && annotationX >= xMin && annotationX <= xMax && (
          <line
            x1={((annotationX - xMin) / xRange) * W}
            y1={0}
            x2={((annotationX - xMin) / xRange) * W}
            y2={H}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
