import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  BankIcon,
  BookOpen01Icon,
  Calculator01Icon,
  ChartIncreaseIcon,
  Coins01Icon,
  CoinsPoundIcon,
  GlobalIcon,
  Quiz01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

interface ExtraLink {
  href: string;
  label: string;
}

interface ToolLink {
  href: string;
  title: string;
  description: string;
  icon: typeof Calculator01Icon;
}

/** Calculator/tool destinations a guide can cross-link to. */
const TOOLS: Partial<Record<string, ToolLink>> = {
  "/": {
    href: "/",
    title: "Student Loan Repayment Calculator",
    description: "See how much you will repay in total at your salary",
    icon: Calculator01Icon,
  },
  "/overpay": {
    href: "/overpay",
    title: "Overpay Calculator",
    description: "Pay off faster or invest instead?",
    icon: AnalyticsUpIcon,
  },
  "/repaid": {
    href: "/repaid",
    title: "When Will It Be Paid Off?",
    description: "Your payoff year and total lifetime repayments",
    icon: CoinsPoundIcon,
  },
  "/balance": {
    href: "/balance",
    title: "Payoff Timeline",
    description: "Watch your balance rise and fall year by year",
    icon: ChartIncreaseIcon,
  },
  "/interest": {
    href: "/interest",
    title: "Interest Paid",
    description: "How much of your repayments is pure interest",
    icon: Coins01Icon,
  },
  "/effective-rate": {
    href: "/effective-rate",
    title: "Effective Interest Rate",
    description: "Your true rate vs the Bank of England base rate",
    icon: BankIcon,
  },
  "/which-plan": {
    href: "/which-plan",
    title: "Which Plan Quiz",
    description: "Find out which repayment plan you are on",
    icon: Quiz01Icon,
  },
};

const DEFAULT_TOOLS = ["/", "/overpay"];

interface RelatedGuidesProps {
  current: GuideSlug;
  order: GuideSlug[];
  extraLinks?: ExtraLink[];
  /** Calculator hrefs to feature under "More Tools" (keys of TOOLS). */
  tools?: string[];
}

export function RelatedGuides({
  current,
  order,
  extraLinks,
  tools = DEFAULT_TOOLS,
}: RelatedGuidesProps) {
  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const orderedGuides = order
    .filter((slug) => slug !== current)
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined)
    .slice(0, 2);

  const toolLinks = tools
    .map((href) => TOOLS[href])
    .filter((t): t is ToolLink => t !== undefined);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Heading as="h2" size="section">
          Related Guides
        </Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          {orderedGuides.map((guide) => (
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

      {extraLinks && extraLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {extraLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-accent"
            >
              <HugeiconsIcon
                icon={GlobalIcon}
                className="size-4 text-muted-foreground"
              />
              {link.label}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>
      )}

      {toolLinks.length > 0 && (
        <section className="space-y-4">
          <Heading as="h2" size="section">
            More Tools
          </Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {toolLinks.map((tool) => (
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
