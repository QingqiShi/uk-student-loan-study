import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { formatGBP } from "@/lib/format";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";

const LINK_CLASS =
  "text-primary underline underline-offset-4 hover:text-primary/80";

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

export function OurDataPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-3 pt-13 pb-6 md:pb-8"
      >
        <article className="space-y-8">
          <div className="space-y-4">
            <Breadcrumb currentTitle="Our Data" />

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Every figure comes straight from the source
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Our calculators use official figures from GOV.UK and the Bank of
              England. They&rsquo;re checked every day by an automated
              system&nbsp;&mdash; if anything changes, we update within 24
              hours.
            </p>
          </div>

          {/* What we track */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What we track
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Every number that feeds into a calculation is pulled from an
                official source:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Repayment thresholds (monthly and annual, per plan)</li>
                <li>Repayment rates (9% / 6%)</li>
                <li>Interest rates (per plan)</li>
                <li>Write-off periods</li>
                <li>
                  Bank of England base rate (currently{" "}
                  <strong className="text-foreground">
                    {CURRENT_RATES.boeBaseRate}%
                  </strong>
                  )
                </li>
                <li>
                  RPI &mdash; Retail Prices Index (currently{" "}
                  <strong className="text-foreground">
                    {CURRENT_RATES.rpi}%
                  </strong>
                  )
                </li>
              </ul>
            </div>

            {/* Plan summary table */}
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase">
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Annual threshold</th>
                    <th className="px-3 py-2">Rate</th>
                    <th className="px-3 py-2">Write-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {plans.map((p) => (
                    <tr key={p.label}>
                      <td className="px-3 py-2 font-medium">{p.label}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {formatGBP(p.threshold)}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {Math.round(p.rate * 100)}%
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {p.writeOff} years
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How it stays current */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              How it stays current
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>A daily automated pipeline keeps everything in sync:</p>
              <ol className="list-decimal space-y-1 pl-6">
                <li>
                  Every morning, our system visits GOV.UK and the Bank of
                  England
                </li>
                <li>
                  It compares every figure against what our calculators
                  currently use
                </li>
                <li>If anything has changed, it prepares an update</li>
                <li>
                  The update is verified (tests, type checks, build) before
                  going live
                </li>
              </ol>
              <p>
                If all figures already match, no changes are made &mdash; the
                pipeline only updates what&rsquo;s actually changed.
              </p>
            </div>
          </section>

          {/* Cross-check yourself */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Cross-check yourself
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                You don&rsquo;t have to take our word for it. Here are the
                primary sources we pull from:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <Link
                    href="https://www.gov.uk/repaying-your-student-loan/what-you-pay"
                    className={LINK_CLASS}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GOV.UK &mdash; What you pay
                  </Link>{" "}
                  (thresholds, repayment rates)
                </li>
                <li>
                  <Link
                    href="https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled"
                    className={LINK_CLASS}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GOV.UK &mdash; When your loan gets written off
                  </Link>{" "}
                  (write-off periods)
                </li>
                <li>
                  <Link
                    href="https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"
                    className={LINK_CLASS}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bank of England &mdash; Bank Rate
                  </Link>{" "}
                  (base rate for interest calculations)
                </li>
              </ul>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
