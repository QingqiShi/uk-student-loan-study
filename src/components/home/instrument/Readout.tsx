"use client";

import Link from "next/link";
import { Sparkline } from "@/components/charts/Sparkline";
import { Chevron } from "@/components/instrument/MetricReadout";
import { Figure } from "@/components/typography/Figure";
import { percentageFormatter } from "@/constants";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import {
  useApplyPlan2Freeze,
  useCurrentSalary,
  useLoanConfig,
  useRpiRate,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
} from "@/hooks/useStoreSelectors";
import { formatGBP, percentagesSummingTo100 } from "@/lib/format";
import { primaryPlanName } from "./planInfo";

const SKEL_VALUE: React.CSSProperties = { height: "1.7rem", width: "7rem" };
const SKEL_VIZ: React.CSSProperties = { height: "2.6rem", width: "100%" };

function ValueSkeleton() {
  return (
    <div
      className="animate-[slsFade_.6s_ease_both] rounded-sm bg-muted"
      style={SKEL_VALUE}
    />
  );
}
function VizSkeleton() {
  return (
    <div
      className="animate-[slsFade_.6s_ease_both] rounded-sm bg-muted"
      style={SKEL_VIZ}
    />
  );
}

/**
 * Value placeholder that reuses the real figure classes (`text-fig-lg
 * leading-none`) so its line box — and therefore the card height — is identical
 * once the live figure resolves. Used by the interest and effective-rate cells,
 * whose viz is the tallest in the readout and so drives the equalised row.
 */
function ValueChipSkeleton() {
  return (
    <div className="w-28 max-w-full animate-[slsFade_.6s_ease_both] rounded-sm bg-muted font-mono text-fig-lg leading-none font-semibold tracking-[-0.02em] text-transparent tabular-nums">
      0
    </div>
  );
}

/** One legend entry rendered as a muted chip, height-matched to the loaded row. */
function LegendChipSkeleton({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-[0.45rem] text-meta">
      <i className="size-[9px] flex-none rounded-[3px] bg-muted" />
      <span className="rounded-sm bg-muted text-transparent">{label}</span>{" "}
      <b className="min-w-[4ch] rounded-sm bg-muted font-mono font-semibold tracking-[-0.015em] text-transparent tabular-nums">
        00%
      </b>
    </span>
  );
}

/** Loading placeholder for the interest split-bar + legend (mirrors its height). */
function InterestVizSkeleton() {
  return (
    <div aria-hidden className="mt-auto animate-[slsFade_.6s_ease_both]">
      <div className="h-3 rounded-full bg-muted [box-shadow:inset_0_0_0_1px_var(--border)]" />
      <div className="mt-[0.55rem] hidden flex-col gap-y-2 md:flex">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
          <LegendChipSkeleton label="Principal" />
          <LegendChipSkeleton label="Interest" />
        </div>
        <LegendChipSkeleton label="Written off" />
      </div>
    </div>
  );
}

