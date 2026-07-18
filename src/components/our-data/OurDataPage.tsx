import {
  ArrowUpRight01Icon,
  BankIcon,
  ChartIncreaseIcon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { Panel, PanelHeader } from "@/components/instrument/Panel";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGBP } from "@/lib/format";
import { CURRENT_RATES, LAST_UPDATED, PLAN_CONFIGS } from "@/lib/loans/plans";
import { getCurrentTaxYearLabel } from "@/lib/taxYear";
import { cn } from "@/lib/utils";

const TAX_YEAR = getCurrentTaxYearLabel();

const plans = [
  {
    label: "Plan 1",
    threshold: PLAN_CONFIGS.PLAN_1.monthlyThreshold * 12,
    rate: PLAN_CONFIGS.PLAN_1.repaymentRate,
    writeOff: PLAN_CONFIGS.PLAN_1.writeOffYears,
  },
  {
    label: "Plan 2",
    threshold: PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12,
    rate: PLAN_CONFIGS.PLAN_2.repaymentRate,
    writeOff: PLAN_CONFIGS.PLAN_2.writeOffYears,
  },
  {
    label: "Plan 4",
    threshold: PLAN_CONFIGS.PLAN_4.monthlyThreshold * 12,
    rate: PLAN_CONFIGS.PLAN_4.repaymentRate,
    writeOff: PLAN_CONFIGS.PLAN_4.writeOffYears,
  },
  {
    label: "Plan 5",
    threshold: PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12,
    rate: PLAN_CONFIGS.PLAN_5.repaymentRate,
    writeOff: PLAN_CONFIGS.PLAN_5.writeOffYears,
  },
  {
    label: "Postgraduate",
    threshold: PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold * 12,
    rate: PLAN_CONFIGS.POSTGRADUATE.repaymentRate,
    writeOff: PLAN_CONFIGS.POSTGRADUATE.writeOffYears,
  },
] as const;

const RATES = [
  {
    label: "BoE base rate",
    value: CURRENT_RATES.boeBaseRate,
    source: "Bank of England",
    icon: BankIcon,
  },
  {
    label: "RPI",
    value: CURRENT_RATES.rpi,
    source: "GOV.UK (via SLC)",
    icon: Globe02Icon,
  },
  {
    label: "CPI",
    value: CURRENT_RATES.cpi,
    source: "ONS",
    icon: ChartIncreaseIcon,
  },
];

const PIPELINE_STEPS = [
  {
    title: "Read the sources",
    description:
      "Every morning an automated job reads the latest figures straight from GOV.UK, the Bank of England, and the ONS.",
  },
  {
    title: "Compare against the model",
    description:
      "Each figure is checked against what our calculators currently use, down to the exact rate and threshold.",
  },
  {
    title: "Prepare the update",
    description:
      "If anything has moved, a change is assembled automatically and staged for review.",
  },
  {
    title: "Verify, then ship",
    description:
      "The update passes a full round of automated checks before it reaches the live calculators.",
  },
];

const CROSS_CHECK_LINKS = [
  {
    source: "GOV.UK",
    label: "Thresholds and repayment rates",
    description: "What you pay on each plan",
    href: "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
  },
  {
    source: "GOV.UK",
    label: "Write-off periods",
    description: "When your loan gets cancelled",
    href: "https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled",
  },
  {
    source: "Bank of England",
    label: "Bank Rate",
    description: "Base rate for interest calculations",
    href: "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp",
  },
  {
    source: "ONS",
    label: "CPI annual rate",
    description: "Discount rate for present-value figures",
    href: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7g7/mm23",
  },
];

const formattedLastUpdated = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

