"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LazyChartBase = dynamic(
  () => import("@/components/charts/ChartBase").then((m) => m.ChartBase),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading chart"
      />
    ),
  },
);
