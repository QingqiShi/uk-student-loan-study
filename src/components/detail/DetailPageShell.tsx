"use client";

import Link from "next/link";
import { DetailPageNav } from "./DetailPageNav";
import { RelatedContent } from "./RelatedContent";
import { InputPanel } from "@/components/home/InputPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { AssumptionsCallout } from "@/components/shared/AssumptionsCallout";
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
import { useInputPanelMode } from "@/hooks/useInputPanelMode";

interface DetailPageShellProps {
  pageTitle: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}

export function DetailPageShell({
  pageTitle,
  heading,
  description,
  children,
}: DetailPageShellProps) {
  const {
    mode,
    hasPersonalized,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode();

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
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <Heading as="h1">{heading}</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>
        </div>

        <DetailPageNav />

        {children}

        <InputPanel
          hasPersonalized={hasPersonalized}
          mode={mode}
          onPersonalise={handlePersonalise}
          onPresetApplied={handlePresetApplied}
          onWizardComplete={handleWizardComplete}
          onWizardClose={handleWizardClose}
        />

        <AssumptionsCallout />

        <RelatedContent />
      </PageLayout>
    </>
  );
}
