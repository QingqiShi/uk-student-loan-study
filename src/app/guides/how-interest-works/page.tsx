import type { Metadata } from "next";
import { InterestGuide } from "@/components/guides/how-interest-works/InterestGuide";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  alternates: { canonical: "/guides/how-interest-works" },
};

export default function HowInterestWorksRoute() {
  return (
    <AppErrorBoundary>
      <InterestGuide />
    </AppErrorBoundary>
  );
}
