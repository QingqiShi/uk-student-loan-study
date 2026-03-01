import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type {
  EffectiveRateCardData,
  InsightCardData,
  InterestCardData,
} from "@/types/insightCards";
import { Sparkline } from "@/components/charts/Sparkline";

// ---------------------------------------------------------------------------
// Shared card shell
// ---------------------------------------------------------------------------

function CardShell({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </div>
        {children}
      </div>
    </Link>
  );
}

function StatSkeleton() {
  return (
    <>
      <div className="px-5 pt-2">
        <div className="h-7 w-24 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="mt-2 h-12 animate-pulse bg-muted" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Sparkline card (Balance, Cumulative)
// ---------------------------------------------------------------------------

interface SparklineCardProps {
  title: string;
  href: string;
  color: string;
  cardData: InsightCardData | null;
}

export function SparklineCard({
  title,
  href,
  color,
  cardData,
}: SparklineCardProps) {
  return (
    <CardShell title={title} href={href}>
      {cardData ? (
        <div className="flex flex-1 flex-col">
          <span className="px-5 pt-2 font-mono text-xl font-semibold tabular-nums">
            {cardData.stat}
          </span>
          <div className="mt-auto">
            <Sparkline
              data={cardData.data}
              color={color}
              ariaLabel={cardData.label}
            />
          </div>
        </div>
      ) : (
        <StatSkeleton />
      )}
    </CardShell>
  );
}

// ---------------------------------------------------------------------------
// Proportion bar card (Interest)
// ---------------------------------------------------------------------------

interface ProportionCardProps {
  title: string;
  href: string;
  color: string;
  cardData: InterestCardData | null;
}

export function ProportionCard({
  title,
  href,
  color,
  cardData,
}: ProportionCardProps) {
  return (
    <CardShell title={title} href={href}>
      {cardData ? (
        <div className="flex flex-1 flex-col justify-between px-5 pt-2 pb-5">
          <span className="font-mono text-xl font-semibold tabular-nums">
            {cardData.stat}
          </span>
          <div>
            <div
              className="flex h-2.5 overflow-hidden rounded-full"
              role="img"
              aria-label={`Interest is ${String(Math.round(cardData.interestRatio * 100))}% of total repayments`}
            >
              <div
                className="rounded-l-full transition-all duration-500"
                style={{
                  width: `${String(Math.max(cardData.interestRatio * 100, 2))}%`,
                  backgroundColor: color,
                }}
              />
              <div className="flex-1 bg-muted" />
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>
                {String(Math.round(cardData.interestRatio * 100))}% interest
              </span>
              <span>
                {String(Math.round((1 - cardData.interestRatio) * 100))}%
                principal
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 pt-2 pb-5">
          <div className="h-7 w-24 animate-pulse rounded-sm bg-muted" />
          <div className="mt-3 h-2.5 animate-pulse rounded-full bg-muted" />
          <div className="mt-1.5 flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </div>
        </div>
      )}
    </CardShell>
  );
}

// ---------------------------------------------------------------------------
// Rate comparison card (Effective Rate vs BoE)
// ---------------------------------------------------------------------------

interface RateComparisonCardProps {
  title: string;
  href: string;
  color: string;
  cardData: EffectiveRateCardData | null;
}

export function RateComparisonCard({
  title,
  href,
  color,
  cardData,
}: RateComparisonCardProps) {
  const maxRate = Math.max(
    cardData?.effectiveRate ?? 0,
    cardData?.boeRate ?? 0,
    0.001,
  );
  const effectiveWidth =
    cardData && cardData.effectiveRate > 0
      ? Math.max((cardData.effectiveRate / maxRate) * 100, 2)
      : 0;
  const boeWidth =
    cardData && cardData.boeRate > 0
      ? Math.max((cardData.boeRate / maxRate) * 100, 2)
      : 0;

  return (
    <CardShell title={title} href={href}>
      {cardData ? (
        <div className="flex flex-1 flex-col justify-between px-5 pt-2 pb-5">
          <span className="font-mono text-xl font-semibold tabular-nums">
            {cardData.stat}
          </span>
          <div
            className="space-y-1.5"
            role="img"
            aria-label={`Effective rate ${(cardData.effectiveRate * 100).toFixed(1)}% vs base rate ${(cardData.boeRate * 100).toFixed(1)}%`}
          >
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-muted-foreground">
                Yours
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${String(effectiveWidth)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums">
                {(cardData.effectiveRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-muted-foreground">
                BoE base
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground/30 transition-all duration-500"
                  style={{ width: `${String(boeWidth)}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
                {(cardData.boeRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 pt-2 pb-5">
          <div className="h-7 w-24 animate-pulse rounded-sm bg-muted" />
          <div className="mt-3 space-y-1.5">
            <div className="h-2 animate-pulse rounded-full bg-muted" />
            <div className="h-2 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      )}
    </CardShell>
  );
}

// ---------------------------------------------------------------------------
// Calculator card (insight text + sparkline)
// ---------------------------------------------------------------------------

interface CalculatorCardProps {
  cardData: InsightCardData | null;
  currentSalary: number | undefined;
}

export function CalculatorCard({
  cardData,
  currentSalary,
}: CalculatorCardProps) {
  return (
    <CardShell title="Repayment Calculator" href="/">
      {cardData ? (
        <div className="flex flex-1 flex-col">
          <span className="px-5 pt-2 font-mono text-xl font-semibold tabular-nums">
            {cardData.stat}
          </span>
          <div className="mt-auto">
            <Sparkline
              data={cardData.data}
              color="var(--primary)"
              ariaLabel={cardData.label}
              annotationX={currentSalary}
            />
          </div>
        </div>
      ) : (
        <StatSkeleton />
      )}
    </CardShell>
  );
}
