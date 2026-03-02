"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  ProportionCard,
  RateComparisonCard,
  SparklineCard,
} from "./InsightCard";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import { DETAIL_PAGES } from "@/lib/detailPages";

interface InsightCardsProps {
  excludeHref?: string;
}

export function InsightCards({ excludeHref }: InsightCardsProps) {
  const { cards: data } = usePersonalizedResults();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Loan Breakdown
        </h2>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SparklineCard
          key={DETAIL_PAGES[0].href}
          title={DETAIL_PAGES[0].label}
          href={DETAIL_PAGES[0].href}
          color={DETAIL_PAGES[0].color}
          active={excludeHref === DETAIL_PAGES[0].href}
          cardData={data?.cumulative ?? null}
        />
        <SparklineCard
          key={DETAIL_PAGES[1].href}
          title={DETAIL_PAGES[1].label}
          href={DETAIL_PAGES[1].href}
          color={DETAIL_PAGES[1].color}
          active={excludeHref === DETAIL_PAGES[1].href}
          cardData={data?.balance ?? null}
        />
        <ProportionCard
          key={DETAIL_PAGES[2].href}
          title={DETAIL_PAGES[2].label}
          href={DETAIL_PAGES[2].href}
          color={DETAIL_PAGES[2].color}
          active={excludeHref === DETAIL_PAGES[2].href}
          cardData={data?.interest ?? null}
        />
        <RateComparisonCard
          key={DETAIL_PAGES[3].href}
          title={DETAIL_PAGES[3].label}
          href={DETAIL_PAGES[3].href}
          color={DETAIL_PAGES[3].color}
          active={excludeHref === DETAIL_PAGES[3].href}
          cardData={data?.effectiveRate ?? null}
        />
      </div>
    </section>
  );
}
