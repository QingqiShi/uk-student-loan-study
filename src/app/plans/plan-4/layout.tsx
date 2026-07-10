import {
  buildPlanMetadata,
  planBreadcrumbSchema,
  planFaqSchema,
} from "@/lib/planContent";

export const metadata = buildPlanMetadata("PLAN_4");

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is equivalent.
export default function Plan4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planBreadcrumbSchema("PLAN_4")),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planFaqSchema("PLAN_4")),
        }}
      />
      {children}
    </>
  );
}
