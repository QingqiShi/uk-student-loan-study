"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickInputs } from "./QuickInputs";
import { InsightCallout } from "./InsightCallout";

const TotalRepaymentChart = lazy(() => import("./TotalRepaymentChart"));

export function HeroSection() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Student Loans Hurt Middle Earners Most
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
          Low earners get their loans written off. High earners pay them off
          quickly. But middle earners pay the most—often more than they
          borrowed.
        </p>
      </div>

      <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <TotalRepaymentChart />
        </Suspense>
      </div>

      <QuickInputs />

      <InsightCallout />
    </section>
  );
}

export default HeroSection;
