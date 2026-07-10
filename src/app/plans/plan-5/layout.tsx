import {
  buildPlanMetadata,
  planBreadcrumbSchema,
  planFaqSchema,
} from "@/lib/planContent";

export const metadata = buildPlanMetadata("PLAN_5");

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is equivalent.
export default function Plan5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planBreadcrumbSchema("PLAN_5")),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planFaqSchema("PLAN_5")),
        }}
      />
      {children}
    </>
  );
}
