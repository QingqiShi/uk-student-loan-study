import {
  buildPlanMetadata,
  planBreadcrumbSchema,
  planFaqSchema,
} from "@/lib/planContent";

export const metadata = buildPlanMetadata("POSTGRADUATE");

// Note: JSON-LD scripts render in body for nested layouts (Next.js limitation).
// Google reads JSON-LD from anywhere in the document, so this is equivalent.
export default function PostgraduateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planBreadcrumbSchema("POSTGRADUATE")),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(planFaqSchema("POSTGRADUATE")),
        }}
      />
      {children}
    </>
  );
}
