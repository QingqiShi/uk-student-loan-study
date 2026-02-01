import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  Quiz01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function ToolLinks() {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold">More Tools</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/which-plan" className="group block h-full">
          <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <HugeiconsIcon icon={Quiz01Icon} className="size-5" />
              </div>
              <h4 className="font-medium">Find Your Plan</h4>
            </div>
            <p className="mb-4 flex-1 text-sm text-muted-foreground">
              Not sure which loan plan you&apos;re on? Take our quick 3-question
              quiz to find out.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              Take the Quiz
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </Link>

        <Link href="/overpay" className="group block h-full">
          <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <HugeiconsIcon icon={AnalyticsUpIcon} className="size-5" />
              </div>
              <h4 className="font-medium">Overpay Calculator</h4>
            </div>
            <p className="mb-4 flex-1 text-sm text-muted-foreground">
              Should you pay off your loan faster or invest the money instead?
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              Calculate
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
