"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { InstrumentSection } from "@/components/instrument/InstrumentSection";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { usePersonalisedResults } from "@/context/PersonalisedResultsContext";
import { DETAIL_PAGES } from "@/lib/detailPages";
import { SECTION_BODY_PAD } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  ProportionViz,
  ProportionVizSkeleton,
  RateBenchmarkViz,
  RateBenchmarkVizSkeleton,
  SparklineViz,
  SparklineVizSkeleton,
} from "./InsightCard";

interface InsightCardsProps {
  excludeHref?: string;
}

const [REPAID, BALANCE, INTEREST, RATE] = DETAIL_PAGES;

/**
 * The four drill-down loan metrics as a bare seamed readout, without the heading
 * rail. Use it when the surrounding section already provides the masthead;
 * {@link LoanBreakdownSection} is that section, and is what most callers want.
 *
 * Pass `rail` to stand it in a fold's right-hand rail instead of running it
 * across a band — the homepage's own readout sits there, and a detail page puts
 * these four in the same place so that opening one does not move the other
 * three.
 */
export function InsightCardsReadout({
  excludeHref,
  rail,
}: InsightCardsProps & { rail?: boolean }) {
  const { cards: data } = usePersonalisedResults();

  const loading = data == null;

  return (
    // <nav> is correct here — each cell is a link to a detail page
    <nav aria-label="Loan breakdown">
      <MetricReadout columns={4} rail={rail}>
        {/* Total repaid — the headline number, spruce-ink emphasis */}
        <MetricCell
          label={REPAID.label}
          value={data?.cumulative.stat}
          tone="emphasis"
          href={REPAID.href}
          active={excludeHref === REPAID.href}
          loading={loading}
          skeleton={<SparklineVizSkeleton />}
          linkLabel="open the full repayment breakdown"
        >
          {data && (
            <SparklineViz cardData={data.cumulative} label={REPAID.label} />
          )}
        </MetricCell>

        {/* Payoff timeline */}
        <MetricCell
          label={BALANCE.label}
          value={data?.balance.stat}
          href={BALANCE.href}
          active={excludeHref === BALANCE.href}
          loading={loading}
          skeleton={<SparklineVizSkeleton />}
          linkLabel="open the full payoff timeline"
        >
          {data && (
            <SparklineViz cardData={data.balance} label={BALANCE.label} />
          )}
        </MetricCell>

        {/* Interest paid — the cost figure, brick */}
        <MetricCell
          label={data?.interest.label ?? INTEREST.label}
          value={data?.interest.stat}
          tone="cost"
          href={INTEREST.href}
          active={excludeHref === INTEREST.href}
          loading={loading}
          skeleton={<ProportionVizSkeleton />}
          linkLabel="open the interest breakdown"
        >
          {data && <ProportionViz cardData={data.interest} />}
        </MetricCell>

        {/* Effective rate */}
        <MetricCell
          label={RATE.label}
          value={data?.effectiveRate.stat}
          href={RATE.href}
          active={excludeHref === RATE.href}
          loading={loading}
          skeleton={<RateBenchmarkVizSkeleton />}
          linkLabel="see how the effective rate is worked out"
        >
          {data && <RateBenchmarkViz cardData={data.effectiveRate} />}
        </MetricCell>
      </MetricReadout>
    </nav>
  );
}

/**
 * The drill-down readout as a seamed band below a fold — the masthead rail, the
 * four metrics, and the one route back to the full calculator once the
 * nameplate's breadcrumb has scrolled away. Shared by every full-bleed tool page
 * that reports on a loan it did not itself compute (the overpay comparison, the
 * four detail pages), so the band reads the same on all of them.
 */
export function LoanBreakdownSection({
  excludeHref,
  intro,
}: InsightCardsProps & {
  /** What this page's own figures are, relative to the four below. */
  intro: ReactNode;
}) {
  return (
    <InstrumentSection
      id="breakdown"
      heading="Your loan breakdown"
      intro={intro}
    >
      <div className={cn(SECTION_BODY_PAD, "space-y-4")}>
        <InsightCardsReadout excludeHref={excludeHref} />
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-meta font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Repayment Calculator
        </Link>
      </div>
    </InstrumentSection>
  );
}
