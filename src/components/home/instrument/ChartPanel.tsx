"use client";

import { TotalRepaymentChart } from "@/components/charts/TotalRepaymentChart";
import { useLoanConfig } from "@/hooks/useStoreSelectors";
import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { ChartInsight } from "./ChartInsight";
import { primaryPlanName } from "./planInfo";

export function ChartPanel() {
  const { loans } = useLoanConfig();
  const planName = primaryPlanName(loans);

  return (
    <div className="min-w-0 [grid-area:chart] work:self-stretch">
      <div
        className={cn(
          surfaceCard,
          "min-w-0 p-[clamp(1rem,1.5vw,1.35rem)] work:flex work:h-full work:flex-col",
        )}
      >
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-4">
          <span className="font-sans text-meta font-medium text-muted-foreground">
            Fig. 1 — Lifetime repaid by salary · {planName}
          </span>
        </div>
        <div className="relative aspect-video max-w-full min-w-0 overflow-hidden work:aspect-auto work:min-h-[340px] work:flex-1 work:*:aspect-auto work:*:h-full work:*:min-h-0 work:**:data-[slot=chart]:aspect-auto work:**:data-[slot=chart]:h-full work:**:data-[slot=chart]:min-h-0 [&.intro_.area-path]:animate-[slsFade_1.1s_ease_both] [&.intro_.curve-line]:animate-[slsDraw_0.9s_cubic-bezier(0.22,1,0.36,1)_both] [&.intro_.curve-line]:[stroke-dasharray:1]">
          <TotalRepaymentChart />
        </div>
        <ChartInsight />
      </div>
    </div>
  );
}
