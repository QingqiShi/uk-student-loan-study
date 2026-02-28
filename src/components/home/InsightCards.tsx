"use client";

import {
  ProportionCard,
  RateComparisonCard,
  SparklineCard,
} from "./InsightCard";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import { DETAIL_PAGES } from "@/lib/detail-pages";

export function InsightCards() {
  const { cards: data } = usePersonalizedResults();

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        Your Loan Breakdown
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SparklineCard
          title={DETAIL_PAGES[0].label}
          href={DETAIL_PAGES[0].href}
          color={DETAIL_PAGES[0].color}
          cardData={data?.cumulative ?? null}
        />
        <SparklineCard
          title={DETAIL_PAGES[1].label}
          href={DETAIL_PAGES[1].href}
          color={DETAIL_PAGES[1].color}
          cardData={data?.balance ?? null}
        />
        <ProportionCard
          title={DETAIL_PAGES[2].label}
          href={DETAIL_PAGES[2].href}
          color={DETAIL_PAGES[2].color}
          cardData={data?.interest ?? null}
        />
        <RateComparisonCard
          title={DETAIL_PAGES[3].label}
          href={DETAIL_PAGES[3].href}
          color={DETAIL_PAGES[3].color}
          cardData={data?.effectiveRate ?? null}
        />
      </div>
    </section>
  );
}
