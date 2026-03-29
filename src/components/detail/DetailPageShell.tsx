"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { RelatedContent } from "./RelatedContent";

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
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{heading}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-1">
            <Heading as="h1">{heading}</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>
        </div>

        {children}

        <ControlBar />

        <InsightCards excludeHref={pathname} />

        <AssumptionsCallout />

        <RelatedContent />
      </PageLayout>
    </>
  );
}
