import Link from "next/link";
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
 * The page's masthead — a document header, not a hero.
 *
 * "Student Loan Overpayment Calculator" is what people searched for, so it has
 * to be the h1; but it is a signpost, not the argument. It is set as a title
 * line with the dek alongside rather than stacked above it, and a hairline
 * closes the block: everything below that rule is the instrument, and the
 * fold's weight is left for the verdict.
 */
export function OverpayNameplate() {
  return (
    <div className="border-b border-border pb-[clamp(0.9rem,1.6vw,1.4rem)]">
      <Breadcrumb className="mb-[0.7rem]">
        <BreadcrumbList className="text-meta">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overpay Calculator</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title and dek share a baseline and a size step; weight and colour
          separate them, so the pair reads as one masthead line rather than a
          headline with a subtitle under it. */}
      <div className="flex flex-wrap items-baseline gap-x-[clamp(0.7rem,1.4vw,1.2rem)] gap-y-[0.2rem]">
        <Heading as="h1" size="subsection">
          Student Loan Overpayment Calculator
        </Heading>
        <p className="max-w-[52ch] text-body text-pretty text-muted-foreground">
          Should you overpay or invest? See which leaves you better off.
        </p>
      </div>
    </div>
  );
}
