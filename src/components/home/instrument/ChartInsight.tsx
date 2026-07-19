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
 *
 * Layout: the status dot sits in a fixed marker column so the title and CTA
 * share one left edge. When they fit, the CTA rides inline to the right
 * (justify-between); when the panel is too narrow it drops onto its own line
 * and stays aligned under the title instead of orphaning against the right edge.
 */
export function ChartInsight() {
  const { insight } = usePersonalizedResults();

  if (!insight) return null;

  const tone = COST_ZONES.has(insight.type) ? "cost" : "brand";

  return (
    <div
      className="group mt-3.5 flex items-start gap-3.5 border-t border-border pt-3.5"
      data-tone={tone}
      role="status"
      aria-live="polite"
    >
      {/* Marker column is exactly one line tall (h-5 = text-sm leading), so the
          dot centres on the first line of the title and stays there however the
          content below it wraps. */}
      <span className="flex h-5 flex-none items-center" aria-hidden="true">
        <span className="size-2 rounded-full bg-chart-principal group-data-[tone=cost]:[background:var(--chart-interest)]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1.5">
        <p className="m-0 font-sans text-sm font-semibold text-foreground">
          {insight.title}
        </p>
        {insight.cta && (
          <Link
            className="group/cta inline-flex items-baseline gap-1 font-sans text-sm font-semibold whitespace-nowrap text-cta no-underline transition-colors"
            href={insight.cta.href}
          >
            {insight.cta.text}
            <span
              className="text-primary transition-transform group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
