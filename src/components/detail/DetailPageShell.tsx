"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Controls } from "@/components/home/instrument/Controls";
import { Readout } from "@/components/home/instrument/Readout";
import { PresentValueToggle } from "@/components/home/PresentValueToggle";
import { WideLayout } from "@/components/layout/WideLayout";
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
import { useInputPanelMode } from "@/hooks/useInputPanelMode";
import {
  FOLD_CHART_BODY,
  FOLD_PAD,
  FOLD_WORKSPACE,
  FOLD_ZONE,
  SHELL_GUTTER,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { RelatedGuidesSection } from "./RelatedContent";

interface DetailPageShellProps {
  /** The metric's name — the h1, and the breadcrumb leaf. */
  heading: string;
  /** The one-line dek under the h1. */
  description: string;
  /**
   * The page's answer: a `FoldAnswer` carrying the headline figure and the
   * reading of it in words. Sits under the h1 in the head zone — where the
   * homepage puts its thesis.
   */
  answer: ReactNode;
  /**
   * The working behind the figure — a `ChartFrame` whose `bodyClassName` is
   * {@link FOLD_CHART_BODY}. Fills the middle zone. Pass `null` while the
   * simulation resolves and the shell holds the slot with a stand-in.
   */
  chart: ReactNode;
}

/**
 * The shared shell for the four calculator detail pages (`/repaid`, `/balance`,
 * `/interest`, `/effective-rate`).
 *
 * Built on {@link FOLD_WORKSPACE} — the homepage's own fold grammar — because
 * these pages are where the homepage's readout leads. A reader arrives by
 * clicking a figure in the right-hand rail of the homepage fold, and everything
 * they might do next is something the homepage has already taught them where to
 * find: change the salary (left rail), read the chart (middle), open another
 * figure (right rail). Keeping all three in place means opening a figure swaps
 * the middle and marks the cell they came from, rather than rebuilding the room
 * around them.
 *
 * The rail and the console are the homepage's own components, not lookalikes.
 * Anything else and the figure a reader clicked could be formatted one way
 * before the navigation and another after it, or the presets could reflow into
 * a different shape on landing — the two surfaces have to be the same surface.
 */
export function DetailPageShell({
  heading,
  description,
  answer,
  chart,
}: DetailPageShellProps) {
  const pathname = usePathname();
  const {
    mode,
    hasPersonalised,
    handlePersonalise,
    handlePresetApplied,
    handleWizardComplete,
    handleWizardClose,
  } = useInputPanelMode();

  return (
    <>
      <PlanFromQuery />
      <WideLayout>
        {/* Not a landmark: the h1 in the head zone names this block, and a
            region labelled the same as the page heading is noise in a landmark
            list. */}
        <div className={`${SHELL_GUTTER} ${FOLD_PAD}`}>
          <div className={FOLD_WORKSPACE}>
            {/* The breadcrumb rides inside the head zone rather than above the
                grid, so the fold's first row starts at the same y as the
                homepage's. The rail the reader just clicked in is then in
                exactly the place they left it, not a row lower. */}
            <div
              className={cn(FOLD_ZONE.head, "md:self-center work:self-start")}
            >
              <Breadcrumb className="mb-[0.7rem]">
                <BreadcrumbList className="text-meta">
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/" />}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{heading}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Heading as="h1" size="section">
                {heading}
              </Heading>
              <p className="mt-2 text-body text-pretty text-muted-foreground">
                {description}
              </p>
              <div className="mt-[clamp(1.1rem,1.8vw,1.6rem)]">{answer}</div>
            </div>

            <div className={cn(FOLD_ZONE.chart, "min-w-0 work:self-stretch")}>
              {/* The stand-in is here rather than in each page so it can never
                  drift from the height the loaded chart resolves to. */}
              {chart ?? (
                <Skeleton
                  className={cn("w-full rounded-xl", FOLD_CHART_BODY)}
                />
              )}
            </div>

            <Readout onTailor={handlePersonalise} activeHref={pathname} />

            <Controls
              mode={mode}
              hasPersonalised={hasPersonalised}
              handlePersonalise={handlePersonalise}
              handlePresetApplied={handlePresetApplied}
              handleWizardComplete={handleWizardComplete}
              handleWizardClose={handleWizardClose}
              footer={<PresentValueToggle />}
            />
          </div>
        </div>

        <RelatedGuidesSection intro="Background on the rules these figures come out of — how interest accrues, and what the thresholds do." />
      </WideLayout>
    </>
  );
}
