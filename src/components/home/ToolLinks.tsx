import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Quiz01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { GUIDES, type GuideSlug } from "@/lib/guides";

interface ToolCardProps {
  href: string;
  icon: typeof Quiz01Icon;
  title: string;
  description: string;
  cta: string;
  newUntil?: string;
}

function ToolCard({
  href,
  icon,
  title,
  description,
  cta,
  newUntil,
}: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <HugeiconsIcon icon={icon} className="size-5" />
          </div>
          <h3 className="font-medium">
            {title}
            {newUntil && new Date() < new Date(newUntil) && (
              <span className="ml-2 inline-block rounded-full bg-primary/5 px-2 py-0.5 align-middle text-xs font-medium text-primary">
                New
              </span>
            )}
          </h3>
        </div>
        <p className="mb-4 flex-1 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center gap-1 text-sm font-medium text-primary">
          {cta}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}

const TOOLS: ToolCardProps[] = [
  {
    href: "/which-plan?ref=tool-card",
    icon: Quiz01Icon,
    title: "Find Your Plan",
    description:
      "Not sure which loan plan you\u2019re on? Take our quick 3-question quiz to find out.",
    cta: "Take the Quiz",
  },
  {
    href: "/overpay?ref=tool-card",
    icon: AnalyticsUpIcon,
    title: "Overpay Calculator",
    description:
      "Should you pay off your loan faster or invest the money instead?",
    cta: "Calculate",
  },
];

/** Slugs of guides to feature on the homepage, in display order. */
const FEATURED_GUIDE_SLUGS: GuideSlug[] = [
  "interest-rate-cap",
  "threshold-freeze",
  "plan-2-vs-plan-5",
  "how-interest-works",
  "student-loan-vs-mortgage",
  "moving-abroad",
];

/** Derive featured guides from the canonical GUIDES array to keep titles/descriptions in sync. */
const FEATURED_GUIDES = FEATURED_GUIDE_SLUGS.flatMap((slug) => {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return [];
  return [guide];
});

export function ToolLinks() {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-base font-semibold">More Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-base font-semibold">Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_GUIDES.map((guide) => (
            <ToolCard
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              icon={BookOpen01Icon}
              title={guide.title}
              description={guide.description}
              cta="Read Guide"
              newUntil={guide.newUntil}
            />
          ))}
        </div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View All Guides
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
