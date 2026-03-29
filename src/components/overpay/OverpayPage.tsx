"use client";

import Link from "next/link";
import { useState } from "react";
import { RelatedContent } from "@/components/detail/RelatedContent";
import { PageLayout } from "@/components/layout/PageLayout";
import { AssumptionsCallout } from "@/components/shared/AssumptionsCallout";
import { ControlBar } from "@/components/shared/ControlBar";
import { InsightCards } from "@/components/shared/InsightCards";
import { PlanFromQuery } from "@/components/shared/PlanFromQuery";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";
import { REPAYMENT_START_MONTH } from "@/lib/presets";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayPrimaryInputs } from "./OverpayPrimaryInputs";
import { OverpaySummaryCards } from "./OverpaySummaryCards";
import { OverpayVerdict } from "./OverpayVerdict";

function OverpayPageSkeleton() {
  return (
    <>
      {/* Verdict skeleton */}
      <Skeleton className="min-h-43 w-full rounded-lg xs:min-h-38 sm:min-h-29 md:min-h-0" />

      {/* Chart + cards grid skeleton */}
      <div className="grid gap-6 md:flex">
        <div className="h-65 min-w-0 sm:h-75 md:h-auto md:min-h-75 md:flex-1">
          <Skeleton className="size-full" />
        </div>
        <div className="-mx-4 flex gap-3 px-4 py-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:p-1 md:w-65 md:shrink-0 md:grid-cols-1">
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
        </div>
      </div>
    </>
  );
}

export function OverpayPage() {
  const [repaymentDate, setRepaymentDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), REPAYMENT_START_MONTH, 1),
  );
  const analysis = useOverpayAnalysis(repaymentDate);

  const handleRepaymentYearChange = (year: number) => {
    setRepaymentDate(new Date(year, REPAYMENT_START_MONTH, 1));
  };

  return (
    <>
      <PlanFromQuery onRepaymentYearChange={handleRepaymentYearChange} />
      <PageLayout repaymentYear={repaymentDate.getFullYear()}>
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overpay Calculator</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-1">
            <Heading as="h1">Student Loan Overpayment Calculator</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Should you overpay or invest? See which leaves you better off.
            </p>
          </div>
        </div>

        {analysis ? (
          <>
            <OverpayVerdict
              recommendation={analysis.recommendation}
              reason={analysis.recommendationReason}
            />

            <div className="grid gap-6 md:flex">
              <div className="h-65 min-w-0 sm:h-75 md:h-auto md:min-h-75 md:flex-1">
                <OverpayComparisonChart analysis={analysis} />
              </div>
              <div className="min-w-0 md:w-65 md:shrink-0">
                <OverpaySummaryCards analysis={analysis} />
              </div>
            </div>
          </>
        ) : (
          <OverpayPageSkeleton />
        )}

        <OverpayPrimaryInputs
          repaymentDate={repaymentDate}
          onRepaymentDateChange={setRepaymentDate}
        />

        <ControlBar />

        <InsightCards excludeHref="/overpay" />

        <AssumptionsCallout />

        <RelatedContent />
      </PageLayout>
    </>
  );
}
