import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GUIDES } from "@/lib/guides";

export default function GuidesPage() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Guides</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <Heading as="h1">Student Loan Guides</Heading>
          <p className="text-muted-foreground">
            In-depth guides to help you understand UK student loan repayment,
            interest, and how it fits into your wider finances.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block h-full"
          >
            <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <HugeiconsIcon icon={BookOpen01Icon} className="size-5" />
                </div>
                <h2 className="font-medium">
                  {guide.title}
                  {guide.isNew && (
                    <span className="ml-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 align-middle text-xs font-medium text-primary">
                      New
                    </span>
                  )}
                </h2>
              </div>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">
                {guide.description}
              </p>
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                Read Guide
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
