"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";
import { RelatedContent } from "./RelatedContent";
import { PageLayout } from "@/components/layout/PageLayout";
import { AssumptionsCallout } from "@/components/shared/AssumptionsCallout";
import { ControlBar } from "@/components/shared/ControlBar";
import { InsightCards } from "@/components/shared/InsightCards";
import { PlanFromQuery } from "@/components/shared/PlanFromQuery";
import { Heading } from "@/components/typography/Heading";

interface DetailPageShellProps {
  heading: string;
  description: string;
  children: React.ReactNode;
}

export function DetailPageShell({
  heading,
  description,
  children,
}: DetailPageShellProps) {
  const pathname = usePathname();

  return (
    <>
      <PlanFromQuery />
      <PageLayout>
        <ViewTransition enter="slide-in" exit="slide-out">
          <div className="space-y-8">
            <div className="space-y-2">
              <Heading as="h1">{heading}</Heading>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            {children}
          </div>
        </ViewTransition>

        <ControlBar />

        <InsightCards excludeHref={pathname} />

        <AssumptionsCallout />

        <RelatedContent />
      </PageLayout>
    </>
  );
}
