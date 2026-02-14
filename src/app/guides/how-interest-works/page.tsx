import type { Metadata } from "next";
import { AppErrorBoundary } from "@/components/ErrorBoundary";
import { InterestGuide } from "@/components/guides/how-interest-works/InterestGuide";

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
