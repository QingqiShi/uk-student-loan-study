import Link from "next/link";
import type { ReactNode } from "react";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * A tool page's masthead — a document header, not a hero.
 *
 * The h1 is what people searched for, so it has to be the h1; but it is a
 * signpost, not the argument. It is set as a title line with the dek alongside
 * rather than stacked above it, and a hairline closes the block: everything
 * below that rule is the instrument, and the fold's weight is left for the
 * answer — the verdict on the overpay page, the figures on a detail page.
 *
 * Shared by every full-bleed tool page under `WideLayout`, so the treatment and
 * the gap down to the fold are defined once. It owns that gap because the fold
 * always follows it directly.
 */
export function PageNameplate({
  title,
  dek,
  crumb = title,
}: {
  /** The h1 — the page's searched-for name. */
  title: string;
  /** The one-line dek, set on the title's baseline. */
  dek: ReactNode;
  /** Breadcrumb leaf. Defaults to `title`; pass a shorter form when the h1 is long. */
  crumb?: string;
}) {
  return (
    <div className="mb-[clamp(1.2rem,2.6vw,2.4rem)] border-b border-border pb-[clamp(0.9rem,1.6vw,1.4rem)]">
      <Breadcrumb className="mb-[0.7rem]">
        <BreadcrumbList className="text-meta">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{crumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title and dek share a baseline and a size step; weight and colour
          separate them, so the pair reads as one masthead line rather than a
          headline with a subtitle under it. */}
      <div className="flex flex-wrap items-baseline gap-x-[clamp(0.7rem,1.4vw,1.2rem)] gap-y-[0.2rem]">
        <Heading as="h1" size="subsection">
          {title}
        </Heading>
        <p className="max-w-[62ch] text-body text-pretty text-muted-foreground">
          {dek}
        </p>
      </div>
    </div>
  );
}
