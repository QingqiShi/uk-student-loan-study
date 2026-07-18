import { Sparkline } from "@/components/charts/Sparkline";
import { percentageFormatter } from "@/constants";
import { percentagesSummingTo100 } from "@/lib/format";
import type {
  EffectiveRateCardData,
  InsightCardData,
  InterestCardData,
} from "@/types/insightCards";

// ---------------------------------------------------------------------------
// Per-metric vizzes — the baseline-pinned instrument that rides inside each
// MetricReadout cell (see InsightCards). Spruce carries the positive series and
// principal; brick carries interest/cost; everything else is a cool neutral.
// ---------------------------------------------------------------------------

/** Sparkline viz for the trend metrics (total repaid, payoff timeline). */
export function SparklineViz({
  cardData,
  label,
}: {
  cardData: InsightCardData;
  label: string;
}) {
  return (
    <Sparkline
      data={cardData.data}
      color="var(--primary)"
      ariaLabel={`${label}: ${cardData.stat}`}
    />
  );
}

/** Principal / interest / written-off split bar with a mono legend. */
export function ProportionViz({ cardData }: { cardData: InterestCardData }) {
  // Round together so the legend and bar always sum to exactly 100%.
  const [principalPct, interestPct, writtenOffPct] = percentagesSummingTo100([
    cardData.principalRatio,
    cardData.interestRatio,
    cardData.writtenOffRatio,
  ]);

  return (
    <div>
      <div
        className="flex h-3 overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset"
        role="img"
        aria-label={`Of ${cardData.stat} repaid, ${String(interestPct)}% is interest and ${String(principalPct)}% is principal${writtenOffPct > 0 ? `, with ${String(writtenOffPct)}% written off` : ""}.`}
      >
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${String(principalPct)}%` }}
        />
        <div
          className="h-full bg-signal transition-all duration-500"
          style={{ width: `${String(interestPct)}%` }}
        />
        {writtenOffPct > 0 && (
          <div
            className="h-full bg-muted-foreground/30 transition-all duration-500"
            style={{ width: `${String(writtenOffPct)}%` }}
          />
        )}
      </div>
      {/* Two fixed rows: Principal/Interest, then Written off — always shown
          (0% when nothing is written off) so the card keeps a constant height
          and the equalised grid row never shifts. */}
      <div className="mt-2 flex flex-col gap-y-1 text-xs text-muted-foreground">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-primary" /> Principal{" "}
            <b className="min-w-[4ch] font-mono font-semibold text-foreground tabular-nums">
              {String(principalPct)}%
            </b>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-signal" /> Interest{" "}
            <b className="min-w-[4ch] font-mono font-semibold text-foreground tabular-nums">
              {String(interestPct)}%
            </b>
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-muted-foreground/30" /> Written
          off{" "}
          <b className="min-w-[4ch] font-mono font-semibold text-foreground tabular-nums">
            {String(writtenOffPct)}%
          </b>
        </span>
      </div>
    </div>
  );
}

/** Effective-rate-vs-BoE benchmark rows: label · track · mono value. */
export function RateBenchmarkViz({
  cardData,
}: {
  cardData: EffectiveRateCardData;
}) {
  const maxRate = Math.max(cardData.effectiveRate, cardData.boeRate, 0.001);
  const yoursWidth =
    cardData.effectiveRate > 0
      ? Math.max((cardData.effectiveRate / maxRate) * 100, 2)
      : 0;
  const boeWidth =
    cardData.boeRate > 0 ? Math.max((cardData.boeRate / maxRate) * 100, 2) : 0;

  return (
    <div
      className="flex flex-col gap-2"
      role="img"
      aria-label={`Your effective rate ${percentageFormatter(cardData.effectiveRate)} versus the Bank of England base rate ${percentageFormatter(cardData.boeRate)}.`}
    >
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 text-xs text-muted-foreground">
          Yours
        </span>
        <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${String(yoursWidth)}%` }}
          />
        </span>
        <span className="w-11 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
          {percentageFormatter(cardData.effectiveRate)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 text-xs text-muted-foreground">
          BoE base
        </span>
        <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-axis transition-all duration-500"
            style={{ width: `${String(boeWidth)}%` }}
          />
        </span>
        <span className="w-11 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
          {percentageFormatter(cardData.boeRate)}
        </span>
      </div>
    </div>
  );
}

/**
 * Skeleton legend row: mirrors a `ProportionViz` legend entry exactly (same dot,
 * label text and mono percent), rendered as muted chips via `text-transparent`.
 * Keeping the real label text means the row occupies an identical line box — and
 * wraps identically — to the loaded legend, so the card height never shifts when
 * live figures resolve.
 */
function ProportionLegendChipSkeleton({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-sm bg-muted" />
      <span className="rounded-sm bg-muted text-transparent">{label}</span>{" "}
      <b className="min-w-[4ch] rounded-sm bg-muted font-mono font-semibold text-transparent tabular-nums">
        00%
      </b>
    </span>
  );
}

/** Loading placeholder for `SparklineViz` — the `h-12` matches the loaded chart. */
export function SparklineVizSkeleton() {
  return <div aria-hidden className="h-12 animate-pulse rounded-sm bg-muted" />;
}

/** Loading placeholder for `ProportionViz`, height-matched to the loaded viz. */
export function ProportionVizSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-3 rounded-full bg-muted ring-1 ring-border ring-inset" />
      <div className="mt-2 flex flex-col gap-y-1 text-xs">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <ProportionLegendChipSkeleton label="Principal" />
          <ProportionLegendChipSkeleton label="Interest" />
        </div>
        <ProportionLegendChipSkeleton label="Written off" />
      </div>
    </div>
  );
}

/** Loading placeholder for `RateBenchmarkViz`, height-matched to the loaded viz. */
export function RateBenchmarkVizSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-2">
      {["Yours", "BoE base"].map((label) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          <span className="w-14 shrink-0 rounded-sm bg-muted text-transparent">
            {label}
          </span>
          <span className="h-1.5 min-w-0 flex-1 rounded-full bg-muted" />
          <span className="w-11 shrink-0 rounded-sm bg-muted text-right text-transparent">
            0.0%
          </span>
        </div>
      ))}
    </div>
  );
}
