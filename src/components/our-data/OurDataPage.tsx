import {
  ArrowUpRight01Icon,
  BankIcon,
  ChartIncreaseIcon,
  CheckmarkCircle01Icon,
  DocumentValidationIcon,
  Globe02Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { formatGBP } from "@/lib/format";
import { CURRENT_RATES, LAST_UPDATED, PLAN_CONFIGS } from "@/lib/loans/plans";

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
    label: "BoE Base Rate",
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
    icon: Globe02Icon,
    title: "Check the sources",
    description:
      "Every morning, we automatically read the latest figures from GOV.UK, the Bank of England, and the ONS",
  },
  {
    icon: Search01Icon,
    title: "Spot any differences",
    description:
      "Each figure is compared against what our calculators currently show",
  },
  {
    icon: DocumentValidationIcon,
    title: "Prepare the changes",
    description:
      "If anything is out of date, an update is put together automatically",
  },
  {
    icon: CheckmarkCircle01Icon,
    title: "Double-check everything",
    description:
      "The update goes through a full round of checks before it reaches you",
  },
];

const CROSS_CHECK_LINKS = [
  {
    icon: Globe02Icon,
    source: "GOV.UK",
    label: "What you pay",
    description: "Thresholds and repayment rates",
    href: "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
  },
  {
    icon: Globe02Icon,
    source: "GOV.UK",
    label: "When your loan gets written off",
    description: "Write-off periods",
    href: "https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled",
  },
  {
    icon: BankIcon,
    source: "Bank of England",
    label: "Bank Rate",
    description: "Base rate for interest calculations",
    href: "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp",
  },
  {
    icon: ChartIncreaseIcon,
    source: "ONS",
    label: "CPI Annual Rate",
    description: "Discount rate for present-value calculations",
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-3 pt-13 pb-6 md:pb-8"
      >
        <article className="space-y-10">
          {/* Hero */}
          <div className="space-y-4">
            <Breadcrumb currentTitle="Our Data" />
            <div className="space-y-3">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Every figure comes straight from the source
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Our calculators use official figures from GOV.UK, the Bank of
                England, and the ONS. They&rsquo;re checked every day by an
                automated system&nbsp;&mdash; if anything changes, we update
                within 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                className="size-4 text-primary"
              />
              <p className="text-sm text-muted-foreground">
                Figures last updated{" "}
                <span className="font-medium text-foreground">
                  {formattedLastUpdated}
                </span>
              </p>
            </div>
          </div>

          {/* What we track */}
          <section className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What we track
            </h2>

            {/* Rate cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {RATES.map((rate) => (
                <div
                  key={rate.label}
                  className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
                >
                  <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    {rate.label}
                  </p>
                  <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-primary tabular-nums">
                    {rate.value}%
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={rate.icon} className="size-3" />
                    {rate.source}
                  </p>
                </div>
              ))}
            </div>

            {/* Plan table */}
            <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    <th className="px-4 py-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      Annual threshold
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      Write-off
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {plans.map((p) => (
                    <tr
                      key={p.label}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">{p.label}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground tabular-nums">
                        {formatGBP(p.threshold)}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground tabular-nums">
                        {Math.round(p.rate * 100)}%
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.writeOff} years
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How it stays current */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              How it stays current
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              We run an automatic check every day so you never have to wonder if
              our numbers are current.
            </p>
            <div>
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                      <HugeiconsIcon icon={step.icon} className="size-4" />
                    </div>
                    {i < PIPELINE_STEPS.length - 1 && (
                      <div className="my-1.5 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div
                    className={
                      i < PIPELINE_STEPS.length - 1 ? "pb-5" : undefined
                    }
                  >
                    <p className="mt-1 text-sm font-medium">{step.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-check yourself */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Cross-check yourself
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              You don&rsquo;t have to take our word for it. Here are the primary
              sources we pull from:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {CROSS_CHECK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex h-full items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:bg-accent hover:ring-primary/30">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <HugeiconsIcon icon={link.icon} className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {link.label}
                        </span>
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {link.source} &mdash; {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