/** Loading placeholder for the effective-rate benchmark rows (mirrors its height). */
function RateVizSkeleton() {
  return (
    <div aria-hidden className="mt-auto animate-[slsFade_.6s_ease_both]">
      <div className="flex flex-col gap-2">
        {["Yours", "BoE base"].map((label) => (
          <div
            key={label}
            className="grid grid-cols-[4.5em_1fr_2.7em] items-center gap-[0.45rem]"
          >
            <span className="rounded-sm bg-muted text-meta text-transparent">
              {label}
            </span>
            <div className="h-[7px] min-w-[26px] rounded-full bg-muted" />
            <span className="justify-self-end rounded-sm bg-muted font-mono text-fig-sm text-transparent tabular-nums">
              0.0%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Readout({ onTailor }: { onTailor: () => void }) {
  const { cards, summary } = usePersonalizedResults();
  const salary = useCurrentSalary();
  const { loans, underGradBalance, postGradBalance } = useLoanConfig();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const applyPlan2Freeze = useApplyPlan2Freeze();
  const rpiRate = useRpiRate();

  const planName = primaryPlanName(loans);
  const borrowed = underGradBalance + postGradBalance;
  const salaryGrowthPct = Math.round(salaryGrowthRate * 100);

  // Mirror AssumptionsCallout: only Plan 2 threshold is frozen, and RPI tracks
  // the user's configured rate rather than the static default.
  const hasPlan2 = loans.some((l) => l.planType === "PLAN_2");
  const thresholdLabel =
    applyPlan2Freeze && hasPlan2
      ? `frozen then +${(thresholdGrowthRate * 100).toFixed(0)}%/yr`
      : thresholdGrowthRate === 0
        ? "frozen"
        : `+${(thresholdGrowthRate * 100).toFixed(0)}%/yr`;
  const rpiLabel = `${rpiRate % 1 === 0 ? rpiRate.toFixed(0) : rpiRate.toFixed(1)}%`;

  const interest = cards?.interest ?? null;
  const rate = cards?.effectiveRate ?? null;

  const principalRatio = interest?.principalRatio ?? 0;
  const interestRatio = interest?.interestRatio ?? 0;
  const writtenOffRatio = interest?.writtenOffRatio ?? 0;
  // Round together so the legend always sums to exactly 100%.
  const [principalPct, interestPct, writtenOffPct] = percentagesSummingTo100([
    principalRatio,
    interestRatio,
    writtenOffRatio,
  ]);

  const effRate = rate?.effectiveRate ?? 0;
  const boeRate = rate?.boeRate ?? 0;
  const maxRate = Math.max(effRate, boeRate, 0.001);
  const yoursWidth = effRate > 0 ? Math.max((effRate / maxRate) * 100, 2) : 0;
  const boeWidth = boeRate > 0 ? Math.max((boeRate / maxRate) * 100, 2) : 0;

  return (
    <div
      data-slot="readout"
      className="[grid-area:readout] work:[align-self:start]"
    >
      <div className="mb-[0.7rem] flex flex-wrap items-baseline justify-between gap-4">
        <span className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase">
          Your loan breakdown
        </span>
        <span className="text-meta text-muted-foreground">
          At{" "}
          <b className="font-semibold text-foreground">
            <Figure value={formatGBP(salary)} />
          </b>{" "}
          salary
          <span className="hidden md:inline">
            {" "}
            · {planName} · {formatGBP(borrowed)} borrowed
          </span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4 work:grid-cols-1">
        {/* Total repaid */}
        <Link
          data-slot="metric-total"
          className="group flex min-h-[134px] flex-col gap-2 bg-card px-4 pt-[0.9rem] pb-4 text-inherit no-underline [transition:background_0.15s_ease] hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset work:min-h-[118px]"
          href="/repaid"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold tracking-label text-cta uppercase group-hover:text-cta group-focus-visible:text-cta">
              Total repaid
            </span>
            <Chevron />
          </div>
          {summary && cards ? (
            <div
              data-slot="metric-value"
              className="font-mono text-fig-hero leading-none font-semibold tracking-[-0.02em] tabular-nums"
            >
              {/* the exact figure, not the compact card stat — this is the
                  instrument's headline number and the whole trust thesis */}
              <Figure value={formatGBP(Math.round(summary.totalPaid))} />
            </div>
          ) : (
            <ValueSkeleton />
          )}
          {cards ? (
            <div className="mt-auto">
              <Sparkline
                data={cards.cumulative.data}
                color="var(--primary)"
                ariaLabel={`Total repaid: ${cards.cumulative.stat}`}
              />
            </div>
          ) : (
            <VizSkeleton />
          )}
          <span className="sr-only"> — open the full repayment breakdown</span>
        </Link>

        {/* Payoff timeline */}
        <Link
          className="group flex min-h-[134px] flex-col gap-2 bg-card px-4 pt-[0.9rem] pb-4 text-inherit no-underline [transition:background_0.15s_ease] hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset work:min-h-[118px]"
          href="/balance"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase group-hover:text-cta group-focus-visible:text-cta">
              Payoff timeline
            </span>
            <Chevron />
          </div>
          {cards ? (
            <div className="font-mono text-fig-lg leading-none font-semibold tracking-[-0.02em] tabular-nums">
              <Figure value={cards.balance.stat} />
            </div>
          ) : (
            <ValueSkeleton />
          )}
          {cards ? (
            <div className="mt-auto">
              <Sparkline
                data={cards.balance.data}
                color="var(--primary)"
                ariaLabel={`Payoff timeline: ${cards.balance.stat}`}
              />
            </div>
          ) : (
            <VizSkeleton />
          )}
          <span className="sr-only"> — open the full payoff timeline</span>
        </Link>

        {/* Interest paid */}
        <Link
          className="group flex min-h-[134px] flex-col gap-2 bg-card px-4 pt-[0.9rem] pb-4 text-inherit no-underline [transition:background_0.15s_ease] hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset work:min-h-[118px]"
          href="/interest"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase group-hover:text-cta group-focus-visible:text-cta">
              {interest?.label ?? "Interest paid"}
            </span>
            <Chevron />
          </div>
          {interest ? (
            <div className="font-mono text-fig-lg leading-none font-semibold tracking-[-0.02em] text-signal tabular-nums">
              <Figure value={interest.stat} />
            </div>
          ) : (
            <ValueChipSkeleton />
          )}
          {interest ? (
            <div className="mt-auto">
              <div
                className="flex h-3 overflow-hidden rounded-full bg-muted [box-shadow:inset_0_0_0_1px_var(--border)]"
                role="img"
                aria-label={`Of ${interest.stat} repaid, ${String(interestPct)}% is interest and ${String(principalPct)}% is principal${writtenOffRatio > 0 ? `, with ${String(writtenOffPct)}% written off` : ""}.`}
              >
                <i
                  className="h-full bg-primary [transition:width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${String(principalRatio * 100)}%` }}
                />
                <i
                  className="h-full bg-signal [transition:width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${String(interestRatio * 100)}%` }}
                />
                {writtenOffRatio > 0 && (
                  <i
                    className="h-full [background:repeating-linear-gradient(45deg,var(--muted)_0_4px,color-mix(in_oklab,var(--faint)_55%,var(--muted))_4px_8px)] [transition:width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${String(writtenOffRatio * 100)}%` }}
                  />
                )}
              </div>
              {/* Two fixed rows: Principal/Interest, then Written off — always
                  shown (0% when nothing is written off) so the card keeps a
                  constant height and the equalised grid row never shifts. */}
              <div className="mt-[0.55rem] hidden flex-col gap-y-2 md:flex">
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                  <span className="inline-flex items-center gap-[0.45rem] text-meta text-muted-foreground">
                    <i className="size-[9px] flex-none rounded-[3px] bg-primary" />{" "}
                    Principal{" "}
                    <b className="min-w-[4ch] font-mono font-semibold tracking-[-0.015em] text-foreground tabular-nums">
                      {String(principalPct)}%
                    </b>
                  </span>
                  <span className="inline-flex items-center gap-[0.45rem] text-meta text-muted-foreground">
                    <i className="size-[9px] flex-none rounded-[3px] bg-signal" />{" "}
                    Interest{" "}
                    <b className="min-w-[4ch] font-mono font-semibold tracking-[-0.015em] text-foreground tabular-nums">
                      {String(interestPct)}%
                    </b>
                  </span>
                </div>
                <span className="inline-flex items-center gap-[0.45rem] text-meta text-muted-foreground">
                  <i className="size-[9px] flex-none rounded-[3px] [background:repeating-linear-gradient(45deg,var(--muted)_0_3px,color-mix(in_oklab,var(--faint)_55%,var(--muted))_3px_6px)]" />{" "}
                  Written off{" "}
                  <b className="min-w-[4ch] font-mono font-semibold tracking-[-0.015em] text-foreground tabular-nums">
                    {String(writtenOffPct)}%
                  </b>
                </span>
              </div>
            </div>
          ) : (
            <InterestVizSkeleton />
          )}
          <span className="sr-only"> — open the interest breakdown</span>
        </Link>

        {/* Effective rate */}
        <Link
          className="group flex min-h-[134px] flex-col gap-2 bg-card px-4 pt-[0.9rem] pb-4 text-inherit no-underline [transition:background_0.15s_ease] hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset work:min-h-[118px]"
          href="/effective-rate"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase group-hover:text-cta group-focus-visible:text-cta">
              Effective rate
            </span>
            <Chevron />
          </div>
          {rate ? (
            <div className="font-mono text-fig-lg leading-none font-semibold tracking-[-0.02em] tabular-nums">
              <Figure value={rate.stat} />
            </div>
          ) : (
            <ValueChipSkeleton />
          )}
          {rate ? (
            <div className="mt-auto">
              <div
                className="flex flex-col gap-2"
                role="img"
                aria-label={`Your effective rate ${percentageFormatter(effRate)} versus the Bank of England base rate ${percentageFormatter(boeRate)}.`}
              >
                <div className="grid grid-cols-[4.5em_1fr_2.7em] items-center gap-[0.45rem]">
                  <span className="text-meta text-muted-foreground">Yours</span>
                  <div className="h-[7px] min-w-[26px] overflow-hidden rounded-full bg-muted">
                    <i
                      className="block h-full rounded-full bg-primary [transition:width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${String(yoursWidth)}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-fig-sm font-semibold tracking-[-0.015em] tabular-nums">
                    {percentageFormatter(effRate)}
                  </span>
                </div>
                <div className="grid grid-cols-[4.5em_1fr_2.7em] items-center gap-[0.45rem]">
                  <span className="text-meta text-muted-foreground">
                    BoE base
                  </span>
                  <div className="h-[7px] min-w-[26px] overflow-hidden rounded-full bg-muted">
                    <i
                      className="block h-full rounded-full bg-axis [transition:width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${String(boeWidth)}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-fig-sm font-medium tracking-[-0.015em] text-muted-foreground tabular-nums">
                    {percentageFormatter(boeRate)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <RateVizSkeleton />
          )}
          <span className="sr-only">
            {" "}
            — see how the effective rate is worked out
          </span>
        </Link>
      </div>

      <p className="mt-[0.85rem] font-sans text-meta leading-[1.6] text-muted-foreground">
        Modelled on{" "}
        <b className="font-semibold text-foreground">{salaryGrowthPct}%</b>{" "}
        salary growth, thresholds{" "}
        <b className="font-semibold text-foreground">{thresholdLabel}</b>, and{" "}
        <b className="font-semibold text-foreground">{rpiLabel}</b> RPI.{" "}
        <button
          type="button"
          className="m-0 cursor-pointer appearance-none [border-width:0_0_1px] border-solid border-b-[color-mix(in_oklab,var(--primary)_38%,transparent)] p-0 whitespace-nowrap text-cta no-underline [background:none] [font:inherit] hover:[border-bottom-color:var(--primary)] focus-visible:rounded-[4px] focus-visible:[outline:2px_solid_var(--ring)] focus-visible:outline-offset-2"
          onClick={onTailor}
        >
          Tailor to you →
        </button>
      </p>
    </div>
  );
}
