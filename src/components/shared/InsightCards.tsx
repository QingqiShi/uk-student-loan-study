"use client";

import {
  CalculatorCard,
  ProportionCard,
  RateComparisonCard,
  SparklineCard,
} from "./InsightCard";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import { DETAIL_PAGES } from "@/lib/detail-pages";
import { cn } from "@/lib/utils";

interface InsightCardsProps {
  excludeHref?: string;
}

export function InsightCards({ excludeHref }: InsightCardsProps) {
  const { cards: data, insight } = usePersonalizedResults();

  // Fixed 4-card positions: [Repaid, Balance, Interest, Eff. Rate]
  const detailCards = [
    {
      href: DETAIL_PAGES[0].href,
      node: (
        <SparklineCard
          key={DETAIL_PAGES[0].href}
          title={DETAIL_PAGES[0].label}
          href={DETAIL_PAGES[0].href}
          color={DETAIL_PAGES[0].color}
          cardData={data?.cumulative ?? null}
        />
      ),
    },
    {
      href: DETAIL_PAGES[1].href,
      node: (
        <SparklineCard
          key={DETAIL_PAGES[1].href}
          title={DETAIL_PAGES[1].label}
          href={DETAIL_PAGES[1].href}
          color={DETAIL_PAGES[1].color}
          cardData={data?.balance ?? null}
        />
      ),
    },
    {
      href: DETAIL_PAGES[2].href,
      node: (
        <ProportionCard
          key={DETAIL_PAGES[2].href}
          title={DETAIL_PAGES[2].label}
          href={DETAIL_PAGES[2].href}
          color={DETAIL_PAGES[2].color}
          cardData={data?.interest ?? null}
        />
      ),
    },
    {
      href: DETAIL_PAGES[3].href,
      node: (
        <RateComparisonCard
          key={DETAIL_PAGES[3].href}
          title={DETAIL_PAGES[3].label}
          href={DETAIL_PAGES[3].href}
          color={DETAIL_PAGES[3].color}
          cardData={data?.effectiveRate ?? null}
        />
      ),
    },
  ];

  const calculatorNode = (
    <CalculatorCard
      key="/"
      cardData={data?.totalRepayment ?? null}
      insightTitle={insight?.title ?? null}
      insightType={insight?.type ?? null}
    />
  );

  // Check if excludeHref matches one of the 4 detail cards
  const swapIndex = detailCards.findIndex((c) => c.href === excludeHref);

  let cards: React.ReactNode[];

  if (!excludeHref) {
    // Home page: show only the 4 detail cards
    cards = detailCards.map((c) => c.node);
  } else if (swapIndex !== -1) {
    // Detail page: swap the current page's card with calculator card in-place
    cards = detailCards.map((c, i) =>
      i === swapIndex ? calculatorNode : c.node,
    );
  } else {
    // Other pages (e.g. /overpay): prepend calculator card, show all 4 detail cards
    cards = [calculatorNode, ...detailCards.map((c) => c.node)];
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        Your Loan Breakdown
      </h2>
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          cards.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4",
        )}
      >
        {cards}
      </div>
    </section>
  );
}
