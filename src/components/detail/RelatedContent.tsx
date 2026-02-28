"use client";

import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Calculator01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { Heading } from "@/components/typography/Heading";
import { GUIDES } from "@/lib/guides";

interface ToolLink {
  href: string;
  icon: typeof Calculator01Icon;
  title: string;
  description: string;
}

interface PageRelatedConfig {
  guides: GuideSlug[];
  tools: ToolLink[];
}

const RELATED: Partial<Record<string, PageRelatedConfig>> = {
  "/repaid": {
    guides: ["how-interest-works", "plan-2-vs-plan-5"],
    tools: [
      {
        href: "/overpay",
        icon: AnalyticsUpIcon,
        title: "Overpay Calculator",
        description: "See if overpaying reduces your total cost",
      },
    ],
  },
  "/balance": {
    guides: ["how-interest-works", "plan-2-vs-plan-5"],
    tools: [
      {
        href: "/overpay",
        icon: AnalyticsUpIcon,
        title: "Overpay Calculator",
        description: "See how overpaying affects your balance trajectory",
      },
    ],
  },
  "/interest": {
    guides: ["how-interest-works", "rpi-vs-cpi"],
    tools: [
      {
        href: "/overpay",
        icon: AnalyticsUpIcon,
        title: "Overpay Calculator",
        description: "Could overpaying reduce your interest bill?",
      },
    ],
  },
  "/effective-rate": {
    guides: ["rpi-vs-cpi", "student-loan-vs-mortgage"],
    tools: [
      {
        href: "/",
        icon: Calculator01Icon,
        title: "Repayment Calculator",
        description: "See your full repayment projection by salary",
      },
      {
        href: "/overpay",
        icon: AnalyticsUpIcon,
        title: "Overpay Calculator",
        description: "Should you pay off faster or invest?",
      },
    ],
  },
};

export function RelatedContent() {
  const pathname = usePathname();
  const related = RELATED[pathname];
  if (!related) return null;

  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const guides = related.guides
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined);

  return (
    <div className="space-y-6">
      {guides.length > 0 && (
        <section className="space-y-4">
          <Heading as="h2" size="section">
            Related Guides
          </Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block"
              >
                <div className="flex h-full flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
                  <div className="mb-2 flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
                    </div>
                    <h3 className="text-sm font-medium">{guide.title}</h3>
                  </div>
                  <p className="mb-3 flex-1 text-xs text-muted-foreground">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    Read Guide
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.tools.length > 0 && (
        <section className="space-y-4">
          <Heading as="h2" size="section">
            More Tools
          </Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block">
                <div className="flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:bg-accent hover:ring-1 hover:ring-primary/30">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <HugeiconsIcon icon={tool.icon} className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
