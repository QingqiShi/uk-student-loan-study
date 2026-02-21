import type { Metadata } from "next";
import { OurDataPage } from "@/components/our-data/OurDataPage";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  title: "Our Data",
  description:
    "Every figure in our calculators comes from GOV.UK and the Bank of England, verified daily by automation. Cross-check them yourself.",
  alternates: { canonical: "/our-data" },
};

export default function OurDataRoute() {
  return (
    <AppErrorBoundary>
      <OurDataPage />
    </AppErrorBoundary>
  );
}
