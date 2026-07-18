"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { Heading } from "@/components/typography/Heading";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import { DETAIL_PAGES } from "@/lib/detailPages";
import { ProportionViz, RateBenchmarkViz, SparklineViz } from "./InsightCard";

interface InsightCardsProps {
  excludeHref?: string;
}

const [REPAID, BALANCE, INTEREST, RATE] = DETAIL_PAGES;

export function InsightCards({ excludeHref }: InsightCardsProps) {
  const { cards: data } = usePersonalizedResults();

  const loading = data == null;

  return (
    // <nav> is correct here — each cell is a link to a detail page
    <nav aria-label="Loan breakdown" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Heading as="h2" size="section">
          Your Loan Breakdown
        </Heading>
        {excludeHref && (
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Repayment Calculator
          </Link>
        )}
      </div>

      <MetricReadout columns={4}>
        {/* Total repaid — the headline number, spruce-ink emphasis */}
        <MetricCell
          label={REPAID.label}
          value={data?.cumulative.stat}
          tone="emphasis"
          href={REPAID.href}
          active={excludeHref === REPAID.href}
          loading={loading}
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
          linkLabel="see how the effective rate is worked out"
        >
          {data && <RateBenchmarkViz cardData={data.effectiveRate} />}
        </MetricCell>
      </MetricReadout>
    </nav>
  );
}