export function OurDataPage() {
  return (
    <PageLayout>
      <article className="space-y-14">
        {/* Hero */}
        <header className="space-y-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Our data</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="space-y-4">
            <Heading as="h1" size="page">
              Every figure comes straight from the source
            </Heading>
            <p className="max-w-[68ch] text-lead text-muted-foreground">
              Our calculators run on the official figures published by GOV.UK,
              the Bank of England, and the ONS. An automated job re-checks them
              every day&nbsp;&mdash; if a number moves, the model updates within
              24 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border pt-4">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Last verified
            </span>
            <time
              dateTime={LAST_UPDATED}
              className="font-mono text-sm font-semibold tracking-tight text-cta tabular-nums"
            >
              {formattedLastUpdated}
            </time>
            <span className="text-sm text-muted-foreground">
              · {TAX_YEAR} tax year
            </span>
          </div>
        </header>

        {/* Live rates — one hairline-split readout, not floating cards */}
        <section className="space-y-5" aria-labelledby="rates-h">
          <div className="space-y-2">
            <Heading as="h2" size="section" id="rates-h">
              The rates we track
            </Heading>
            <p className="max-w-[68ch] text-muted-foreground">
              These three market figures feed every interest and present-value
              calculation on the site. They are the live values in use right
              now.
            </p>
          </div>
          <MetricReadout columns={3}>
            {RATES.map((rate) => (
              <MetricCell
                key={rate.label}
                label={rate.label}
                value={`${String(rate.value)}%`}
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={rate.icon}
                    className="size-3.5 shrink-0"
                  />
                  {rate.source}
                </span>
              </MetricCell>
            ))}
          </MetricReadout>
        </section>

        {/* Plan spec-sheet */}
        <section className="space-y-5" aria-labelledby="plans-h">
          <div className="space-y-2">
            <Heading as="h2" size="section" id="plans-h">
              Current plan figures
            </Heading>
            <p className="max-w-[68ch] text-muted-foreground">
              The published thresholds, repayment rates, and write-off periods
              applied by the model for each UK student loan plan.
            </p>
          </div>
          <Panel padding={false} className="overflow-hidden">
            <PanelHeader
              caption={`Fig. 1 — Plan parameters · ${TAX_YEAR}`}
              className="mb-0 border-b border-border p-4 sm:p-5"
            />
            <Table>
              <TableCaption className="px-4 pb-4">
                Repayment thresholds, rates, and write-off periods for each UK
                student loan plan type.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead
                    scope="col"
                    className="pl-4 text-xs font-semibold tracking-wider uppercase"
                  >
                    Plan
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-right text-xs font-semibold tracking-wider uppercase"
                  >
                    Annual threshold
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-right text-xs font-semibold tracking-wider uppercase"
                  >
                    Rate
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="pr-4 text-right text-xs font-semibold tracking-wider uppercase"
                  >
                    Write-off
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.label}>
                    <TableHead
                      scope="row"
                      className="py-3 pl-4 font-medium text-foreground"
                    >
                      {p.label}
                    </TableHead>
                    <TableCell className="py-3 text-right font-mono tabular-nums">
                      {formatGBP(p.threshold)}
                    </TableCell>
                    <TableCell className="py-3 text-right font-mono tabular-nums">
                      {Math.round(p.rate * 100)}%
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-right font-mono tabular-nums">
                      {p.writeOff} yrs
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </section>

        {/* How it stays current — a genuine 4-step sequence, so numbered */}
        <section className="space-y-5" aria-labelledby="pipeline-h">
          <div className="space-y-2">
            <Heading as="h2" size="section" id="pipeline-h">
              How it stays current
            </Heading>
            <p className="max-w-[68ch] text-muted-foreground">
              The same check runs every day, so the numbers are never left to go
              stale.
            </p>
          </div>
          <Panel padding={false} className="overflow-hidden">
            <ol className="divide-y divide-border">
              {PIPELINE_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex items-baseline gap-4 p-4 sm:gap-5 sm:p-5"
                >
                  <span className="font-mono text-sm font-semibold text-cta tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </section>

        {/* Cross-check — flat spec-sheet of primary sources */}
        <section className="space-y-5" aria-labelledby="sources-h">
          <div className="space-y-2">
            <Heading as="h2" size="section" id="sources-h">
              Cross-check it yourself
            </Heading>
            <p className="max-w-[68ch] text-muted-foreground">
              You don&rsquo;t have to take our word for it. Every figure traces
              back to one of these primary sources.
            </p>
          </div>
          <Panel padding={false} className="overflow-hidden">
            <ul className="divide-y divide-border">
              {CROSS_CHECK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-between gap-4 p-4 transition-colors sm:p-5",
                      "hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                    )}
                  >
                    <div className="min-w-0 space-y-1">
                      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-cta group-focus-visible:text-cta">
                        {link.source}
                      </span>
                      <p className="font-medium text-foreground">
                        {link.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      className="size-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-focus-visible:text-primary"
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </article>
    </PageLayout>
  );
}
