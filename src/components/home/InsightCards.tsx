"use client";

import {
  ProportionCard,
  RateComparisonCard,
  SparklineCard,
} from "./InsightCard";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";

export function InsightCards() {
  const { cards: data } = usePersonalizedResults();

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        Your Loan Breakdown
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SparklineCard
          title="Repaid Over Time"
          href="#"
          color="var(--chart-1)"
          cardData={data?.cumulative ?? null}
        />
        <SparklineCard
          title="Balance Over Time"
          href="#"
          color="var(--chart-2)"
          cardData={data?.balance ?? null}
        />
        <ProportionCard
          title="Interest Paid"
          href="#"
          color="var(--chart-3)"
          cardData={data?.interest ?? null}
        />
        <RateComparisonCard
          title="Effective Rate"
          href="#"
          color="var(--chart-4)"
          cardData={data?.effectiveRate ?? null}
        />
      </div>
    </section>
  );
}
