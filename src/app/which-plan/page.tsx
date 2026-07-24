import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AllPlansTable } from "@/components/plans/AllPlansTable";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Heading } from "@/components/typography/Heading";
import { PROSE_LINK } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function WhichPlanPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Primary task. A dominant hero names the job, then the quiz sits
            directly beneath as one anchored instrument card — the single focal
            object on the page. */}
        <section className="mx-auto w-full max-w-lg px-4 pt-12 pb-16 sm:pt-16 sm:pb-24">
          <div className="text-center">
            <Heading as="h1" size="page-hero">
              Which student loan plan am I on?
            </Heading>
            <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
              Answer a few quick questions — we&apos;ll match you to Plan 1, 2,
              4, 5 or Postgraduate and show this year&apos;s repayment figures.
            </p>
          </div>
          <div className="mt-8 sm:mt-10">
            <QuizContainer standalone />
          </div>
        </section>

        {/* Secondary. A quiet at-a-glance reference, clearly subordinate to the
            finder: sunk band, a small left-aligned heading (not another centered
            hero), and the compact comparison table instead of five data cards
            that each read like a mini result screen. */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <div className="mb-6 max-w-prose">
              <Heading as="h2" size="subsection">
                All UK student loan plans at a glance
              </Heading>
              <p className="mt-1 text-sm text-muted-foreground">
                Prefer to browse? Thresholds, repayment rates and write-off
                periods for every plan. Select a plan for the full breakdown.
              </p>
            </div>
            <p className="mb-2 text-xs text-muted-foreground sm:hidden">
              Swipe the table sideways to see rate and write-off →
            </p>
            <AllPlansTable />
            <div className="mt-6">
              <Link
                href="/plans"
                className={cn(PROSE_LINK, "inline-flex items-center gap-1")}
              >
                Compare all UK student loan plans
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
