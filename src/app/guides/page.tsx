import Link from "next/link";
import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import { PageLayout } from "@/components/layout/PageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
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

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK Student Loan Guides",
  description:
    "In-depth guides to help you understand UK student loan repayment, interest, and how it fits into your wider finances.",
  numberOfItems: GUIDES.length,
  itemListElement: GUIDES.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: guide.title,
    url: `https://studentloanstudy.uk/guides/${guide.slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://studentloanstudy.uk",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://studentloanstudy.uk/guides",
    },
  ],
};

export default function GuidesPage() {
  return (
    <PageLayout>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <header className="space-y-4">
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

        <div className="space-y-3">
          <Heading as="h1" size="page-hero">
            Student loan guides
          </Heading>
          <p className="max-w-2xl text-lead text-pretty text-muted-foreground">
            In-depth guides to help you understand UK student loan repayment,
            interest, and how it fits into your wider finances — every figure
            sourced from the same GOV.UK data as the calculator.
          </p>
        </div>
      </header>

      <LinkIndex>
        {GUIDES.map((guide) => {
          const isNew =
            guide.newUntil != null && new Date() < new Date(guide.newUntil);
          return (
            <LinkIndexRow
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              title={guide.title}
              description={guide.description}
              badge={isNew ? "New" : undefined}
            />
          );
        })}
      </LinkIndex>
    </PageLayout>
  );
}
