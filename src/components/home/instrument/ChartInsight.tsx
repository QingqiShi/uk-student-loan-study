"use client";

import Link from "next/link";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import type { Insight } from "@/utils/insights";

// The peak/costly zone reads brick (the one cost signal); the "written off" and
// "pays off quickly" zones read spruce. One signal, one brand — no status hues.
const COST_ZONES = new Set<Insight["type"]>(["middle-earner"]);

/**
 * The interactive read on where the reader's salary lands on the curve, shown
 * under the chart with a deep-link into the overpayment calculator. Driven live
 * by the same simulation as the readout (generateInsight), so it updates as the
 * salary slider moves.
 */
export function ChartInsight() {
  const { insight } = usePersonalizedResults();

  if (!insight) return null;

  const tone = COST_ZONES.has(insight.type) ? "cost" : "brand";

  return (
    <div
      className="group mt-[0.85rem] flex flex-wrap items-baseline gap-x-[0.9rem] gap-y-[0.35rem] border-t border-border pt-[0.85rem]"
      data-tone={tone}
      role="status"
      aria-live="polite"
    >
      <span
        className="size-2 flex-none self-center rounded-full bg-primary group-data-[tone=cost]:[background:var(--signal)]"
        aria-hidden="true"
      />
      <p className="m-0 font-sans text-sm font-semibold tracking-[-0.01em] text-foreground">
        {insight.title}
      </p>
      {insight.cta && (
        <Link
          className="group/cta ml-auto inline-flex items-baseline gap-[0.3rem] font-sans text-sm font-semibold whitespace-nowrap text-cta no-underline [transition:color_0.15s]"
          href={insight.cta.href}
        >
          {insight.cta.text}
          <span
            className="text-primary [transition:transform_0.15s] group-hover/cta:translate-x-[3px]"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}
